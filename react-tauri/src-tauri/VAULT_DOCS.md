# Vault Module Documentation

Tauri backend commands and helpers for managing the local credential vault
(`vault.json`).

## Data Structures

### `Vault`
Top-level container holding all user profiles.

| Field | Type | Description |
|---|---|---|
| `profiles` | `Vec<Profile>` | All profiles stored in the vault. |

### `Profile`
A single user profile and its saved credential entries.

| Field | Type | Description |
|---|---|---|
| `username` | `String` | Profile login username. |
| `password` | `String` | Profile login password. |
| `entries` | `Vec<Entry>` | Saved credential entries for this profile. |

### `Entry`
A single saved credential (e.g. for a third-party app/site).

| Field | Type | Description |
|---|---|---|
| `id` | `u64` | Unique identifier for the entry. |
| `app` | `String` | Name of the app/site the credential belongs to. |
| `username` | `String` | Username for that app/site. |
| `password` | `String` | Password for that app/site. |

---

## Tauri Commands

### `get_credentials`
```rust
fn get_credentials(app: tauri::AppHandle) -> Result<String, String>
```
Retrieves the vault data for the frontend.

- Reads `vault.json` from the application's data directory.
- Returns the raw file contents as a JSON string.

**Arguments**
- `app` — Tauri application handle used to locate the vault file.

**Errors**
- Returns an error string if the vault file cannot be read.

---

### `add_entry`
```rust
fn add_entry(app: tauri::AppHandle, profile_username: String, entry: Entry) -> Result<(), String>
```
Saves a new entry into a user's profile.

- Loads the current vault.
- Finds the profile matching `profile_username`.
- Appends `entry` to that profile's entries.
- Persists the updated vault back to disk.

**Arguments**
- `app` — Tauri application handle used to access the vault file.
- `profile_username` — Username of the profile to add the entry to.
- `entry` — The entry data to save.

**Errors**
- Returns `"Profile not found"` if no matching profile exists.
- Returns an error string if the vault cannot be loaded or saved.

---

### `delete_entry`
```rust
fn delete_entry(app: tauri::AppHandle, profile_username: String, entry_id: u64) -> Result<(), String>
```
Removes an entry from a user's profile.

- Loads the current vault.
- Finds the profile matching `profile_username`.
- Removes the entry whose `id` matches `entry_id`.
- Persists the updated vault back to disk.

**Arguments**
- `app` — Tauri application handle used to access the vault file.
- `profile_username` — Username of the profile containing the entry.
- `entry_id` — ID of the entry to delete.

**Errors**
- Returns `"Profile not found"` if no matching profile exists.
- Returns an error string if the vault cannot be loaded or saved.

---

## Internal Helpers

### `load_vault`
```rust
fn load_vault(app: &tauri::AppHandle) -> Result<Vault, String>
```
Reads and deserializes `vault.json` into a `Vault` struct.

### `save_vault`
```rust
fn save_vault(app: &tauri::AppHandle, vault: &Vault) -> Result<(), String>
```
Serializes a `Vault` struct to pretty-printed JSON and writes it to `vault.json`.

### `get_vault_path`
```rust
fn get_vault_path(app: &tauri::AppHandle) -> Result<std::path::PathBuf, String>
```
Returns the location of `vault.json` on the user's device, built from Tauri's
application data directory.

**Returns**
- `PathBuf` pointing to `vault.json`.

### `initialize_vault`
```rust
fn initialize_vault(app: &tauri::AppHandle) -> Result<(), String>
```
Creates the initial `vault.json` file on application startup, if one does not
already exist. Seeds it with a default profile (`username: "1"`, `password: "1"`).

---

## Entry Point

### `run`
```rust
pub fn run()
```
Tauri application entry point. Initializes the vault on setup and registers
the `get_credentials`, `add_entry`, and `delete_entry` commands as invoke
handlers.

