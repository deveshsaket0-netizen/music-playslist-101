export default function SongCard({ song, onEdit, onDelete }) {
  return (
    <div className="border rounded-lg p-3 flex justify-between items-center bg-white">
      <div>
        <p className="font-medium">{song.title}</p>
        <p className="text-sm text-gray-500">{song.artist} · {song.genre}</p>
      </div>
      <div className="flex gap-3 text-sm">
        <button onClick={() => onEdit(song)} className="text-blue-600">Edit</button>
        <button onClick={() => onDelete(song.id)} className="text-red-500">Delete</button>
      </div>
    </div>
  );
}