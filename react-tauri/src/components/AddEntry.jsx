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
    <div className="flex flex-col justify-center items-center h-screen gap-12">

      <h1 className="text-sky-300 text-4xl"
        >Add Entry</h1>

      <form className="flex flex-col gap-2" 
        onSubmit={handleSubmit}>

          <label>
            App
          </label>
          <input
            className="border border-grey px-1"
            value={app}
            onChange={(e) => setApp(e.target.value)}
          />


          <label>
            Username
          </label>
          <input
            className="border border-grey px-1" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />


          <label>
            Password
          </label>
          <input
            className="border border-grey px-1"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

        <button 
          className="mt-3 text-sky-300 hover:text-sky-700"
          type="submit">
            Save
        </button>

      </form>

    </div>
  );
}