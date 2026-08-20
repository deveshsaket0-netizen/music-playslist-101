import { Link } from "react-router-dom";

export default function PlaylistCard({ playlist, onDelete }) {
  return (
    <div className="flex justify-between items-center border-b border-line py-4 group">
      <Link to={`/playlists/${playlist.id}`} className="flex-1">
        <h3 className="text-ink group-hover:text-rust transition-colors">{playlist.name}</h3>
        <p className="text-xs text-muted mt-0.5">
          {playlist.song_count} {playlist.song_count === 1 ? "song" : "songs"}
        </p>
      </Link>
      <button
        onClick={() => onDelete(playlist.id)}
        className="text-xs text-muted hover:text-rust ml-4"
      >
        Delete
      </button>
    </div>
  );
}