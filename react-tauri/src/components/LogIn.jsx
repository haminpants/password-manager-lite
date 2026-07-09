import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { invoke } from "@tauri-apps/api/core";

export default function LogIn() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!username.trim() || !password) {
      setMessage("Please enter both username and password.");
      return;
    }

    try {
      const credentialsJSON = await invoke("get_credentials");
      const credentials = JSON.parse(credentialsJSON);
      const accounts = credentials.users;
      const matchingUser  = accounts.find(
        (account) =>
          account.username === username &&
          account.password === password
      );

      if (matchingUser) {
        setMessage("Log-In successful");
        navigate("/Vault");
      } else {
        setMessage("Invalid username or password");
      }

    } catch (error) {
      setMessage("Could not load credentials");
      console.error("ERROR:", error);
    }
  };

  return (
    <div>
      <h1 className="text-sky-300">Log In</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username</label>
        <input
          id="username"
          name="username"
          type="text"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          placeholder="Enter username"
          autoComplete="username"

        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Enter password"
          autoComplete="current-password"
        />

        <button type="submit">Log In</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
