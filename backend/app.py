from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Configure CORS
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://127.0.0.1:5500", "http://localhost:5500", 
                   "http://127.0.0.1:5502", "http://localhost:5502"],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "Accept"]
    }
})

# Database Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:sreeja17.@localhost:5432/bhukk'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Models
class Contact(db.Model):
    __tablename__ = 'contact'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    subject = db.Column(db.String(200), nullable=False)
    message = db.Column(db.Text, nullable=False)

class DeliveryPartner(db.Model):
    __tablename__ = 'delivery'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    age = db.Column(db.Integer, nullable=False)
    vehicle = db.Column(db.String(50), nullable=False)
    license = db.Column(db.String(50), nullable=False)
    experience = db.Column(db.Text, nullable=True)
    city = db.Column(db.String(100), nullable=False)

class RestaurantPartner(db.Model):
    __tablename__ = 'restaurant_partner'
    id = db.Column(db.Integer, primary_key=True)
    contact_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    phone_number = db.Column(db.String(20), nullable=False)
    restaurant_name = db.Column(db.String(200), nullable=False)
    type = db.Column(db.String(50), nullable=False)
    additional_info = db.Column(db.Text, nullable=True)

# Create tables
with app.app_context():
    db.create_all()
    print("Database tables created successfully")

# Route handlers
@app.route('/api/contact', methods=['POST'])
def handle_contact():
    try:
        data = request.json
        print('Received contact form data:', data)
        
        # Create new contact
        contact = Contact(
            name=data['name'],
            email=data['email'],
            subject=data['subject'],
            message=data['message']
        )
        
        db.session.add(contact)
        db.session.commit()
        
        return jsonify({'message': 'Contact form submitted successfully'}), 201
        
    except Exception as e:
        db.session.rollback()
        print('Error handling contact form:', str(e))
        return jsonify({'error': str(e)}), 500

@app.route('/api/delivery-partner', methods=['POST'])
def handle_delivery_partner():
    try:
        data = request.json
        print('Received delivery partner data:', data)
        
        # Create new delivery partner
        partner = DeliveryPartner(
            name=data['name'],
            email=data['email'],
            phone=data['phone'],
            age=int(data['age']),
            vehicle=data['vehicle'],
            license=data['license'],
            experience=data.get('experience', ''),
            city=data['city']
        )
        
        db.session.add(partner)
        db.session.commit()
        
        return jsonify({'message': 'Delivery partner application submitted successfully'}), 201
        
    except Exception as e:
        db.session.rollback()
        print('Error handling delivery partner form:', str(e))
        return jsonify({'error': str(e)}), 500

@app.route('/api/restaurant-partner', methods=['POST'])
def handle_restaurant_partner():
    try:
        data = request.json
        print('Received restaurant partner data:', data)
        
        # Create new restaurant partner
        partner = RestaurantPartner(
            contact_name=data['contact_name'],
            email=data['email'],
            phone_number=data['phone_number'],
            restaurant_name=data['restaurant_name'],
            type=data['type'],
            additional_info=data.get('additional_info', '')
        )
        
        db.session.add(partner)
        db.session.commit()
        
        return jsonify({'message': 'Restaurant partner application submitted successfully'}), 201
        
    except Exception as e:
        db.session.rollback()
        print('Error handling restaurant partner form:', str(e))
        return jsonify({'error': str(e)}), 500

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
    app.run(host='0.0.0.0', port=5000, debug=True)