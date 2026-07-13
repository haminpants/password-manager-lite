import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { InputShake } from "./InputShake";

//TODO: Add logic for adding new accounts


export default function LogIn({ setProfile }) {
  const navigate = useNavigate();
  const [profileName, setProfileName] = useState("");
  const [profilePassword, setProfilePassword] = useState("");
  const [message, setMessage] = useState("");
  const [logInAttempts, setLogInAttempts] = useState(0);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!profileName.trim() || !profilePassword) {
      setMessage("Please enter both profile and password.\nusername:1\npassword:1");
      console.log("Called within parent LoginFailed (before increment): " + logInAttempts)
      console.log("Called within parent LoginFailed: " + logInAttempts)
      return;
    }

    try {

      const vaultJSON = await invoke("get_credentials");
      const vault = JSON.parse(vaultJSON);
      const profiles = vault.profiles;

      const matchingProfile  = profiles.find(
        (profile) =>
          profile.username === profileName &&
          profile.password === profilePassword
      );

      if (matchingProfile) {
        setProfile(matchingProfile);
        setMessage("Log-In successful");
        navigate("/Vault");
      } else {
        setMessage("Invalid username or password");
        setLogInAttempts(prev => prev + 1 );
      }

    } catch (error) {
      setMessage("Could not load credentials");
    }
  };

  
  useEffect(() => {
    console.log("Login attempts changed:", logInAttempts);
  }, [logInAttempts]);

  return (
    <div className="flex flex-col justify-center items-center h-screen gap-12">

      <h1 className="text-sky-300 text-4xl">
        Password Manager
      </h1>

      <form className="flex flex-col gap-2" 
        onSubmit={handleSubmit}>

        <label htmlFor="username">Profile</label>
        <InputShake message="Invalid profile or password" triggerError={logInAttempts}>
          <input
            className="border border-grey px-1"
            id="username"
            name="username"
            type="text"
            value={profileName}
            onChange={(event) => setProfileName(event.target.value)}
            autoComplete="username"
          />
        </InputShake>

        <label htmlFor="password">Password</label>
        <InputShake message="Invalid profile or password" triggerError={logInAttempts}>
          <input
            className="border border-grey px-1"
            id="password"
            name="password"
            type="password"
            value={profilePassword}
            onChange={(event) => setProfilePassword(event.target.value)}
            autoComplete="current-password"
          />
        </InputShake>

        <button className="mt-3 text-sky-300 hover:text-sky-700"
           type="submit">Unlock</button>
      </form>
      <p className="whitespace-pre-line text-center">
        {message}
      </p>
    </div>
  );
}
