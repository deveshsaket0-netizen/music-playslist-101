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
    <form onSubmit={handleSubmit} className="border border-line p-4 mb-4 space-y-3">
      {error && <p className="text-rust text-sm">{error}</p>}
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Song title"
        className="w-full border border-line bg-transparent px-3 py-2 text-sm text-ink focus:outline-none focus:border-rust"
      />
      <input
        value={artist}
        onChange={(e) => setArtist(e.target.value)}
        placeholder="Artist"
        className="w-full border border-line bg-transparent px-3 py-2 text-sm text-ink focus:outline-none focus:border-rust"
      />
      <select
        value={genre}
        onChange={(e) => setGenre(e.target.value)}
        className="w-full border border-line bg-transparent px-3 py-2 text-sm text-ink focus:outline-none focus:border-rust"
      >
        {GENRES.map((g) => (
          <option key={g} value={g}>{g}</option>
        ))}
      </select>
      <div className="flex gap-3 pt-1">
        <button
          type="submit"
          className="bg-ink text-paper px-4 py-2 text-sm tracking-wide hover:bg-rust transition-colors"
        >
          {initialData ? "Save" : "Add song"}
        </button>
        {initialData && (
          <button type="button" onClick={onCancel} className="text-sm text-muted hover:text-ink px-2">
            Cancel
          </button>
        )}
        {!initialData && (
          <button type="button" onClick={onCancel} className="text-sm text-muted hover:text-ink px-2">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}