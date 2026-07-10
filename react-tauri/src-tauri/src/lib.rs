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
fn get_credentials() -> Result<String, String> {

    let data = fs::read_to_string("vault.json")
        .map_err(|error| error.to_string())?;

    let vault: Vault = serde_json::from_str(&data)
        .map_err(|error| error.to_string())?;

    Ok(data)
}

#[tauri::command]
fn add_entry(profile_username: String, entry: Entry) -> Result<(), String> {

    let data = fs::read_to_string("vault.json")
        .map_err(|error| error.to_string())?;
    let mut vault: Vault = serde_json::from_str(&data)
        .map_err(|error| error.to_string())?;
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

    let updated_json = serde_json::to_string_pretty(&vault)
        .map_err(|error| error.to_string())?;
    fs::write("vault.json", updated_json)
        .map_err(|error| error.to_string())?;

    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            get_credentials,
            add_entry
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}


