import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { invoke } from "@tauri-apps/api/core";

//TODO: Optional: Logic for adding new accounts (We can stick to only one account for now)


export default function LogIn({ setProfile }) {
  const navigate = useNavigate();
  const [profileName, setProfileName] = useState("");
  const [profilePassword, setProfilePassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!profileName.trim() || !profilePassword) {
      setMessage("Please enter both username and password.");
      return;
    }

    try {
      console.log("1. Calling Rust get_credentials...");

      const vaultJSON = await invoke("get_credentials");

      console.log("2. Raw vault JSON:");
      console.log(vaultJSON);

      const vault = JSON.parse(vaultJSON);
      const profiles = vault.profiles;

      console.log("3. Parsed vault:");
      console.log(vault);


      const matchingProfile  = profiles.find(
        (profile) =>
          profile.username === profileName &&
          profile.password === profilePassword
      );

      console.log("5. Matching profile:");
      console.log(matchingProfile);

      if (matchingProfile) {
        setProfile(matchingProfile);
        setMessage("Log-In successful");
        navigate("/Vault");
      } else {
        setMessage("Invalid username or password");
      }

    } catch (error) {
      setMessage("Could not load credentials");
    }
  };

  return (
    <div>
      <h1 className="text-sky-300">Log In</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username</label>
        <input
          id="username"
          name="username"
          type="text"
          value={profileName}
          onChange={(event) => setProfileName(event.target.value)}
          placeholder="Enter username"
          autoComplete="username"

        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          value={profilePassword}
          onChange={(event) => setProfilePassword(event.target.value)}
          placeholder="Enter password"
          autoComplete="current-password"
        />

        <button type="submit">Log In</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
