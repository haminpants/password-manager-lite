import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { invoke } from "@tauri-apps/api/core";
import useVault from "./hooks/useVault";
import VaultItem from "./VaultItem";
import ContextMenu from "./ContextMenu";



// TODO: Context Menu styling
// TODO: Card styling apply 
// TODO: Heirarchy Colour Vault Item
// TODO: Login the see password icon is black (bad contrast)
// TODO: Prevent user inputing empty passwords and username
// TODO: light mode
// TODO: Edit entry
// TODO: Copy Password and Copy Username
// TODO: Optional
// TODO: Optional: Sort vaultItem
// TODO: Optional: Show date
// TODO: Optional: Search function

export default function Vault({ profile, entry, position}) {

  const navigate = useNavigate();

  if (!profile) {
    return <p>No profile loaded</p>;
  }

  const {
    entries,
    loading,
    deleteEntry
  } = useVault(profile);

  const [menu, setMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    entryID: null,
  });

  if (loading) {
    return <p>Loading...</p>;
  }    


function handleContextMenu(event, entryID, position) {
  event.preventDefault();
  setMenu({
    visible: true,
    x: position?.x ?? event.clientX,
    y: position?.y ?? event.clientY,
    entryID: entryID,

  });
}

  function closeMenu() {
    setMenu({
      visible: false,
      x: 0,
      y: 0,
      entryID:null
    });
  }

  function handleDelete() {
    deleteEntry(menu.entryID);
    closeMenu();
  }

    return (
      <div className="flex flex-col justify-start items-center h-screen gap-3 mt-24">
        <h1 className="text-sky-300 text-4xl">
          Vault
        </h1>

        <div className="flex w-full justify-between mt-6">
          <button className="border p-1 rounded-sm"
            onClick={() => navigate("/")}>
            Back
          </button>

          <button className="border p-1 rounded-sm"
            onClick={() => navigate("/Vault/AddEntry")}>
            Add Entry
          </button>
        </div>

          {entries.map((entry) => (
            <VaultItem
              key={entry.id}
              entry={entry}
              deleteEntry={deleteEntry}
              onContextMenu={handleContextMenu}
            />
          ))}

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


