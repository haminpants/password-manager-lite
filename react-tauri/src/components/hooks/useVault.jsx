import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";


export default function useVault(profile) {

  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);


  async function loadEntries() {
    try {
      const vaultJSON = await invoke("get_credentials");
      const vault = JSON.parse(vaultJSON);
      const currentProfile = vault.profiles.find(
        (storedProfile) =>
          storedProfile.username === profile.username
      );

      setEntries(currentProfile.entries);

    } catch(error) {
      console.error("Could not load entries:", error);
    } finally {
      setLoading(false);
    }
  }

  async function addEntry(entry) {

      await invoke("add_entry", {
          profileUsername: profile.username,
          entry: JSON.stringify(entry)
      });

      await loadEntries();
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
    addEntry
  };
}