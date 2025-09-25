import React, { useState } from 'react';
import { View, Text, Button, Image, ActivityIndicator, StyleSheet, Platform, Alert } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';

const QualityGrading = () => {
  const [imageUri, setImageUri] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [grade, setGrade] = useState(null);
  const [confidence, setConfidence] = useState(null);
  const [loading, setLoading] = useState(false);

  // NOTE: If using a physical device, replace 'http://localhost:8000' 
  // with your computer's local IP address (e.g., 'http://192.168.1.5:8000')
  const API_URL = 'http://localhost:8000/api/grade_crop'; 

  const pickImage = () => {
    // Corrected configuration for react-native-image-picker
    launchImageLibrary({ mediaType: 'photo', selectionLimit: 1 }, (response) => {
      if (response.didCancel) return;
      if (response.errorCode) {
        return Alert.alert('Error', `ImagePicker Error: ${response.errorMessage}`);
      }
      
      const asset = response.assets[0];
      const uri = asset.uri;
      
      setImageUri(uri);
      
      // The file object must be correctly structured for FormData
      setImageFile({ 
          uri: Platform.OS === 'android' ? uri : uri.replace('file://', ''),
          name: asset.fileName || 'crop.jpg', 
          type: asset.type || 'image/jpeg' 
      });
      
      setGrade(null);
      setConfidence(null);
    });
  };

  const uploadImage = async () => {
    if (!imageFile) return;
    setLoading(true);
    setGrade(null);
    setConfidence(null);

    const formData = new FormData();
    formData.append('file', imageFile);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            // NOTE: Content-Type MUST NOT be set explicitly here; 
            // the browser/React Native handles it for FormData.
        },
        body: formData,
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error('Server error:', errText);
        Alert.alert('Upload Failed', `Server responded with status ${response.status}.`);
        return;
      }

      const data = await response.json();
      console.log("Backend response:", data);

      setGrade(data.grade);
      setConfidence(data.confidence ? data.confidence.toFixed(2) : 'N/A');
      
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Upload Failed', `Could not connect to the server. Is it running?`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crop Quality Grader</Text>
      
      {/* Web Input (Kept for Expo Web compatibility) */}
      {Platform.OS === 'web' ? (
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files[0];
            setImageFile(file);
            setImageUri(URL.createObjectURL(file));
            setGrade(null);
            setConfidence(null);
          }}
          style={{ marginBottom: 20 }}
        />
      ) : (
        // Mobile Button
        <Button title="Pick Image from Gallery" onPress={pickImage} />
      )}

      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}

      <Button
        title={loading ? "Processing..." : "Grade Quality"}
        onPress={uploadImage}
        disabled={!imageFile || loading}
        color={loading || !imageFile ? '#aaa' : '#007bff'}
      />

      {loading && <ActivityIndicator size="large" color="#007bff" style={styles.loading} />}
      
      {grade && (
        <View style={styles.resultContainer}>
            <Text style={styles.resultLabel}>Quality Grade:</Text>
            <Text style={styles.resultValue}>{grade}</Text>
            <Text style={styles.resultLabel}>Confidence:</Text>
            <Text style={styles.resultValue}>{confidence}%</Text>
        </View>
      )}
    </View>
  );
};

export default QualityGrading;

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'flex-start', paddingTop: 50, padding: 20, backgroundColor: '#f0f0f0' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 30, color: '#333' },
  image: { width: 250, height: 250, marginVertical: 20, borderRadius: 10, borderWidth: 1, borderColor: '#ccc', resizeMode: 'contain' },
  loading: { marginTop: 20 },
  resultContainer: { marginTop: 30, padding: 20, backgroundColor: '#fff', borderRadius: 10, width: '90%', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 5 },
  resultLabel: { fontSize: 16, color: '#555', marginTop: 5 },
  resultValue: { fontSize: 24, fontWeight: '900', color: '#007bff', marginBottom: 10 },
});