import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";

/**
  * @name useVault
  * @description
  * ----
  * 
  * ###### Description
  * - useVault is a custom hook used to manage vault entries for the currently selected profile.
  * 
  * - useVault loads, adds, and deletes entries by communicating with Tauri commands.
  * 
  * - useVault provides the entry data and functions needed by {@link Vault} to display and manage entries.
  * 
  * ----
  * 
  * ###### Impelentation Logic
  * 
  * useVault receives the current profile and uses it to identify which vault entries should be loaded.
  * 
  * 
  * **loadEntries()**
  * 
  * - Retrieves the vault data using the {@link get_credentials} tauri-command.
  * 
  * - Finds the current profile and updates the entries state with its stored entries.
  * 
  * 
  * **addEntry()**
  * 
  * - Saves a new entry using the {@link add_entry} tauri-command.
  * 
  * - Reloads the entries after adding the new entry.
  * 
  * 
  * **deleteEntry()**
  * 
  * - Removes an entry using the {@link delete_entry} tauri-command.
  * 
  * - Reloads the entries after deletion.
  * 
  * ----
  * 
  * @param {Object} profile - The currently selected profile used to load and modify vault entries
  */

export default function useVault(profile, setProfile) {

  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  console.log("In useVault profile: ", {
    profile
  })


  async function loadEntries() {
    try {
      const vaultJSON = await invoke("get_credentials", {
        username: profile.vault.username,
        password: profile.master_password
      });
      const vault = JSON.parse(vaultJSON);

      setEntries(profile.vault.entries);

      console.log("Vault:", vault);
      console.log("Logged in profile:", profile);

    } catch (error) {
      console.error("Could not load entries:", error);
    } finally {
      setLoading(false);
    }
  }

  async function addEntry(entry) {
    await invoke("add_entry", {
      username: profile.vault.username,
      password: profile.master_password,
      entry: newEntry
    });

    await loadEntries();
  }

  async function deleteEntry(entryId) {

  const args = {
    profileUsername: profile.vault.username,
    profilePassword: profile.master_password,
    entryId: entryId
  };

  console.log("Sending to Rust:", args);

  await invoke("delete_entry", args);

  const updatedVault = await invoke("get_credentials", {
    username: profile.vault.username,
    password: profile.master_password
  });

  setProfile({
    vault: JSON.parse(updatedVault),
    master_password: profile.master_password
  });

  }

  useEffect(() => {
    if (profile) {
      loadEntries();
    }
  }, [profile]);

  return {
    entries,
    loading,
    loadEntries,
    addEntry,
    deleteEntry
  };
}