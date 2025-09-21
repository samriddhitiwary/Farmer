const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema({
  farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  quantity: { type: Number, required: true }, // in kg
  unitPrice: { type: Number, required: true },
  qualityGrade: { type: String, enum: ['A', 'B', 'C'], default: 'A' },
  imageUrl: { type: String },
  location: {
    lat: { type: Number },
    lng: { type: Number },
    address: { type: String }
  },
  predictedDemand: { type: Number },
  predictedPrice: { type: Number }
}, { timestamps: true });

module.exports = mongoose.model('Crop', cropSchema);
