use std::fs;
use tauri::Manager;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
struct Vault {
    profiles: Vec<Profile>,
}

#[derive(Serialize, Deserialize)]
struct Profile {
    username: String,
    password: String,
    entries: Vec<Entry>,
}

#[derive(Serialize, Deserialize)]
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
fn get_credentials(app: tauri::AppHandle) -> Result<String, String> {

    println!("1. get_credentials called");

    let path = get_vault_path(&app)?;

    println!("2. Vault path: {:?}", path);
    
    let data = fs::read_to_string(path)
        .map_err(|error| {
            println!("Read error: {}", error);
            error.to_string()
        })?;

    println!("4. File contents:");
    println!("{}", data);

    Ok(data)
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
fn add_entry(app: tauri::AppHandle, profile_username: String, entry: Entry) -> Result<(), String> {

    let mut vault = load_vault(&app)?;
    let profile = vault.profiles
        .iter_mut()
        .find(|profile| profile.username == profile_username);

    match profile {
        Some(profile) => {
            profile.entries.push(entry);
        }

        None => {
            return Err("Profile not found".to_string());
        }
    }

    save_vault(&app, &vault)?;
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
fn delete_entry(app: tauri::AppHandle, profile_username: String, entry_id: u64) -> Result<(), String> {
    let mut vault = load_vault(&app)?;
    let profile = vault.profiles
        .iter_mut()
        .find(|profile| profile.username == profile_username);

    match profile {
        Some(profile) => {
            profile.entries.retain(|entry| entry.id != entry_id);
        }

        None => {
            return Err("Profile not found".to_string());
        }
    }

    save_vault(&app, &vault)?;
    Ok(())
}


fn load_vault(app: &tauri::AppHandle) -> Result<Vault, String> {
    let path = get_vault_path(app)?;
    let data = fs::read_to_string(&path)
        .map_err(|error| error.to_string())?;
    let vault: Vault = serde_json::from_str(&data)
        .map_err(|error| error.to_string())?;

    Ok(vault)
}

fn save_vault(app: &tauri::AppHandle, vault: &Vault) -> Result<(), String> {
    let path = get_vault_path(app)?;
    let json = serde_json::to_string_pretty(vault)
        .map_err(|error| error.to_string())?;
    fs::write(path, json)
        .map_err(|error| error.to_string())?;

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
        println!("Creating vault at: {:?}", path);
        let default_vault = Vault {
            profiles: vec![
                Profile {
                    username: "1".to_string(),
                    password: "1".to_string(),
                    entries: vec![],
                }
            ],
        };

        let json = serde_json::to_string_pretty(&default_vault)
            .map_err(|error| error.to_string())?;

        fs::create_dir_all(
            path.parent().unwrap()
        )
        .map_err(|error| error.to_string())?;

        fs::write(path, json)
            .map_err(|error| error.to_string())?;
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
            delete_entry
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
