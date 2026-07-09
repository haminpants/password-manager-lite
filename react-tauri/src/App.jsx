import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import LogIn from "./components/LogIn";
import Vault from "./components/Vault";

function App() {
  const [profile, setProfile] = useState(null);
  return (
    <main>
      <Routes>
        <Route path="/" element={<LogIn setProfile={setProfile} />} />
        <Route path="/Vault" element={<Vault profile={profile} />} />
      </Routes>
    </main>
  );
}

export default App;
