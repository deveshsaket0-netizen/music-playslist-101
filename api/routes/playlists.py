"""
Playlist CRUD routes. All routes require auth and only operate on
playlists owned by the logged-in user (checked via user_id match).
"""
from flask import Blueprint, request, jsonify
from api.extensions import db
from api.models import Playlist
from api.utils.jwt_helpers import require_auth

playlists_bp = Blueprint("playlists", __name__, url_prefix="/api/playlists")


@playlists_bp.route("", methods=["GET"])
@require_auth
def list_playlists(current_user_id):
    playlists = Playlist.query.filter_by(user_id=current_user_id).order_by(Playlist.created_at.desc()).all()
    return jsonify({"playlists": [p.to_dict() for p in playlists]}), 200


@playlists_bp.route("", methods=["POST"])
@require_auth
def create_playlist(current_user_id):
    data = request.get_json(silent=True) or {}
    name = (data.get("name") or "").strip()

    if not name:
        return jsonify({"error": "Playlist name is required"}), 400
    if len(name) > 255:
        return jsonify({"error": "Playlist name is too long"}), 400

    playlist = Playlist(name=name, user_id=current_user_id)
    db.session.add(playlist)
    db.session.commit()
    return jsonify({"playlist": playlist.to_dict()}), 201


@playlists_bp.route("/<int:playlist_id>", methods=["GET"])
@require_auth
def get_playlist(current_user_id, playlist_id):
    playlist = Playlist.query.filter_by(id=playlist_id, user_id=current_user_id).first()
    if not playlist:
        return jsonify({"error": "Playlist not found"}), 404
    return jsonify({"playlist": playlist.to_dict(include_songs=True)}), 200


@playlists_bp.route("/<int:playlist_id>", methods=["PUT"])
@require_auth
def update_playlist(current_user_id, playlist_id):
    playlist = Playlist.query.filter_by(id=playlist_id, user_id=current_user_id).first()
    if not playlist:
        return jsonify({"error": "Playlist not found"}), 404

    data = request.get_json(silent=True) or {}
    name = (data.get("name") or "").strip()
    if not name:
        return jsonify({"error": "Playlist name is required"}), 400

    playlist.name = name
    db.session.commit()
    return jsonify({"playlist": playlist.to_dict()}), 200


@playlists_bp.route("/<int:playlist_id>", methods=["DELETE"])
@require_auth
def delete_playlist(current_user_id, playlist_id):
    playlist = Playlist.query.filter_by(id=playlist_id, user_id=current_user_id).first()
    if not playlist:
        return jsonify({"error": "Playlist not found"}), 404

    db.session.delete(playlist)  # cascade deletes its songs too, via models.py relationship
    db.session.commit()
    return jsonify({"message": "Playlist deleted"}), 200