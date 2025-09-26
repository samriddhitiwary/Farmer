import React, { useState } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    TouchableOpacity, 
    ActivityIndicator, 
    ScrollView,
    Alert,
    Image,
    Platform,
    SafeAreaView,
} from 'react-native';
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router"; 
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { launchImageLibrary } from 'react-native-image-picker';

// --- THEME COLORS (Remains at the top) ---
const COLORS = {
    gradientStart: '#d2f4ef', 
    gradientEnd: '#aed6f1', 
    cardBackground: '#ffffff',
    primaryButton: '#3498db',
    secondaryButton: '#2ecc71',
    textPrimary: '#2c3e50',
    textSecondary: '#7f8c8d',
    border: '#ecf0f1',
    shadowColor: '#aed6f1',
    disabled: '#bdc3c7',
    healthy: '#27ae60',
    disease: '#e74c3c',
};

// --- FIX: headerStyles DEFINITION (Moved to the correct global scope) ---
const headerStyles = StyleSheet.create({
    headerContainer: {
        width: '100%',
        height: 65, 
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: COLORS.cardBackground, 
        shadowColor: COLORS.primaryButton, 
        shadowOffset: { width: 0, height: 4 }, 
        shadowOpacity: 0.1, 
        shadowRadius: 6,
        elevation: 8, 
        borderBottomWidth: 0, 
        paddingHorizontal: 15,
    },
    backButton: {
        paddingVertical: 10,
        paddingRight: 15, 
    },
    headerTitle: {
        fontSize: 21,
        fontWeight: '800',
        color: COLORS.textPrimary,
        letterSpacing: 0.5,
    },
    placeholder: {
        width: 38,
    }
});

// CustomHeader is now correctly defined after its styles are available.
const CustomHeader = ({ router }) => (
    <View style={headerStyles.headerContainer}>
        <TouchableOpacity 
            style={headerStyles.backButton} 
            onPress={() => router.replace('/Home')}
            activeOpacity={0.6} 
        >
            <Icon name="chevron-left" size={28} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={headerStyles.headerTitle}>Crop Disease Diagnostics</Text> 
        <View style={headerStyles.placeholder} />
    </View>
);


const DiseaseDetection = () => {
    const router = useRouter(); 
    const [imageUri, setImageUri] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('Analyzing...');

    const API_URL = 'http://localhost:8000/api/detect_disease'; 

    const pickImage = () => {
        launchImageLibrary({ mediaType: 'photo', selectionLimit: 1 }, (response) => {
            if (response.didCancel || response.errorCode) return;
            
            const asset = response.assets[0];
            setImageUri(asset.uri);
            setImageFile({ 
                uri: Platform.OS === 'android' ? asset.uri : asset.uri.replace('file://', ''),
                name: asset.fileName || 'leaf.jpg', 
                type: asset.type || 'image/jpeg' 
            });
            setResult(null);
        });
    };

    // CustomButton definition is correctly placed inside the main component
    const CustomButton = ({ title, onPress, iconName, disabled, color }) => (
        <TouchableOpacity 
            onPress={onPress} 
            style={[styles.button, { backgroundColor: disabled ? COLORS.disabled : color || COLORS.primaryButton }]}
            disabled={disabled}
            activeOpacity={0.8}
        >
            {Icon && iconName && <Icon name={iconName} size={20} color={COLORS.cardBackground} style={styles.buttonIcon} />}
            <Text style={styles.buttonText}>{title}</Text>
        </TouchableOpacity>
    );

    const uploadImage = async () => {
  if (!imageFile) {
    Alert.alert("No Image", "Please select an image first.");
    return;
  }

  setLoading(true);
  setLoadingMessage('Uploading image...');
  setResult(null);

  try {
    // Fetch the image as a blob
    const response = await fetch(imageFile.uri);
    const blob = await response.blob();

    const formData = new FormData();
    formData.append('file', blob, imageFile.name);  // pass blob + filename

    const res = await fetch(API_URL, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      const errorBody = await res.text();
      throw new Error(`Server responded with status ${res.status}: ${errorBody}`);
    }

    setLoadingMessage('Running prediction model...');
    const data = await res.json();
    setResult(data);

  } catch (error) {
    console.error('Detection API Error:', error);
    Alert.alert('Detection Failed', `Error: ${error.message}`);
  } finally {
    setLoading(false);
    setLoadingMessage('Analyzing...');
  }
};


    const resultColor = result 
        ? (result.status === 'Healthy' ? COLORS.healthy : COLORS.disease) 
        : COLORS.textSecondary;

    return (
        <SafeAreaView style={styles.safeArea}>
            <CustomHeader router={router} />
            <LinearGradient
                colors={[COLORS.gradientStart, COLORS.gradientEnd]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.contentContainer}
            >
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    <Text style={styles.screenTitle}>Crop Disease Diagnostics 🌿</Text>
                    
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>1. Select Leaf Image</Text>
                        
                        <View style={styles.imagePlaceholder}>
                            {imageUri ? (
                                <Image source={{ uri: imageUri }} style={styles.image} />
                            ) : (
                                <View style={styles.noImageTextContainer}>
                                    <Icon name="camera-plus" size={50} color={COLORS.disabled} />
                                    <Text style={styles.noImageText}>Select a leaf photo for diagnosis</Text>
                                </View>
                            )}
                        </View>

                        <CustomButton 
                            title="Pick Image" 
                            onPress={pickImage} 
                            iconName="image-multiple"
                            color={COLORS.primaryButton}
                        />
                    </View>

                    {!loading ? (
                        <CustomButton
                            title="2. Run Disease Detection"
                            onPress={uploadImage}
                            iconName="microscope"
                            disabled={!imageFile}
                            color={COLORS.secondary} 
                        />
                    ) : (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color={COLORS.secondary} />
                            <Text style={styles.loadingText}>{loadingMessage}</Text>
                        </View>
                    )}
                    
                    {result && (
                        <View style={[styles.card, styles.resultCard, { borderColor: resultColor }]}>
                            <Text style={styles.cardTitle}>3. Diagnosis Result</Text>
                            
                            <View style={styles.resultDisplay}>
                                <Icon 
                                    name={result.status === 'Healthy' ? "leaf" : "bug"} 
                                    size={36} 
                                    color={resultColor} 
                                    style={styles.statusIcon} 
                                />
                                <Text style={[styles.statusText, { color: resultColor }]}>
                                    {result.status}
                                </Text>
                            </View>
                            
                            <Text style={styles.diseaseNameLabel}>
                                {result.status === 'Healthy' ? 'No Disease Detected' : 'Identified Disease:'}
                            </Text>
                            <Text style={styles.diseaseName}>
                                {result.disease_name}
                            </Text>
                            
                            <View style={styles.confidenceRow}>
                                <Icon name="chart-line" size={18} color={COLORS.textSecondary} />
                                <Text style={styles.confidenceLabel}>Confidence Score:</Text>
                                <Text style={styles.confidenceValue}>{result.confidence.toFixed(2)}%</Text>
                            </View>
                        </View>
                    )}
                </ScrollView>
            </LinearGradient>
        </SafeAreaView>
    );
};

export default DiseaseDetection;

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: COLORS.cardBackground, },
    contentContainer: { flex: 1, width: '100%', },
    scrollContent: { alignItems: 'center', paddingTop: 30, paddingHorizontal: 20, paddingBottom: 50, },
    screenTitle: { fontSize: 28, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 30, textAlign: 'center', },
    card: { 
        width: '100%', backgroundColor: COLORS.cardBackground, borderRadius: 15, padding: 25, marginBottom: 25, 
        shadowColor: COLORS.shadowColor, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 6,
    },
    cardTitle: { fontSize: 18, fontWeight: '700', color: COLORS.primary, marginBottom: 15, borderBottomWidth: 1, borderBottomColor: COLORS.border, paddingBottom: 8, },
    imagePlaceholder: { 
        width: '100%', height: 250, backgroundColor: COLORS.border, borderRadius: 10, overflow: 'hidden', marginBottom: 20,
        justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: COLORS.textSecondary, borderStyle: 'dashed',
    },
    image: { width: '100%', height: '100%', resizeMode: 'cover' },
    noImageTextContainer: { alignItems: 'center', },
    noImageText: { color: COLORS.textSecondary, marginTop: 10, fontSize: 15, },
    button: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 15, borderRadius: 10, width: '100%',
        marginBottom: 25, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 3,
    },
    buttonIcon: { marginRight: 10, },
    buttonText: { color: COLORS.cardBackground, fontSize: 17, fontWeight: '600', },
    loadingContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 15, marginBottom: 25, width: '100%', },
    loadingText: { fontSize: 16, color: COLORS.textPrimary, marginLeft: 10, fontWeight: '500', },
    resultCard: { borderLeftWidth: 8, paddingVertical: 20, },
    resultDisplay: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 15, },
    statusIcon: { marginRight: 15, },
    statusText: { fontSize: 30, fontWeight: '900', textTransform: 'uppercase', },
    diseaseNameLabel: { fontSize: 16, color: COLORS.textSecondary, textAlign: 'center', marginTop: 10, },
    diseaseName: { fontSize: 22, fontWeight: '700', color: COLORS.textPrimary, textAlign: 'center', marginBottom: 20, },
    confidenceRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingTop: 15, borderTopWidth: 1, borderTopColor: COLORS.border, marginTop: 10, },
    confidenceLabel: { fontSize: 15, color: COLORS.textSecondary, marginRight: 5, fontWeight: '500', },
    confidenceValue: { fontSize: 17, fontWeight: '700', color: COLORS.textPrimary, }
});