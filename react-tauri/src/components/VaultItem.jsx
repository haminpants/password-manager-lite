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
    <div onContextMenu={handleContextMenu} >
      <h2>{entry.app}</h2>
      <p>{entry.username}</p>
      <p>{entry.password}</p>
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