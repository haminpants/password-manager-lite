import { invoke } from "@tauri-apps/api/core";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useVault from "./hooks/useVault";



export default function AddEntry({ profile }) {

  const navigate = useNavigate();

  const [app, setApp] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const {
    addEntry
  } = useVault(profile);

  async function handleSubmit(event) {
    event.preventDefault();

    const newEntry = {
      id: Date.now(),
      app,
      username,
      password
    };

    await invoke("add_entry", {
        profileUsername: profile.username,
        entry: newEntry
    });
    
    navigate("/Vault");

  }


  return (
    <div>
      <h1>Add Entry</h1>

      <form onSubmit={handleSubmit}>

        <label>
          App
        </label>
        <input
          value={app}
          onChange={(e) => setApp(e.target.value)}
        />


        <label>
          Username
        </label>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />


        <label>
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />


        <button type="submit">
          Save
        </button>

      </form>

    </div>
  );
}