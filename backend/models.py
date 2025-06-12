from extensions import db
from datetime import datetime

class RestaurantPartner(db.Model):
    __tablename__ = 'restaurant_partner'
    
    id = db.Column(db.Integer, primary_key=True)
    contact_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    phone_number = db.Column(db.String(20), nullable=False)
    type = db.Column(db.String(50), nullable=False)
    additional_info = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f'<RestaurantPartner {self.contact_name}>'

    def to_dict(self):
        return {
            'id': self.id,
            'contact_name': self.contact_name,
            'email': self.email,
            'phone_number': self.phone_number,
            'type': self.type,
            'additional_info': self.additional_info,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
