import { Link } from "react-router-dom";

export default function PlaylistCard({ playlist, onDelete }) {
  return (
    <div className="border rounded-lg p-4 flex justify-between items-center bg-white shadow-sm">
      <Link to={`/playlists/${playlist.id}`} className="flex-1">
        <h3 className="font-semibold text-lg">{playlist.name}</h3>
        <p className="text-sm text-gray-500">{playlist.song_count} songs</p>
      </Link>
      <button
        onClick={() => onDelete(playlist.id)}
        className="text-red-500 text-sm ml-4"
      >
        Delete
      </button>
    </div>
  );
}