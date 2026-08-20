export default function SongCard({ song, index, onEdit, onDelete }) {
  return (
    <div className="flex justify-between items-center border-b border-line py-3 group">
      <div className="flex items-baseline gap-4">
        <span className="text-xs text-muted w-4 tabular-nums">{String(index).padStart(2, "0")}</span>
        <div>
          <p className="text-ink text-sm">{song.title}</p>
          <p className="text-xs text-muted mt-0.5">{song.artist} · {song.genre}</p>
        </div>
      </div>
      <div className="flex gap-3 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={() => onEdit(song)} className="text-muted hover:text-ink">Edit</button>
        <button onClick={() => onDelete(song.id)} className="text-muted hover:text-rust">Delete</button>
      </div>
    </div>
  );
}