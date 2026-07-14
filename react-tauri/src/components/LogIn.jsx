import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { invoke } from "@tauri-apps/api/core";
import Form from "./Form";
import InputText from "./InputText";
import StatusMessage from "./StatusMessage";

// TODO: Increase contrast of the see password icon. 

/**
  * @name LogIn
  * @description
  * ----
  * 
  * ###### Description
  * - LogIn is the page where users enter their profile and password to access their vault.
  * 
  * - LogIn checks the entered credentials against profiles stored in *vault.json*.
  * 
  * - If successful, the selected profile is saved and the user is navigated to {@link Vault}.
  * 
  * - If unsuccessful, LogIn displays an error message and triggers {@link InputShake}.
  * 
  * ----
  * 
  * ###### Impelentation Logic
  * 
  * The login form calls **handleSubmit()** when the user submits their credentials.
  * 
  * **handleSubmit()**
  * 
  * - Checks that the user entered a profile and password.
  * 
  * - Calls the get_credentials tauri-command to retrieve vault data.
  * 
  * - Finds a matching profile from the stored profiles.
  * 
  * - If a profile is found, updates the current profile and navigates to {@link Vault}.
  * 
  * - If no profile is found, increases *logInAttempts* to trigger {@link InputShake}.
  * 
  * Note: The selected profile is stored in App.jsx and passed down to pages that need access to the current profile.
  * 
  * ----
  * 
  * @param {Function} setProfile - Function used to save the currently selected profile
  */

export default function LogIn({ setProfile }) {
  const navigate = useNavigate();

  const [profileNameInput, setProfileNameInput] = useState("");
  const [profilePasswordInput, setProfilePasswordInput] = useState("");
  const [message, setMessage] = useState("");
  const [logInAttempts, setLogInAttempts] = useState(0);


  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!profileNameInput.trim() || !profilePasswordInput) {
      setMessage("Please enter both profile and password.");
      return;
    }

    try {
      const vaultJSON = await invoke("get_credentials");
      const vault = JSON.parse(vaultJSON);

      const matchingProfile = vault.profiles.find(
        (profile) =>
          profile.username === profileNameInput &&
          profile.password === profilePasswordInput
      );


      if (matchingProfile) {
        setProfile(matchingProfile);
        setMessage("Log-In successful");
        navigate("/Vault");

      } else {
        setMessage("Invalid username or password");
        setLogInAttempts((prev) => prev + 1);
      }

    } catch (error) {
      setMessage("Could not load credentials");
    }
  };


  return (
    <div>

      <Form
        title="Password Manager"
        submitButtonText="Unlock"
        onSubmit={handleSubmit}
        alternateButtonText={"Add Profile"}
        alternateAction={() => navigate("/AddProfile")}
        statusMessage={message}
      >

        <InputText
          label="Profile"
          value={profileNameInput}
          onChange={setProfileNameInput}
          message="Invalid profile or password"
          triggerError={logInAttempts}
        />

        <InputText
          label="Password"
          type="password"
          value={profilePasswordInput}
          onChange={setProfilePasswordInput}
          message="Invalid profile or password"
          triggerError={logInAttempts}
        />

      </Form>

    </div>
  );
}