"""
Song CRUD routes. Songs belong to a playlist, which belongs to a user.
Every route checks the playlist is owned by current_user_id before touching songs,
so users can't read/edit/delete songs in playlists that aren't theirs.
"""
from flask import Blueprint, request, jsonify
from api.extensions import db
from api.models import Song, Playlist
from api.utils.jwt_helpers import require_auth

songs_bp = Blueprint("songs", __name__, url_prefix="/api/songs")

VALID_GENRES = {
    "Pop", "Rock", "Hip-Hop", "Jazz", "Classical",
    "Electronic", "R&B", "Country", "Metal", "Indie", "Other"
}


def _get_owned_playlist(playlist_id, user_id):
    return Playlist.query.filter_by(id=playlist_id, user_id=user_id).first()


@songs_bp.route("", methods=["POST"])
@require_auth
def create_song(current_user_id):
    data = request.get_json(silent=True) or {}
    playlist_id = data.get("playlist_id")
    title = (data.get("title") or "").strip()
    artist = (data.get("artist") or "").strip()
    genre = (data.get("genre") or "").strip()

    if not playlist_id:
        return jsonify({"error": "playlist_id is required"}), 400
    if not title or not artist:
        return jsonify({"error": "Title and artist are required"}), 400
    if genre not in VALID_GENRES:
        return jsonify({"error": "Invalid genre"}), 400

    playlist = _get_owned_playlist(playlist_id, current_user_id)
    if not playlist:
        return jsonify({"error": "Playlist not found"}), 404

    song = Song(playlist_id=playlist_id, title=title, artist=artist, genre=genre)
    db.session.add(song)
    db.session.commit()
    return jsonify({"song": song.to_dict()}), 201


@songs_bp.route("/<int:song_id>", methods=["PUT"])
@require_auth
def update_song(current_user_id, song_id):
    song = Song.query.get(song_id)
    if not song:
        return jsonify({"error": "Song not found"}), 404

    playlist = _get_owned_playlist(song.playlist_id, current_user_id)
    if not playlist:
        return jsonify({"error": "Song not found"}), 404  # don't leak existence of others' songs

    data = request.get_json(silent=True) or {}
    title = (data.get("title") or "").strip()
    artist = (data.get("artist") or "").strip()
    genre = (data.get("genre") or "").strip()

    if not title or not artist:
        return jsonify({"error": "Title and artist are required"}), 400
    if genre not in VALID_GENRES:
        return jsonify({"error": "Invalid genre"}), 400

    song.title = title
    song.artist = artist
    song.genre = genre
    db.session.commit()
    return jsonify({"song": song.to_dict()}), 200


@songs_bp.route("/<int:song_id>", methods=["DELETE"])
@require_auth
def delete_song(current_user_id, song_id):
    song = Song.query.get(song_id)
    if not song:
        return jsonify({"error": "Song not found"}), 404

    playlist = _get_owned_playlist(song.playlist_id, current_user_id)
    if not playlist:
        return jsonify({"error": "Song not found"}), 404

    db.session.delete(song)
    db.session.commit()
    return jsonify({"message": "Song deleted"}), 200