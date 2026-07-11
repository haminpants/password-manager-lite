import { useState } from "react";
import ContextMenu from "./ContextMenu";

export default function VaultItem({ entry, onDelete }) {

  const [menu, setMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
  });

  function handleContextMenu(event) {
    event.preventDefault();
    setMenu({
      visible: true,
      x: event.clientX,
      y: event.clientY,
    });
  }

  function closeMenu() {
    setMenu({
      visible: false,
      x: 0,
      y: 0,
    });

  }

  function handleDelete() {
    onDelete(entry.id);
    closeMenu();
  }

  return (
    <div className="flex flex-row w-full gap-4 border p-2 justify-evenly"
      onContextMenu={handleContextMenu} >
      <h2>{entry.app}</h2>
      <p>username: {entry.username}</p>
      <p>password: {entry.password}</p>

      <ContextMenu
          visible={menu.visible}
          x={menu.x}
          y={menu.y}
          onClose={closeMenu}
      >
        <hr className="border-bs-gray-950 my-1" />
        
        <button
          className="block w-full text-left px-4 py-2 hover:bg-gray-500"
        >
          Edit
        </button>

        <button
          className="block w-full text-left px-4 py-2 text-red-400 hover:bg-red-900"
          onClick={handleDelete}
        >
          Delete
        </button>

        <button
          className="block w-full text-left px-4 py-2 hover:bg-gray-500"
        >
          Copy Username
        </button>

        <button
          className="block w-full text-left px-4 py-2 hover:bg-gray-500"
        >
          Copy Password
        </button>


      </ContextMenu>
    </div>
  );
}