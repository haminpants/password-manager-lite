import { useState } from "react";
import { useRef } from "react";
import ContextMenu from "./ContextMenu";

export default function VaultItem({ entry, deleteEntry, onContextMenu  }) {
  const menuButtonRef = useRef(null);
  return (
    <div className="flex flex-row w-full gap-4 border p-4 card"
        onContextMenu={(event) => onContextMenu(event, entry.id)}>
      
      {/* There's some ugly div hell going around here*/}

      {/*wrapper*/}
      <div className="flex flex-1 ml-12">
        {/*grid*/}
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
                x: rect.right - 200,
                y: rect.bottom,
              }
            );
            }}
          >
            ...
          </button>
      </div>

    </div>
  );
}