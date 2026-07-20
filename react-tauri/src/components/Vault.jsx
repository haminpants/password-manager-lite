import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { invoke } from "@tauri-apps/api/core";
import useVault from "./hooks/useVault";
import VaultItem from "./VaultItem";
import ContextMenu from "./ContextMenu";
import EntryContextMenu from "./EntryContextMenu";
import LogIn from "./LogIn";

// TODO: Allow users to edit entries/vault items
// TODO: Allow users to Copy Password and Copy Username
// TODO: Hide passwords, use CSS
// TODO: Optional: Sort vaultItem
// TODO: Optional: Show date
// TODO: Optional: Search function

/**
  * @name Vault
  * @description
  * ----
  * 
  * ###### Description
  * - Vault is the main page where users view and manage entries stored in their profile.
  * 
  * - Vault loads entries from the current {@link profile} using {@link useVault}.
  * 
  * - Vault displays each entry using {@link VaultItem} and provides entry actions through {@link EntryContextMenu}.
  * 
  * - Users can navigate to {@link AddEntry} to add a new entry or manage existing entries through the context menu.
  * 
  * ----
  * 
  * ###### Impelentation Logic
  * 
  * The selected profile is passed from App.jsx into Vault.
  * 
  * Vault uses the profile with {@link useVault} to load the entries belonging to that profile.
  * 
  * - Vault maps through the loaded entries and creates a VaultItem for each entry.
  * 
  * - Entries are passed into VaultItem where VaultItem renders the information
  * 
  * - VaultItem receives the entry data and the context menu handler.
  * 
  * ----
  * 
  * ###### ContextMenu
  * 
  *  The context menu is separated into two components:
  * 
  * - {@link ContextMenu} handles displaying the menu and detecting when it should close.
  * 
  * - {@link EntryContextMenu} handles actions related to a vault entry, such as edit, delete, copy, etc.
  * 
  * **handleContextMenu()**
  * 
  * - Opens the context menu when a VaultItem is selected.
  * 
  * - Stores the menu position and the selected entry ID.
  * 
  * - Passes the selected entry information to EntryContextMenu.
  * 
  * 
  * **closeMenu()**
  * 
  * - Hides the context menu and clears the selected entry.
  * 
  * 
  * Note: These functions remain in Vault because Vault owns the selected entry state and needs to know which VaultItem the user interacted with.
  * 

  * 
  * ----
  * 
  * @param {Object} profile - The currently selected profile used to load vault entries
  */

export default function Vault({ profile}) {

  const navigate = useNavigate();

  if (!profile) {
    navigate("/");
    return <p>No profile loaded</p>;
  }

  const {
    entries,
    deleteEntry
  } = useVault(profile);

  const [menu, setMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    entryID: null,
  });


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


    return (

      <div className="flex flex-col justify-start h-screen gap-3 mt-24">
        <h1 className="text-(--primary) text-4xl justify-center text-center">
          Vault
        </h1>

      {/* Back Navigation and Add Entry Buttons */}
      <div className="flex w-full justify-between mt-6 p-6">
        <button className=" border-b pt-3  hover:border-(--secondary) hover:text-(--primary)"
          onClick={() => navigate("/")}>
          Back
        </button>

        <button className=" border border-(--text-muted) border-b-4 border-b-(--highlight)  p-3 rounded-sm hover:border-(--secondary) hover:text-(--primary) shadow"
          onClick={() => navigate("/Vault/AddEntry")}>
          Add Entry
        </button>
      </div>

      {/* Column Headers for VaultItem properties: App, Username, Password */}
      <div className="flex flex-row text-left gap-2 justify-start text-1xl text-(--text-more-muted) mt-5">
        <div className= "flex w-50 ml-16"><h3>App</h3></div>
        <div className="flex flex-1"><h3>username/password</h3></div>
      </div>


      {/* Vault Items */}
        {entries.map((entry) => (
        <VaultItem
        key={entry.id}
        entry={entry}
        deleteEntry={deleteEntry}
        onContextMenu={handleContextMenu}
        />
      ))}

      {/*An app  with a really long name could spill to the username password. 
      Also, because it's component instead of a table, I can't make it responsive unless I do complete redesign, too bad*/}

      <ContextMenu
          visible={menu.visible}
          x={menu.x}
          y={menu.y}
          onClose={closeMenu}
      >
        <EntryContextMenu
            entryID={menu.entryID}
            deleteEntry={deleteEntry}
            closeMenu={closeMenu}
        />
      </ContextMenu>

      </div>
    );
}


