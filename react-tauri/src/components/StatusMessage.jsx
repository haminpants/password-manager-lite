export default function StatusMessage({ message }) {
  if (!message) return null;

  return (
    <p className="text-(--text)">
      {message}
    </p>
  );
}