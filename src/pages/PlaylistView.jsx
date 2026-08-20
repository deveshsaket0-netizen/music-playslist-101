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

  if (error) return <p className="p-8 text-red-500">{error}</p>;
  if (!playlist) return <p className="p-8 text-gray-500">Loading...</p>;

  const filteredSongs = playlist.songs.filter(
    (s) => genreFilter === "All" || s.genre === genreFilter
  );

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <Link to="/dashboard" className="text-blue-600 text-sm">← Back</Link>
      <h1 className="text-2xl font-bold mt-2 mb-4">{playlist.name}</h1>

      <AIDescriptionBox playlist={playlist} onUpdate={handleDescriptionUpdate} />

      <select
        value={genreFilter}
        onChange={(e) => setGenreFilter(e.target.value)}
        className="border rounded px-3 py-2 mb-4"
      >
        {GENRES.map((g) => (
          <option key={g} value={g}>{g}</option>
        ))}
      </select>

      {editingSong ? (
        <SongForm
          initialData={editingSong}
          onSubmit={handleEditSong}
          onCancel={() => setEditingSong(null)}
        />
      ) : showAddForm ? (
        <SongForm onSubmit={handleAddSong} onCancel={() => setShowAddForm(false)} initialData={null} />
      ) : (
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
        >
          + Add Song
        </button>
      )}

      {filteredSongs.length === 0 ? (
        <p className="text-gray-500">No songs match this filter.</p>
      ) : (
        <div className="space-y-2">
          {filteredSongs.map((song) => (
            <SongCard
              key={song.id}
              song={song}
              onEdit={setEditingSong}
              onDelete={handleDeleteSong}
            />
          ))}
        </div>
      )}
    </div>
  );
}