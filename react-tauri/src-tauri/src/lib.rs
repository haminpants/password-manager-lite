use aes_gcm::{
    aead::{Aead, KeyInit},
    Aes256Gcm, Nonce,
};
use argon2::{
    password_hash::{PasswordHasher, SaltString},
    Argon2,
};
use base64::{engine::general_purpose::STANDARD, Engine as _};
use serde::{Deserialize, Serialize};
use std::fs;
use tauri::Manager;

#[derive(Serialize, Deserialize)]
struct EncryptedVault {
    profiles: Vec<EncryptedProfile>,
}

#[derive(Serialize, Deserialize)]
struct EncryptedProfile {
    username: String,
    ciphertext: String,
    salt: String,
    nonce: String,
}

#[derive(Serialize, Deserialize, Clone)]
struct Profile {
    username: String,
    password: String,
    entries: Vec<Entry>,
}

#[derive(Serialize, Deserialize, Clone)]
struct Entry {
    id: u64,
    app: String,
    username: String,
    password: String,
}

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

/// Tauri command used by the frontend to retrieve the vault data.
///
/// Reads the `vault.json` file from the application's data directory and
/// returns the contents as a JSON string.
///
/// # Arguments
///
/// * `app` - Tauri application handle used to access the vault file location.
///
/// # Errors
///
/// Returns an error string if the vault file cannot be read.
#[tauri::command]
fn get_credentials(
    app: tauri::AppHandle,
    username: String,
    password: String,
) -> Result<String, String> {
    let profile = load_profile(&app, &username, &password)?;
    serde_json::to_string(&profile).map_err(|e| e.to_string())
}

/// Tauri command used to save a new entry into a user's profile.
///
/// Loads the current vault, finds the matching profile, adds the entry, and
/// saves the updated vault.
///
/// # Arguments
///
/// * `app` - Tauri application handle used to access the vault file.
/// * `profile_username` - Username of the profile where the entry will be added.
/// * `entry` - The entry data that will be saved.
///
/// # Errors
///
/// Returns an error string if the vault cannot be loaded/saved or the profile
/// is not found.
#[tauri::command]
fn add_entry(
    app: tauri::AppHandle,
    username: String,
    password: String,
    entry: Entry,
) -> Result<(), String> {
    let mut profile = load_profile(&app, &username, &password)?;
    profile.entries.push(entry);
    save_profile(&app, &profile, &password)?;
    println!("Entry Added");

    Ok(())
}

/// Tauri command used to remove an entry from a user's profile.
///
/// Loads the current vault, finds the matching profile, removes the entry
/// by ID, and saves the updated vault.
///
/// # Arguments
///
/// * `app` - Tauri application handle used to access the vault file.
/// * `profile_username` - Username of the profile containing the entry.
/// * `entry_id` - ID of the entry that should be deleted.
///
/// # Errors
///
/// Returns an error string if the vault cannot be loaded/saved or the profile
/// is not found.
#[tauri::command]
fn delete_entry(
    app: tauri::AppHandle,
    profile_username: String,
    profile_password: String,
    entry_id: u64,
) -> Result<(), String> {
    let mut profile = load_profile(&app, &profile_username, &profile_password)?;
    profile.entries.retain(|entry| entry.id != entry_id);
    save_profile(&app, &profile, &profile_password)?;

    Ok(())
}


/// Tauri command used to copy selected entry's username and password

#[tauri::command]
fn get_entry(
    app: tauri::AppHandle,
    profile_username: String,
    password: String,
    entry_id: u64,
) -> Result<Entry, String> {
    let profile = load_profile(&app, &profile_username, &password)?;

    let entry = profile.entries
        .iter()
        .find(|e| e.id == entry_id)
        .ok_or("Entry not found")?;

    Ok(entry.clone())
}

/// Tauri command used to create a new profile.
///
/// Loads the current vault, checks whether the username already exists,
/// creates a new profile with an empty list of entries, and saves the
/// updated vault.
///
/// # Arguments
///
/// * `app` - Tauri application handle used to access the vault file.
/// * `username` - Username for the new profile.
/// * `password` - Password for the new profile.
///
/// # Errors
///
/// Returns an error string if the vault cannot be loaded or saved, or if
/// a profile with the same username already exists.
#[tauri::command]
fn add_profile(app: tauri::AppHandle, username: String, password: String) -> Result<(), String> {
    let vault = get_encrypted_vault(&app)?;

    if vault.profiles.iter().any(|p| p.username == username) {
        return Err("Profile already exists".to_string());
    }

    let new_profile = Profile {
        username,
        password: password.clone(),
        entries: vec![],
    };

    save_profile(&app, &new_profile, &password)?;
    Ok(())
}

fn save_profile(app: &tauri::AppHandle, profile: &Profile, password: &str) -> Result<(), String> {
    let mut vault = get_encrypted_vault(app)?;

    let plaintext_json = serde_json::to_string(profile).map_err(|e| e.to_string())?;

    let (ciphertext, salt, nonce) = encrypt_data(&plaintext_json, password)?;

    let updated_enc_profile = EncryptedProfile {
        username: profile.username.clone(),
        ciphertext,
        salt,
        nonce,
    };

    if let Some(existing) = vault
        .profiles
        .iter_mut()
        .find(|p| p.username == profile.username)
    {
        *existing = updated_enc_profile;
    } else {
        vault.profiles.push(updated_enc_profile);
    }

    println!("Entry saved");
    save_encrypted_vault(app, &vault)
}

fn load_profile(app: &tauri::AppHandle, username: &str, password: &str) -> Result<Profile, String> {
    let vault = get_encrypted_vault(app)?;

    let enc_profile = vault
        .profiles
        .iter()
        .find(|p| p.username == username)
        .ok_or_else(|| "Profile not found".to_string())?;

    let decrypted_json = decrypt_data(
        &enc_profile.ciphertext,
        &enc_profile.salt,
        &enc_profile.nonce,
        password,
    )?;

    serde_json::from_str(&decrypted_json)
        .map_err(|e| format!("Failed to parse profile data: {}", e))
}

fn random_bytes<const N: usize>() -> Result<[u8; N], String> {
    let mut bytes = [0u8; N];
    getrandom::fill(&mut bytes).map_err(|e| format!("Random generation error: {e}"))?;
    Ok(bytes)
}

fn encrypt_data(
    plaintext: &str,
    master_password: &str,
) -> Result<(String, String, String), String> {
    let salt_raw = random_bytes::<16>()?;
    let salt = SaltString::encode_b64(&salt_raw).map_err(|e| format!("Salt error: {e}"))?;

    let argon2 = Argon2::default();
    let password_hash = argon2
        .hash_password(master_password.as_bytes(), &salt)
        .map_err(|e| format!("Argon2 error: {e}"))?;

    let key_bytes = password_hash.hash.unwrap();

    let nonce_raw = random_bytes::<12>()?;
    let nonce = Nonce::from(nonce_raw);

    let cipher =
        Aes256Gcm::new_from_slice(key_bytes.as_bytes()).map_err(|e| format!("Key error: {e}"))?;

    let ciphertext = cipher
        .encrypt(&nonce, plaintext.as_bytes())
        .map_err(|e| format!("Encryption error: {e:?}"))?;

    Ok((
        STANDARD.encode(ciphertext),
        salt.as_str().to_string(),
        STANDARD.encode(nonce_raw),
    ))
}

fn decrypt_data(
    ciphertext_b64: &str,
    salt_b64: &str,
    nonce_b64: &str,
    master_password: &str,
) -> Result<String, String> {
    let salt = SaltString::from_b64(salt_b64).map_err(|e| format!("Invalid salt encoding: {e}"))?;

    let argon2 = Argon2::default();
    let password_hash = argon2
        .hash_password(master_password.as_bytes(), &salt)
        .map_err(|e| format!("Argon2 key derivation failed: {e}"))?;

    let key_bytes = password_hash.hash.unwrap();

    let cipher =
        Aes256Gcm::new_from_slice(key_bytes.as_bytes()).map_err(|e| format!("Key error: {e}"))?;

    let nonce_bytes = STANDARD
        .decode(nonce_b64)
        .map_err(|e| format!("Invalid nonce Base64: {e}"))?;

    let ciphertext_bytes = STANDARD
        .decode(ciphertext_b64)
        .map_err(|e| format!("Invalid ciphertext Base64: {e}"))?;

    let nonce_array: [u8; 12] = nonce_bytes
        .try_into()
        .map_err(|_| "Invalid nonce length: expected 12 bytes".to_string())?;

    let nonce = Nonce::from(nonce_array);

    let plaintext_bytes = cipher
        .decrypt(&nonce, ciphertext_bytes.as_ref())
        .map_err(|_| "Decryption failed: Incorrect password or tampered data".to_string())?;

    String::from_utf8(plaintext_bytes)
        .map_err(|e| format!("Decrypted data is not valid UTF-8: {e}"))
}

fn get_encrypted_vault(app: &tauri::AppHandle) -> Result<EncryptedVault, String> {
    let path = get_vault_path(app)?;
    let data = fs::read_to_string(&path).map_err(|error| error.to_string())?;

    serde_json::from_str(&data).map_err(|error| error.to_string())
}

fn save_encrypted_vault(app: &tauri::AppHandle, vault: &EncryptedVault) -> Result<(), String> {
    let path = get_vault_path(app)?;
    let json = serde_json::to_string_pretty(vault).map_err(|error| error.to_string())?;

    fs::write(path, json).map_err(|error| error.to_string())?;

    Ok(())
}

/// Returns the location of `vault.json` on the user's device.
///
/// The path is created using Tauri's application data directory.
///
/// # Arguments
///
/// * `app` - Tauri application handle used to access the application data directory.
///
/// # Returns
///
/// The `PathBuf` pointing to `vault.json`.
fn get_vault_path(app: &tauri::AppHandle) -> Result<std::path::PathBuf, String> {
    let path = app
        .path()
        .app_data_dir()
        .map_err(|error| error.to_string())?
        .join("vault.json");

    println!("Vault path: {:?}", path);

    Ok(path)
}

/// Creates the initial `vault.json` file when the application starts.
///
/// If a vault file already exists, no changes are made.
///
/// # Arguments
///
/// * `app` - Tauri application handle used to access the vault file location.
fn initialize_vault(app: &tauri::AppHandle) -> Result<(), String> {
    let path = get_vault_path(app)?;

    if !path.exists() {
        if let Some(parent) = path.parent() {
            fs::create_dir_all(parent).map_err(|error| error.to_string())?;
        }

        let empty_vault = EncryptedVault { profiles: vec![] };
        let json = serde_json::to_string_pretty(&empty_vault).map_err(|error| error.to_string())?;

        fs::write(path, json).map_err(|error| error.to_string())?;
    }

    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            initialize_vault(&app.handle())?;
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            get_credentials,
            add_entry,
            delete_entry,
            add_profile,
            get_entry
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
