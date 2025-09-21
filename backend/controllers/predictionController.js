const Prediction = require('../models/Prediction');

// Add/update prediction
exports.addPrediction = async (req, res) => {
  try {
    const { cropName, region, predictedPrice, predictedDemand } = req.body;

    // Upsert: create if not exists, else update
    const prediction = await Prediction.findOneAndUpdate(
      { cropName, region },
      { predictedPrice, predictedDemand },
      { new: true, upsert: true }
    );

    res.json({ message: "Prediction saved", prediction });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get prediction by crop & region
exports.getPrediction = async (req, res) => {
  try {
    const { cropName, region } = req.query;
    const prediction = await Prediction.findOne({ cropName, region });
    if (!prediction) return res.status(404).json({ message: "Prediction not found" });
    res.json(prediction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
