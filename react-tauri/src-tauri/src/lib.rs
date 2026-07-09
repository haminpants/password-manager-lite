use std::fs;

// #[tauri::command]
// fn get_credentials() -> Result<String, String> {
//     Err("Rust command was reached!".to_string())
// }


// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn get_credentials() -> Result<String, String> {
    let data = fs::read_to_string("vault.json")
        .map_err(|error| error.to_string())?;

    Ok(data)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            get_credentials
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}


