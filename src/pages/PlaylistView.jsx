import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../api/client";
import SongForm from "../components/SongForm";
import SongCard from "../components/SongCard";
import AIDescriptionBox from "../components/AIDescriptionBox";

const GENRES = ["All", "Pop", "Rock", "Hip-Hop", "Jazz", "Classical", "Electronic", "R&B", "Country", "Metal", "Indie", "Other"];

export default function PlaylistView() {
  const { id } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const [error, setError] = useState("");
  const [editingSong, setEditingSong] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [genreFilter, setGenreFilter] = useState("All");

  useEffect(() => {
    loadPlaylist();
  }, [id]);

  function loadPlaylist() {
    api.get(`/playlists/${id}`)
      .then((data) => setPlaylist(data.playlist))
      .catch((err) => setError(err.message));
  }

  async function handleAddSong(songData) {
    const data = await api.post("/songs", { ...songData, playlist_id: Number(id) });
    setPlaylist({ ...playlist, songs: [...playlist.songs, data.song] });
    setShowAddForm(false);
  }

  async function handleEditSong(songData) {
    const data = await api.put(`/songs/${editingSong.id}`, songData);
    setPlaylist({
      ...playlist,
      songs: playlist.songs.map((s) => (s.id === editingSong.id ? data.song : s)),
    });
    setEditingSong(null);
  }

  async function handleDeleteSong(songId) {
    if (!confirm("Delete this song?")) return;
    try {
      await api.del(`/songs/${songId}`);
      setPlaylist({ ...playlist, songs: playlist.songs.filter((s) => s.id !== songId) });
    } catch (err) {
      setError(err.message);
    }
  }

  function handleDescriptionUpdate(updatedPlaylist) {
    setPlaylist({ ...playlist, ai_description: updatedPlaylist.ai_description });
  }

  if (error) return <p className="min-h-screen bg-paper p-8 text-rust text-sm">{error}</p>;
  if (!playlist) return <p className="min-h-screen bg-paper p-8 text-muted text-sm">Loading…</p>;

  const filteredSongs = playlist.songs.filter(
    (s) => genreFilter === "All" || s.genre === genreFilter
  );

  return (
    <div className="min-h-screen bg-paper">
      <div className="max-w-2xl mx-auto px-6 py-10">
        <Link to="/dashboard" className="text-xs text-muted hover:text-ink">
          &larr; Back
        </Link>
        <h1 className="font-serif text-3xl text-ink tracking-tight mt-3 mb-6">{playlist.name}</h1>

        <AIDescriptionBox playlist={playlist} onUpdate={handleDescriptionUpdate} />

        <div className="flex justify-between items-center mt-8 mb-4">
          <select
            value={genreFilter}
            onChange={(e) => setGenreFilter(e.target.value)}
            className="border border-line bg-transparent px-2 py-1.5 text-sm text-ink focus:outline-none focus:border-rust"
          >
            {GENRES.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>

          {!showAddForm && !editingSong && (
            <button
              onClick={() => setShowAddForm(true)}
              className="text-sm text-ink border border-line px-4 py-1.5 hover:border-rust hover:text-rust transition-colors"
            >
              + Add song
            </button>
          )}
        </div>

        {editingSong && (
          <SongForm
            initialData={editingSong}
            onSubmit={handleEditSong}
            onCancel={() => setEditingSong(null)}
          />
        )}
        {showAddForm && !editingSong && (
          <SongForm onSubmit={handleAddSong} onCancel={() => setShowAddForm(false)} initialData={null} />
        )}

        {filteredSongs.length === 0 ? (
          <p className="text-muted text-sm mt-4">No songs match this filter.</p>
        ) : (
          <div className="border-t border-line mt-2">
            {filteredSongs.map((song, i) => (
              <SongCard
                key={song.id}
                song={song}
                index={i + 1}
                onEdit={setEditingSong}
                onDelete={handleDeleteSong}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}