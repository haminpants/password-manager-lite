import { useState } from "react";

export default function LogIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (event) => {

    if (!username.trim() || !password) {
      setMessage("Please enter both username and password.");
      return;
    }

    if (username === "1" && password === "1") {
      setMessage("Log-In successful");
    } else {
      setMessage("Invalid username or password");
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
