import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Form from "./Form";
import InputText from "./InputText"
import { invoke } from "@tauri-apps/api/core";

/**
  * @name AddProfile
  * @description
  * ----
  * 
  * ###### Description
  * - AddProfile is the page where users create a new profile for the password manager.
  * 
  * - AddProfile collects a profile name and password through {@link Form}.
  * 
  * - When the form is submitted, AddProfile creates a new profile by calling the *add_profile* tauri-command.
  * 
  * - After the profile is successfully created, the user is returned to {@link LogIn}.
  * 
  * ----
  * 
  * ###### Implementation Logic
  * 
  * Form calls **handleSubmit()** when the user submits the form.
  * 
  * **handleSubmit()**
  * 
  * - Prevents the default form submission behaviour.
  * 
  * - Checks that both the profile name and password have been entered.
  * 
  * - Calls the *add_profile* tauri-command to save the new profile to *vault.json*.
  * 
  * - Navigates back to {@link LogIn} after the profile is successfully created.
  * 
  * - Displays a status message if validation fails or if the profile cannot be created.
  * 
  * ----
  * 
  * @returns {JSX.Element} The Add Profile page
  */
export default function AddProfile() {
    
    const navigate = useNavigate();

    const [profileNameInput, setProfileNameInput] = useState("");
    const [passwordInput, setPasswordInput] = useState("");
    const [statusMessage, setStatusMessage] = useState("");


    async function handleSubmit(event) {
        event.preventDefault();

        if (!profileNameInput.trim() || !passwordInput) {
            setStatusMessage("Please enter username and password.");
            return;
        }

        try {
            await invoke("add_profile", {
                username: profileNameInput,
                password: passwordInput
            });

            navigate("/");

        } catch(error) {
            console.error("Could not add profile:", error);
            setStatusMessage(error);
        }
    }

    return(
        <div>
            <Form
                title="Add Profile"
                submitButtonText="Add Profile"
                onSubmit={handleSubmit}
                alternateButtonText={"Cancel"}
                alternateAction={() => 
                    navigate("/")
                }
                statusMessage={statusMessage}
            >

                <InputText
                label="Profile"
                type="username"
                value={profileNameInput}
                onChange={setProfileNameInput}
                message="Invalid"
                />
                <InputText
                label="Password"
                type = "password"
                value={passwordInput}
                onChange={setPasswordInput}
                message="Invalid"
                />

            </Form>
        </div>
    )
}