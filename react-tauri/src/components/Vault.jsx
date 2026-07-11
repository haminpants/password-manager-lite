import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { invoke } from "@tauri-apps/api/core";
import useVault from "./hooks/useVault";
import VaultItem from "./VaultItem";


// TODO: Display vaultItem with endless scroll
// TODO: Add back button
// TODO: Edit entry
// TODO: Copy Password and Copy Username
// TODO: Reformat 
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
    loading,
    deleteEntry
  } = useVault(profile);

  if (loading) {
    return <p>Loading...</p>;
  }    
    return (
      <div className="flex flex-col justify-center items-center h-screen gap-12">
        <h1 className="text-sky-300 text-4xl">
          Vault
        </h1>

        <button className="border p-1 rounded-sm"
          onClick={() => navigate("/Vault/AddEntry")}>
          Add Entry
        </button>
          {entries.map((entry) => (
            <VaultItem
              key={entry.id}
              entry={entry}
              onDelete={deleteEntry}
            />
          ))}
      </div>
    );
}


