import { useState } from "react";
import { api } from "../api/client";

export default function AIDescriptionBox({ playlist, onUpdate }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleGenerate() {
    setLoading(true);
    setError("");
    try {
      const data = await api.post(`/ai/playlists/${playlist.id}/generate-description`, {});
      onUpdate(data.playlist);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="border-l-2 border-rust pl-4 py-1">
      {playlist.ai_description ? (
        <p className="font-serif text-ink italic text-[15px] leading-relaxed mb-3">
          {playlist.ai_description}
        </p>
      ) : (
        <p className="text-muted text-sm mb-3">No description yet.</p>
      )}
      {error && <p className="text-rust text-sm mb-2">{error}</p>}
      <button
        onClick={handleGenerate}
        disabled={loading}
        className="text-xs uppercase tracking-widest text-ink hover:text-rust disabled:opacity-50"
      >
        {loading ? "Generating…" : "Generate description"}
      </button>
    </div>
  );
}