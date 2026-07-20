import { invoke } from "@tauri-apps/api/core";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useVault from "./hooks/useVault";
import Form from "./Form";
import InputText from "./InputText.jsx"

// TODO: Add password generator

/**
  * @name AddEntry
  * @description
  * ----
  * 
  * ###### Description
  * - AddEntry is where users create new entries for their vault.
  * 
  * - Users arrive to AddEntry from {@link Vault}. 
  * 
  * - AddEntry asks for the app, username, and password of the new entry via a submission form. 
  * 
  * - AddEntry saves the new entry in the currently selected {@link profile}. 
  * 
  * ----
  * 
  * 
  * ###### Impelentation Logic
  * From Vault, profile is passed as a prop then received in AddEntry:
  *
  * Vault:
  * 
  *       <AddEntry profile={profile} />
  * 
  *  AddEntry:
  * 
  *       function AddEntry({ profile })
  * 
  * 
  * The entry form is written with HTML tags.
  * Upon onSubmit, it calls the function *handleSubmit()*
  * 
  * 
  * 
  * **handleSubmit()**
  * 
  * - Prevents default behaviour of onSubmit.
  * 
  * - Creates the object *newEntry* and calls the {@link add_entry} tauri-command.
  * 
  * - *add_entry* saves the the entry natively in the device's file system.
  * 
  * - Navigates back to Vault.
  * 
  * ----
  * 
  * @param {Object} profile - The profile currently selected used to link the new entry
  */

function AddEntry({ profile }) {

    const navigate = useNavigate();

    const [appNameInput, setAppNameInput] = useState("");
    const [usernameInput, setUsernameInput] = useState("");
    const [passwordInput, setPasswordInput] = useState("");
    const [statusMessage, setStatusMessage] = useState(""); 


const passwordHandler = () => {
  const password = generatePassword(24);
  setPasswordInput(password);
};


const generatePassword = (
  length = 20,
  options = {
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  }
) => {
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const nums = "0123456789";
  const symbols = "!@#$%^&*()-_=+[]{};:,.<>?";

  let charset = "";

  if (options.uppercase) charset += upper;
  if (options.lowercase) charset += lower;
  if (options.numbers) charset += nums;
  if (options.symbols) charset += symbols;

  if (!charset) {
    throw new Error("No character sets selected");
  }

  const randomValues = new Uint32Array(length);
  crypto.getRandomValues(randomValues);

  let password = "";

  for (let i = 0; i < length; i++) {
    password += charset[randomValues[i] % charset.length];
  }

  return password;
};



async function handleSubmit(event) {
    event.preventDefault();

    if ( !appNameInput.trim() || !usernameInput.trim() || !passwordInput) {
        setStatusMessage("Please fill all boxes.");
        return;
    }

    const newEntry = {
        id: Date.now(),
        app: appNameInput,
        username: usernameInput,
        password: passwordInput
    };

    try {
        await invoke("add_entry", {
        profileUsername: profile.username,
        entry: newEntry
    });

        navigate("/Vault");
    } catch (error) {
            console.error("Could not add entry:", error);
    }
}   


  return (
    <div>
        

      <Form
        title="Add Entry"
        submitButtonText="Add Entry"
        onSubmit={handleSubmit}
        alternateButtonText={"Cancel"}
        alternateAction={() => 
            navigate("/Vault")
        }
        statusMessage={statusMessage}
      >

        <InputText
          label="App"
          value={appNameInput}
          onChange={setAppNameInput}
          message="Invalid"
        />


        <InputText
          label="Username"
          type="username"
          value={usernameInput}
          onChange={setUsernameInput}
          message="Invalid"
        />

        <InputText
          label="Password"
          type="password"
          value={passwordInput}
          onChange={setPasswordInput}
          message="Invalid"
          autoComplete={false}
        />

        {/* <Password Generator/> */} 
        <button 
          onClick={passwordHandler}
          className="text-(--text-muted) -mt-6 hover:text-(--secondary) mb-4"
        >
          Generate Password</button>

      </Form>

    </div>
  );
}

export default AddEntry;