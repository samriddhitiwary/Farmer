const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema({
  cropName: { type: String, required: true },
  region: { type: String, required: true },
  predictedPrice: { type: Number },
  predictedDemand: { type: Number }
}, { timestamps: true });

module.exports = mongoose.model('Prediction', predictionSchema);
