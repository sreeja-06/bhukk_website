from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize extensions
db = SQLAlchemy()
cors = CORS()

def create_app():
    app = Flask(__name__)
    
    # Configure CORS
    cors.init_app(app, resources={r"/api/*": {"origins": ["http://localhost:5000", "http://127.0.0.1:5000", "http://127.0.0.1:5500", "http://localhost:5500"]}})

    # Database Configuration
    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:sreeja17.@localhost:5432/bhukk'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    db.init_app(app)
    
    with app.app_context():
        # Import routes
        from partner import register_partner
        from contact import handle_contact_form

        # Register routes
        app.add_url_rule('/api/partner/register', 'register_partner', register_partner, methods=['POST'])
        app.add_url_rule('/api/contact/submit', 'handle_contact_form', handle_contact_form, methods=['POST'])

        # Create tables
        db.create_all()

    # Health check endpoint
    @app.route('/health', methods=['GET'])
    def health_check():
        return jsonify({
            'status': 'healthy',
            'message': 'Bhukk API is running'
        })

    # Error handlers
    @app.errorhandler(404)
    def not_found_error(error):
        return jsonify({
            'success': False,
            'message': 'Resource not found',
            'error': str(error)
        }), 404

    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({
            'success': False,
            'message': 'Internal server error',
            'error': str(error)
        }), 500

    return app

app = create_app()

if __name__ == '__main__':
    app.run(debug=True)