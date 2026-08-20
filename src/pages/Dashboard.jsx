import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../api/client";
import PlaylistCard from "../components/PlaylistCard";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [playlists, setPlaylists] = useState([]);
  const [newName, setNewName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlaylists();
  }, []);

  async function loadPlaylists() {
    try {
      const data = await api.get("/playlists");
      setPlaylists(data.playlists);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e) {
    e.preventDefault();
    if (!newName.trim()) return;
    try {
      const data = await api.post("/playlists", { name: newName.trim() });
      setPlaylists([data.playlist, ...playlists]);
      setNewName("");
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this playlist?")) return;
    try {
      await api.del(`/playlists/${id}`);
      setPlaylists(playlists.filter((p) => p.id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Welcome, {user?.email}</h1>
        <button onClick={logout} className="text-red-600 text-sm">Log out</button>
      </div>

      <form onSubmit={handleCreate} className="flex gap-2 mb-6">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="New playlist name"
          className="flex-1 border rounded px-3 py-2"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Create
        </button>
      </form>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : playlists.length === 0 ? (
        <p className="text-gray-500">No playlists yet — create one above.</p>
      ) : (
        <div className="space-y-3">
          {playlists.map((p) => (
            <PlaylistCard key={p.id} playlist={p} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}