const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  farmerIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  cropId: { type: mongoose.Schema.Types.ObjectId, ref: 'Crop', required: true },
  quantity: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'delivered', 'cancelled'], default: 'pending' },
  deliveryRoute: {
    pickup: { lat: Number, lng: Number },
    drop: { lat: Number, lng: Number },
    estimatedTime: Number // in hours
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
