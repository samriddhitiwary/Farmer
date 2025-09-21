import React, { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet, Image, Alert } from "react-native";
import * as ImagePicker from "react-native-image-picker";
import axios from "axios";

export default function AddCrop() {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [image, setImage] = useState(null);
  const [grade, setGrade] = useState("");

  // Pick image from gallery
  const pickImage = () => {
    ImagePicker.launchImageLibrary({ mediaType: "photo" }, (response) => {
      if (response.assets && response.assets.length > 0) {
        setImage(response.assets[0]);
      }
    });
  };

  // Call Python ML API to get grade
  const getQualityGrade = async (imageUri) => {
    try {
      const formData = new FormData();
      formData.append("file", {
        uri: imageUri,
        type: "image/jpeg",
        name: "crop.jpg",
      });

      const res = await axios.post("http://localhost:8000/grade", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setGrade(res.data.qualityGrade);
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Could not get quality grade");
    }
  };

  const handleAddCrop = async () => {
    if (!image) {
      Alert.alert("Error", "Please select an image");
      return;
    }

    // Get AI grade first
    await getQualityGrade(image.uri);

    // Now send data to backend
    const cropData = {
      farmerId: "YOUR_FARMER_ID_HERE",
      name,
      quantity: Number(quantity),
      unitPrice: Number(unitPrice),
      qualityGrade: grade,
      imageUrl: image.uri, // For now, just local URI
      location: {
        lat: 0, lng: 0, address: "Sample address" // replace with actual location
      }
    };

    try {
      const res = await axios.post("http://localhost:5000/api/crops", cropData);
      Alert.alert("Success", "Crop added successfully!");
      console.log(res.data);
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Could not add crop");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Crop</Text>
      <TextInput placeholder="Name" value={name} onChangeText={setName} style={styles.input} />
      <TextInput placeholder="Quantity" value={quantity} onChangeText={setQuantity} keyboardType="numeric" style={styles.input} />
      <TextInput placeholder="Unit Price" value={unitPrice} onChangeText={setUnitPrice} keyboardType="numeric" style={styles.input} />
      <Button title="Pick Image" onPress={pickImage} />
      {image && <Image source={{ uri: image.uri }} style={styles.image} />}
      {grade ? <Text>Predicted Grade: {grade}</Text> : null}
      <Button title="Add Crop" onPress={handleAddCrop} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  input: { borderWidth: 1, borderColor: "#ccc", marginBottom: 10, padding: 8, borderRadius: 5 },
  title: { fontSize: 24, marginBottom: 20, textAlign: "center" },
  image: { width: 200, height: 200, marginVertical: 10, alignSelf: "center" },
});
