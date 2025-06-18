from app import app, db
from flask import request, jsonify
from models import Contact, DeliveryPartner, RestaurantPartner

@app.route('/api/contact', methods=['POST'])
def handle_contact():
    try:
        data = request.get_json()
        print('Received contact data:', data)
        
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
        print('Error in contact form:', str(e))
        return jsonify({'error': str(e)}), 400

@app.route('/api/delivery-partner', methods=['POST'])
def handle_delivery_partner():
    try:
        data = request.get_json()
        print('Received delivery partner data:', data)
        
        partner = DeliveryPartner(
            name=data['name'],
            email=data['email'],
            phone=data['phone'],
            age=data['age'],
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
        print('Error in delivery partner form:', str(e))
        return jsonify({'error': str(e)}), 400

@app.route('/api/restaurant-partner', methods=['POST'])
def handle_restaurant_partner():
    try:
        data = request.get_json()
        print('Received restaurant partner data:', data)
        
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
        print('Error in restaurant partner form:', str(e))
        return jsonify({'error': str(e)}), 400

@app.route('/api/contact', methods=['GET'])
def get_contacts():
    try:
        success, result = get_all_contacts()
        if success:
            contacts = [
                {
                    'id': contact.id,
                    'name': contact.name,
                    'email': contact.email,
                    'subject': contact.subject,
                    'message': contact.message
                } for contact in result
            ]
            return jsonify(contacts), 200
        return jsonify({'error': result}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/delivery-partner', methods=['GET'])
def get_delivery_partners():
    try:
        success, result = get_all_delivery_partners()
        if success:
            partners = [
                {
                    'id': partner.id,
                    'name': partner.name,
                    'email': partner.email,
                    'phone': str(partner.phone),
                    'age': int(partner.age),
                    'vehicle': partner.vehicle,
                    'license': partner.license,
                    'experience': partner.experience,
                    'city': partner.city
                } for partner in result
            ]
            return jsonify(partners), 200
        return jsonify({'error': result}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/delivery-partner/<email>', methods=['GET'])
def get_delivery_partner(email):
    try:
        success, result = get_delivery_partner_by_email(email)
        if success:
            partner = {
                'id': result.id,
                'name': result.name,
                'email': result.email,
                'phone': str(result.phone),
                'age': int(result.age),
                'vehicle': result.vehicle,
                'license': result.license,
                'experience': result.experience,
                'city': result.city
            }
            return jsonify(partner), 200
        return jsonify({'error': result}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/restaurant-partner', methods=['POST'])
def handle_restaurant_partner():
    try:
        data = request.json
        success, message = create_restaurant_partner(data)
        if success:
            return jsonify({'message': message}), 201
        return jsonify({'error': message}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/restaurant-partner', methods=['GET'])
def get_restaurant_partners():
    try:
        success, result = get_all_restaurant_partners()
        if success:
            partners = [
                {
                    'id': partner.id,
                    'contact_name': partner.contact_name,
                    'email': partner.email,
                    'phone_number': str(partner.phone_number),
                    'type': partner.type,
                    'additional_info': partner.additional_info,
                    'restaurant_name': partner.restaurant_name
                } for partner in result
            ]
            return jsonify(partners), 200
        return jsonify({'error': result}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/restaurant-partner/<email>', methods=['GET'])
def get_restaurant_partner(email):
    try:
        success, result = get_restaurant_partner_by_email(email)
        if success:
            partner = {
                'id': result.id,
                'contact_name': result.contact_name,
                'email': result.email,
                'phone_number': str(result.phone_number),
                'type': result.type,
                'additional_info': result.additional_info,
                'restaurant_name': result.restaurant_name
            }
            return jsonify(partner), 200
        return jsonify({'error': result}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 400