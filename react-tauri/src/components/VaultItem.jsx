export default function VaultItem({ entry }) {
  return (
    <div>
      <h2>{entry.app}</h2>
      <p>{entry.username}</p>
      <p>{entry.password}</p>
    </div>
  );
}