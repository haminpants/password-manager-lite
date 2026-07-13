import { useEffect } from "react";

export default function ContextMenu({
  x,
  y,
  visible,
  onClose,
  children,
}) {
  useEffect(() => {
    if (!visible) return;

    function handleOutsideClick() {
      onClose();
    }

    function handleEscape(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("click", handleOutsideClick);
    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("click", handleOutsideClick);
      window.removeEventListener("keydown", handleEscape);
    };
  }, [visible, onClose]);

  if (!visible) return null;

  return (
    <div
      className="fixed border bg-(--bg) border-white rounded-lg py-2 min-w-52 z-50"
      style={{
        left: x,
        top: y,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </div>
  );
}