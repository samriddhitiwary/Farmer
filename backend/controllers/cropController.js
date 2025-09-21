const Crop = require('../models/Crop');

// Add new crop
exports.addCrop = async (req, res) => {
  try {
    const crop = new Crop(req.body);
    await crop.save();
    res.status(201).json({ message: "Crop added successfully", crop });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all crops
exports.getAllCrops = async (req, res) => {
  try {
    const crops = await Crop.find().populate('farmerId', 'name email phone');
    res.json(crops);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get crop by ID
exports.getCropById = async (req, res) => {
  try {
    const crop = await Crop.findById(req.params.id).populate('farmerId', 'name email phone');
    if (!crop) return res.status(404).json({ message: "Crop not found" });
    res.json(crop);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update crop
exports.updateCrop = async (req, res) => {
  try {
    const updatedCrop = await Crop.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: "Crop updated", crop: updatedCrop });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete crop
exports.deleteCrop = async (req, res) => {
  try {
    await Crop.findByIdAndDelete(req.params.id);
    res.json({ message: "Crop deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
