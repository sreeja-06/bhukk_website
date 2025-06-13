from . import db
from datetime import datetime
from sqlalchemy.dialects.postgresql import JSONB

class Newsletter(db.Model):
    __tablename__ = 'newsletter_subscribers'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    subscribed_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_active = db.Column(db.Boolean, default=True)

class Feedback(db.Model):
    __tablename__ = 'feedback'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    feedback_type = db.Column(db.String(50), nullable=False)
    message = db.Column(db.Text, nullable=False)
    submitted_at = db.Column(db.DateTime, default=datetime.utcnow)

class Restaurant(db.Model):
    __tablename__ = 'restaurants'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    cuisine_type = db.Column(db.String(100))
    location = db.Column(db.String(200))
    rating = db.Column(db.Float)
    delivery_time = db.Column(db.Integer)  # in minutes
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    menu = db.Column(JSONB)

class Order(db.Model):
    __tablename__ = 'orders'
    
    id = db.Column(db.Integer, primary_key=True)
    order_number = db.Column(db.String(50), unique=True, nullable=False)
    restaurant_id = db.Column(db.Integer, db.ForeignKey('restaurants.id'))
    status = db.Column(db.String(50), nullable=False)
    total_amount = db.Column(db.Float, nullable=False)
    delivery_address = db.Column(JSONB)
    ordered_at = db.Column(db.DateTime, default=datetime.utcnow)
    items = db.Column(JSONB)
    
    restaurant = db.relationship('Restaurant', backref='orders')

class JobApplication(db.Model):
    __tablename__ = 'job_applications'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    position = db.Column(db.String(100), nullable=False)
    experience = db.Column(db.Integer)
    resume_path = db.Column(db.String(200), nullable=False)
    cover_letter = db.Column(db.Text)
    applied_at = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.String(50), default='pending')

class RestaurantPartner(db.Model):
    __tablename__ = 'restaurant_partners'
    
    id = db.Column(db.Integer, primary_key=True)
    restaurant_name = db.Column(db.String(200), nullable=False)
    owner_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), nullable=False, unique=True)
    phone = db.Column(db.String(20), nullable=False)
    address = db.Column(JSONB)
    cuisine_types = db.Column(JSONB)
    registration_status = db.Column(db.String(50), default='pending')
    registered_at = db.Column(db.DateTime, default=datetime.utcnow)
    documents = db.Column(JSONB)

# Helper functions for routes.py
def add_newsletter_subscriber(email):
    subscriber = Newsletter(email=email)
    db.session.add(subscriber)
    db.session.commit()
    return True

def add_feedback(data):
    feedback = Feedback(**data)
    db.session.add(feedback)
    db.session.commit()
    return True

def search_restaurants(filters):
    query = Restaurant.query.filter_by(is_active=True)
    
    if filters.get('query'):
        query = query.filter(Restaurant.name.ilike(f"%{filters['query']}%"))
    
    if filters.get('cuisine'):
        query = query.filter(Restaurant.cuisine_type == filters['cuisine'])
    
    if filters.get('rating'):
        query = query.filter(Restaurant.rating >= filters['rating'])
    
    if filters.get('location'):
        query = query.filter(Restaurant.location.ilike(f"%{filters['location']}%"))
    
    return [
        {
            'id': r.id,
            'name': r.name,
            'cuisine_type': r.cuisine_type,
            'location': r.location,
            'rating': r.rating,
            'delivery_time': r.delivery_time
        }
        for r in query.all()
    ]

def get_order_status(order_id):
    order = Order.query.filter_by(order_number=order_id).first()
    if not order:
        return None
        
    return {
        'order_number': order.order_number,
        'status': order.status,
        'restaurant': order.restaurant.name,
        'ordered_at': order.ordered_at.isoformat(),
        'total_amount': order.total_amount,
        'items': order.items
    }