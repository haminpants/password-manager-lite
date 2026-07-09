import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { invoke } from "@tauri-apps/api/core";
import VaultItem from "./VaultItem";


// TODO: Add vaultItem
// TODO: Display vaultItem with endless scroll
// TODO: Optional
// TODO: Optional: Sort vaultItem
// TODO: Optional: Show date
// TODO: Optional: Search function

export default function Vault() {
    
    return (
      <div>
        <h1>Vault</h1>
        <VaultItem />
      </div>
    );
}


