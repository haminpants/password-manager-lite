import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";


export default function useVault() {

  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);


  async function loadVault() {
    try {
      const vaultJSON = await invoke("get_vault");
      const vault = JSON.parse(vaultJSON);
      const profile = vault.profiles[0];

      setEntries(profile.entries);

    } catch (error) {
      console.error("Could not load vault:", error);
    } finally {
      setLoading(false);
    }
  }


  async function addEntry(entry) {

    try {
      await invoke("add_entry", {
        entry: JSON.stringify(entry)
      });

      await loadVault();

    } catch (error) {
      console.error("Could not add entry:", error);
    }
  }


  async function deleteEntry(id) {

    try {
      await invoke("delete_entry", {
        id
      });

      await loadVault();

    } catch (error) {
      console.error("Could not delete entry:", error);
    }
  }


  useEffect(() => {
    loadVault();
  }, []);


  return {
    entries,
    loading,
    addEntry,
    deleteEntry
  };
}