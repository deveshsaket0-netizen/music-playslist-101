"""
Global error handler so an unexpected exception anywhere in the app
returns clean JSON instead of crashing the process or leaking a stack trace.
"""
from flask import jsonify


def register_error_handlers(app):
    @app.errorhandler(404)
    def not_found(e):
        return jsonify({"error": "Resource not found"}), 404

    @app.errorhandler(405)
    def method_not_allowed(e):
        return jsonify({"error": "Method not allowed"}), 405

    @app.errorhandler(Exception)
    def handle_unexpected_error(e):
        # Safety net: never let a raw exception/stack trace reach the client.
        app.logger.exception("Unhandled exception")
        return jsonify({"error": "Something went wrong on the server"}), 500