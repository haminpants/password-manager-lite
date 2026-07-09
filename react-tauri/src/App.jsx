import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import LogIn from "./components/LogIn";
import Vault from "./components/Vault";

function App() {
  return (
    <main>
      <Routes>
        <Route path="/" element={<LogIn/>} />
        <Route path="/" element={<Vault/>} />
      </Routes>
    </main>
  );
}

export default App;
