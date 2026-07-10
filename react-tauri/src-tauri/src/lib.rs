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

fn get_vault_path(app: &tauri::AppHandle) -> Result<std::path::PathBuf, String> {
    let path = app
        .path()
        .app_data_dir()
        .map_err(|error| error.to_string())?
        .join("vault.json");

    println!("Vault path: {:?}", path);

    Ok(path)
}

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