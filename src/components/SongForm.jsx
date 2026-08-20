import { useState, useEffect } from "react";

const GENRES = ["Pop", "Rock", "Hip-Hop", "Jazz", "Classical", "Electronic", "R&B", "Country", "Metal", "Indie", "Other"];

export default function SongForm({ onSubmit, initialData, onCancel }) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [artist, setArtist] = useState(initialData?.artist || "");
  const [genre, setGenre] = useState(initialData?.genre || GENRES[0]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setArtist(initialData.artist);
      setGenre(initialData.genre);
    }
  }, [initialData]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!title.trim() || !artist.trim()) {
      setError("Title and artist are required");
      return;
    }
    try {
      await onSubmit({ title: title.trim(), artist: artist.trim(), genre });
      if (!initialData) {
        setTitle("");
        setArtist("");
        setGenre(GENRES[0]);
      }
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="border rounded-lg p-4 bg-white mb-4 space-y-3">
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Song title"
        className="w-full border rounded px-3 py-2"
      />
      <input
        value={artist}
        onChange={(e) => setArtist(e.target.value)}
        placeholder="Artist"
        className="w-full border rounded px-3 py-2"
      />
      <select
        value={genre}
        onChange={(e) => setGenre(e.target.value)}
        className="w-full border rounded px-3 py-2"
      >
        {GENRES.map((g) => (
          <option key={g} value={g}>{g}</option>
        ))}
      </select>
      <div className="flex gap-2">
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          {initialData ? "Save" : "Add Song"}
        </button>
        {initialData && (
          <button type="button" onClick={onCancel} className="text-gray-500 px-4 py-2">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}