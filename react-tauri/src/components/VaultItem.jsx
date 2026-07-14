import { useState } from "react";
import { useRef } from "react";
import ContextMenu from "./ContextMenu";


/**
  * @name VaultItem
  * @description
  * ----
  * 
  * ###### Description
  * - VaultItem displays the information of a single vault entry.
  * 
  * - VaultItem shows the entry application name, username, and password.
  * 
  * - VaultItem allows users to open the {@link ContextMenu} for the selected entry through right-clicking or the menu button.
  * 
  * ----
  * 
  * @param {Object} entry - The vault entry containing the application, username, password, and ID
  * @param {Function} deleteEntry - Function used to delete the selected entry from the vault
  * @param {Function} onContextMenu - Function used to open the context menu with the selected entry information
  */

export default function VaultItem({ entry, deleteEntry, onContextMenu  }) {
  const menuButtonRef = useRef(null);
  return (
    <div className="flex flex-row w-full gap-4 border p-4 card"
        onContextMenu={(event) => onContextMenu(event, entry.id)}>
      
      {/* There's some ugly div hell going around here*/}

      {/*Grid Wrapper*/}
      <div className="flex flex-1 ml-12">

      {/*Grid UI for App, Username, and Password*/}
        <div className="grid w-fit grid-cols-[minmax(0,200px)_1fr] gap-x-6 text-left">
          <div className="col-start-1 row-span-2 flex">
            <h2 className="text-2xl">{entry.app}</h2>
          </div>
          <div className="col-start-2 row-start-1 text-(--text-muted)">
            <p>{entry.username}</p>
          </div>
          <div className="col-start-2 row-start-2 text-(--text-muted)">
            <p>{entry.password}</p>
          </div>
        </div>
      </div>

      {/* Context Menu Button */}
      <div className="flex w-fit justify-end hover:text-(--primary)">
          <button
            ref={menuButtonRef}
            onClick={(event) => {
            event.stopPropagation();

            const rect = menuButtonRef.current.getBoundingClientRect();
            onContextMenu(
              event,
              entry.id,
              {
                x: rect.right - 200, /* moves the context menu further to the left so it does not go off-page*/
                y: rect.bottom,
              }
            );}}>
            ...
          </button>
      </div>
    </div>
  );
}