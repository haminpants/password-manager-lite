import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import LogIn from "./components/LogIn";
import Vault from "./components/Vault";
import AddEntry from "./components/AddEntry";

/**
  * @name App
  * @description
  * ----
  * 
  * ###### Description
  * - App is the root component of the application.
  * 
  * - App manages the currently selected {@link profile} state and provides it to pages that require access to the user's vault.
  * 
  * - App handles navigation between {@link LogIn}, {@link Vault}, and {@link AddEntry} using React Router.
  * 
  * ----
  * 
  * ###### Impelentation Logic
  * 
  * App stores the currently logged-in profile using state.
  * 
  * The profile is initially set to null and updated after a successful login.
  * 
  * The profile is passed through props:
  * 
  * - {@link LogIn} receives setProfile and updates the current profile after authentication.
  * 
  * - {@link Vault} receives the selected profile to load the user's entries.
  * 
  * - {@link AddEntry} receives the selected profile to save new entries to the correct vault.
  * 
  * ----
  * 
  * @returns {JSX.Element} The root application component containing the application routes
  */
 
function App() {
  const [profile, setProfile] = useState(null);
  return (
    <main className="w-full max-w-5xl">
      <Routes>
        <Route path="/" element={<LogIn setProfile={setProfile} />} />
        <Route path="/Vault" element={<Vault profile={profile} />} />
        <Route path="/Vault/AddEntry" element={<AddEntry profile={profile} />} />
      </Routes>
    </main>
  );
}

export default App;
