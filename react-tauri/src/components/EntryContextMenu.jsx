  /**
  * @name EntryContextMenu
  * @description
  * ----
  * 
  * ###### Description
  * - EntryContextMenu displays actions that can be performed on a vault entry.
  * 
  * - EntryContextMenu is displayed inside {@link ContextMenu} when a user selects a VaultItem.
  * 
  * - EntryContextMenu provides actions such as editing, deleting, and copying entry information.
  * 
  * ----
  * 
  * ###### Impelentation Logic
  * 
  * EntryContextMenu receives the selected entry ID and entry actions from Vault.
  * 
  * **handleDelete()**
  * 
  * - Deletes the selected entry using *deleteEntry()*.
  * 
  * - Closes the context menu after deletion.
  * 
  * 
  * EntryContextMenu does not manage the context menu state.
  * 
  * The menu visibility is controlled by Vault, while EntryContextMenu only handles actions related to the selected entry.
  * 
  * ----
  * 
  * @param {number} entryID - The ID of the selected entry used for entry actions
  * @param {Function} deleteEntry - Function used to remove an entry from the vault
  * @param {Function} closeMenu - Function used to close the context menu after an action
  */

export default function EntryContextMenu({ 
  entryID, 
  deleteEntry, 
  closeMenu 
}) {

  function handleDelete() {
    deleteEntry(entryID);
    closeMenu();
  }

  return (
    <>
      <hr className="border-(--text) my-1" />

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
    </>
  );
}