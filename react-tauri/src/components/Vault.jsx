import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { invoke } from "@tauri-apps/api/core";
import useVault from "./hooks/useVault";
import VaultItem from "./VaultItem";


// TODO: Add vaultItem
// TODO: Display vaultItem with endless scroll
// TODO: JSON must have unique key
// TODO: Optional
// TODO: Optional: Sort vaultItem
// TODO: Optional: Show date
// TODO: Optional: Search function

export default function Vault({ profile }) {

  const navigate = useNavigate();

  if (!profile) {
    return <p>No profile loaded</p>;
  }

  const {
    entries,
    loading
  } = useVault(profile);

  if (loading) {
    return <p>Loading...</p>;
  }    
    return (
      <div>
        <h1>Vault</h1>

        <button onClick={() => navigate("/Vault/AddEntry")}>
          Add Entry
        </button>

          {entries.map((entry) => (
            <VaultItem 
              key={entry.id}
              entry={entry}
            />
          ))}
      </div>
    );
}


