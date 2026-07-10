import { useState } from "react";

export default function VaultItem({ entry, onDelete }) {

  const [showMenu, setShowMenu] = useState(false);

  function handleContextMenu(event) {
    event.preventDefault();
    setShowMenu(true);
  }

  function handleDelete() {
    onDelete(entry.id);
    setShowMenu(false);
  }

  return (
    <div className="flex flex-row w-full gap-4 border p-2 justify-evenly"
      onContextMenu={handleContextMenu} >
      <h2>{entry.app}</h2>
      <p>username: {entry.username}</p>
      <p>password: {entry.password}</p>
      {showMenu && (
        <div>
          <button onClick={handleDelete}>
            Delete
          </button>
        </div>
      )}
    </div>
  );
}