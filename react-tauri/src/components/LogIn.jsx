import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { invoke } from "@tauri-apps/api/core";

//TODO: Add logic for adding new accounts


export default function LogIn({ setProfile }) {
  const navigate = useNavigate();
  const [profileName, setProfileName] = useState("");
  const [profilePassword, setProfilePassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!profileName.trim() || !profilePassword) {
      setMessage("Please enter both username and password.\nusername:1\npassword:1");
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
    <div className="flex flex-col justify-center items-center h-screen gap-12">

      <h1 className="text-sky-300 text-4xl">
        Password Manager
      </h1>

      <form className="flex flex-col gap-2" 
        onSubmit={handleSubmit}>

        <label htmlFor="username">Username</label>
        <input
          className="border border-grey px-1"
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
          className="border border-grey px-1"
          id="password"
          name="password"
          type="password"
          value={profilePassword}
          onChange={(event) => setProfilePassword(event.target.value)}
          placeholder="Enter password"
          autoComplete="current-password"
        />

        <button className="mt-3 text-sky-300 hover:text-sky-700"
           type="submit">Log In</button>
      </form>
      <p className="whitespace-pre-line text-center">
        {message}
      </p>
    </div>
  );
}
