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
    <div className="min-h-screen bg-paper">
      <div className="max-w-2xl mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rust"></span>
            <h1 className="font-serif text-2xl text-ink tracking-tight">Playlist</h1>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted">{user?.email}</p>
            <button onClick={logout} className="text-xs text-ink underline underline-offset-2">
              Log out
            </button>
          </div>
        </div>

        <form onSubmit={handleCreate} className="flex gap-2 mb-10">
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="New playlist name"
            className="flex-1 border border-line bg-transparent px-3 py-2 text-sm text-ink focus:outline-none focus:border-rust"
          />
          <button
            type="submit"
            className="bg-ink text-paper px-5 py-2 text-sm tracking-wide hover:bg-rust transition-colors"
          >
            Create
          </button>
        </form>

        {error && <p className="text-rust text-sm mb-4">{error}</p>}

        {loading ? (
          <p className="text-muted text-sm">Loading…</p>
        ) : playlists.length === 0 ? (
          <p className="text-muted text-sm">No playlists yet — create one above.</p>
        ) : (
          <div className="border-t border-line">
            {playlists.map((p) => (
              <PlaylistCard key={p.id} playlist={p} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}