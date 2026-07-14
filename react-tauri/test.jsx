/**
 * @component
 * 
 * ## Purpose
 * Page where users create a new vault-entry.
 * A vault-entry contains the app, username, and password
 * that users choose to save.
 * 
 * ## Usage
 * Users land on this page after clicking 
 * the Add Entry button from the Vault page
 * AddEntry displays a text input form that users fill and submit.
 * 
 * ## Implementation logic
 * AddEntry receives currently selected profile from Vault.jsx
 * 
 *Within Vault, the profile is passed as a prop:
 *     <AddEntry profile={profile} />
 * 
 * The data is received in AddEntry:
 *     function AddEntry({ profile })
 * 
 * AddEntry displays a form where users enter the new vault entry's values.
 * Submitting the form calls the function handleSubmit
 * handleSubmit associates the new entry to the currently selected profile.
 * It calls tauri command 'add_entry' which stores the entry within app data files.
 * Goes back to the Vault page. 
 * 
 * @param {Object} profile - The profile currently selectedm used to link the new entry
 * @returns {JSX.Element} The AddEntry page.
 */

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

          <label> App </label>
          <input
            className="border border-grey px-1"
            value={app}
            onChange={(e) => setApp(e.target.value)}
          />


          <label> Username </label>
          <input
            className="border border-grey px-1" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <label> Password </label>
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