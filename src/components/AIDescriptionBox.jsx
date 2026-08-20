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
    <div className="border rounded-lg p-4 bg-purple-50 mb-4">
      {playlist.ai_description ? (
        <p className="text-gray-700 italic mb-3">"{playlist.ai_description}"</p>
      ) : (
        <p className="text-gray-500 text-sm mb-3">No description yet.</p>
      )}
      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
      <button
        onClick={handleGenerate}
        disabled={loading}
        className="bg-purple-600 text-white px-4 py-2 rounded text-sm disabled:opacity-50"
      >
        {loading ? "Generating..." : "✨ Generate Description"}
      </button>
    </div>
  );
}