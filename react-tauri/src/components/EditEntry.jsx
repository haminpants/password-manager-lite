import { invoke } from "@tauri-apps/api/core";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useVault from "./hooks/useVault";
import Form from "./Form";
import InputText from "./InputText.jsx";
import { useEffect } from "react";
import { useParams } from "react-router-dom";


/**
 * @name EditEntry
 * @description
 * ----
 *
 * ###### Description
 * - EditEntry is where users edit existing entries in their vault.
 *
 * - Users arrive to EditEntry from the contextMenu of Vault
 *
 * - EditEntry takes the id of the selected entry
 * ----
 *
 *
 * ###### Impelentation Logic
 * From Vault, profile and entryID is passed as a prop then received in EditEntry:
 *
 * Vault:
 *
 *       <EditEntry profile={profile} editEntry={editEntry} />
 *
 * EditEntry:
 *
 *       function EditEntry({ profile, editEntry })
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
 * - 
 *
 * ----
 *
 * 
 * @param {Object} profile - The profile currently selected used to link the new entry
 * @param {Object} setProfile - allows EditEntry to return the updated profile back to Vault.jsx 
 * @param {number} entryID - The entry currently selected for editing
*/

function EditEntry({ profile, setProfile }) {
    const navigate = useNavigate();
     const { entryID } = useParams();

    const [appNameInput, setAppNameInput] = useState("");
    const [usernameInput, setUsernameInput] = useState("");
    const [passwordInput, setPasswordInput] = useState("");
    const [statusMessage, setStatusMessage] = useState("");

    useEffect(() => {
        async function loadEntry() {
            try {

            const entry = await invoke("get_entry", {
                profileUsername: profile.vault.username,
                profilePassword: profile.master_password,
                entryId: Number(entryID),
            });

                setAppNameInput(entry.app);
                setUsernameInput(entry.username);
                setPasswordInput(entry.password);

            } catch (error) {
                console.error("Could not load entry:", error);
            }
        }

        loadEntry();
    }, []);


    async function handleSubmit(event) {
        event.preventDefault();

        if (!appNameInput.trim() || !usernameInput.trim() || !passwordInput) {
            setStatusMessage("Please fill all boxes.");
            return;
        }

        console.log("Current entryID:", entryID);
        console.log("Input values:", {
            appNameInput,
            usernameInput,
            passwordInput,
        });

        const updatedEntry = {
            id: Number(entryID),
            app: appNameInput,
            username: usernameInput,
            password: passwordInput,
        };

        try {
            console.log("Calling edit_entry with:", {
                profileUsername: profile.vault.username,
                profilePassword: profile.master_password,
                updatedEntry,
            });

            await invoke("edit_entry", {
                profileUsername: profile.vault.username,
                profilePassword: profile.master_password,
                updatedEntry,
            });

            const updatedVault = await invoke("get_credentials", {
                profileUsername: profile.vault.username,
                profilePassword: profile.master_password,
            });

            console.log("within AddEntry, get credentials invoked")

            setProfile({
                vault: JSON.parse(updatedVault),
                master_password: profile.master_password,
            });

            navigate("/Vault");
        } catch (error) {
            console.error("Could not add entry:", error);
        }
    }

    return (
        <div>
            <Form
                title="Edit Entry"
                submitButtonText="Edit Entry"
                onSubmit={handleSubmit}
                alternateButtonText={"Cancel"}
                alternateAction={() => navigate("/Vault")}
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

            </Form>
        </div>
    );
}

export default EditEntry;
