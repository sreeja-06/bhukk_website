from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app, origins=["http://localhost:5000", "http://127.0.0.1:5000", "http://127.0.0.1:5500", "http://localhost:5500", "*"])

# Database Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:sreeja17.@localhost:5432/bhukk'  # Ensure correct database name
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Import routes from partner.py and contact.py
from partner import register_partner
from contact import submit_contact

# Register the blueprints
app.add_url_rule('/api/partner/register', 'register_partner', register_partner, methods=['POST'])
app.add_url_rule('/api/contact/submit', 'submit_contact', submit_contact, methods=['POST'])

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

if __name__ == '__main__':
    # Run the application
    port = int(os.getenv('PORT', 5000))
    app.run(debug=True, port=port)