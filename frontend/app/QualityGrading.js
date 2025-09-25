import React, { useState, useEffect, useRef } from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    Image, 
    ActivityIndicator, 
    StyleSheet, 
    Platform, 
    Alert,
    Animated, // For animations
    Easing,   // For animations
} from 'react-native';

// For gradients (you might need to install this: npm install react-native-linear-gradient)
// If you don't install, just use a plain background color in `styles.container`
import { LinearGradient } from "expo-linear-gradient";

// Uncomment this line AFTER installing and linking react-native-vector-icons
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; 

import { launchImageLibrary } from 'react-native-image-picker';

// --- THEME COLORS ---
const COLORS = {
    gradientStart: '#d2f4ef', // Lighter greenish-blue
    gradientEnd: '#aed6f1',   // Softer blue
    cardBackground: '#ffffff',
    primaryButton: '#3498db', // Stronger blue for primary actions
    secondaryButton: '#2ecc71', // Vibrant green for secondary actions
    textPrimary: '#2c3e50',   // Dark blue-gray for main text
    textSecondary: '#7f8c8d', // Muted gray for secondary text
    accentSuccess: '#27ae60', // Deeper green for A grade
    accentWarning: '#f39c12', // Orange for B grade
    accentDanger: '#e74c3c',  // Red for C grade
    border: '#ecf0f1',        // Light gray for borders
    shadowColor: '#aed6f1',   // Soft blue for shadows
    disabled: '#bdc3c7',      // Lighter gray for disabled elements
};
// --------------------


const QualityGrading = () => {
    const [imageUri, setImageUri] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [grade, setGrade] = useState(null);
    const [confidence, setConfidence] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('Analyzing...'); // More specific loading message

    // Animation for result card entry
    const translateYAnim = useRef(new Animated.Value(50)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (grade) {
            Animated.parallel([
                Animated.timing(translateYAnim, {
                    toValue: 0,
                    duration: 500,
                    easing: Easing.out(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(opacityAnim, {
                    toValue: 1,
                    duration: 500,
                    easing: Easing.out(Easing.ease),
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            // Reset animation when grade is cleared
            translateYAnim.setValue(50);
            opacityAnim.setValue(0);
        }
    }, [grade]);


    const API_URL = 'http://localhost:8000/api/grade_crop'; 

    const pickImage = () => {
        launchImageLibrary({ mediaType: 'photo', selectionLimit: 1 }, (response) => {
            if (response.didCancel) return;
            if (response.errorCode) {
                return Alert.alert('Error', `ImagePicker Error: ${response.errorMessage}`);
            }
            
            const asset = response.assets[0];
            const uri = asset.uri;
            
            setImageUri(uri);
            setImageFile({ 
                uri: Platform.OS === 'android' ? uri : uri.replace('file://', ''),
                name: asset.fileName || 'crop.jpg', 
                type: asset.type || 'image/jpeg' 
            });
            
            setGrade(null); // Clear previous grade
            setConfidence(null);
        });
    };

    const uploadImage = async () => {
        if (!imageFile) return;
        setLoading(true);
        setLoadingMessage('Uploading image...');
        setGrade(null);
        setConfidence(null);

        const formData = new FormData();
        formData.append('file', imageFile);

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errText = await response.text();
                console.error('Server error:', errText);
                Alert.alert('Upload Failed', `Server responded with status ${response.status}.`);
                return;
            }

            setLoadingMessage('Processing quality...');
            const data = await response.json();
            console.log("Backend response:", data);

            setGrade(data.grade);
            setConfidence(data.confidence ? data.confidence.toFixed(2) : 'N/A');
            
        } catch (error) {
            console.error('Upload error:', error);
            Alert.alert('Upload Failed', `Could not connect to the server. Is the backend server running?`);
        } finally {
            setLoading(false);
            setLoadingMessage('Analyzing...'); // Reset message
        }
    };

    const getGradeInfo = (g) => {
        switch (g) {
            case 'A': return { color: COLORS.accentSuccess, description: 'Excellent Quality', icon: 'check-circle' }; 
            case 'B': return { color: COLORS.accentWarning, description: 'Mixed Quality', icon: 'alert-circle' };
            case 'C': return { color: COLORS.accentDanger, description: 'Poor Quality', icon: 'close-circle' };
            default: return { color: COLORS.textSecondary, description: 'No Grade', icon: 'information' };
        }
    };

    const GradeInfo = getGradeInfo(grade);


    const CustomButton = ({ title, onPress, iconName, disabled, color, style }) => (
        <TouchableOpacity 
            onPress={onPress} 
            style={[
                styles.button, 
                { backgroundColor: disabled ? COLORS.disabled : color || COLORS.primaryButton },
                style
            ]}
            disabled={disabled}
        >
            {/* Replace Icon with the actual component from react-native-vector-icons */}
            {Icon && iconName && <Icon name={iconName} size={20} color={COLORS.cardBackground} style={styles.buttonIcon} />}
            <Text style={styles.buttonText}>{title}</Text>
        </TouchableOpacity>
    );

    return (
        <LinearGradient
            colors={[COLORS.gradientStart, COLORS.gradientEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.container}
        >
            <Text style={styles.title}>Crop Quality Analyzer</Text>
            
            {/* Image Picker Section */}
            <View style={styles.card}>
                <Text style={styles.cardTitle}>1. Select Your Crop Image</Text>
                
                <View style={styles.imagePlaceholder}>
                    {imageUri ? (
                        <Image source={{ uri: imageUri }} style={styles.image} />
                    ) : (
                        <View style={styles.noImageTextContainer}>
                            {Icon && <Icon name="image-plus" size={50} color={COLORS.disabled} />}
                            <Text style={styles.noImageText}>Tap 'Pick Image' below</Text>
                        </View>
                    )}
                </View>

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
                        style={{ marginBottom: 15, width: '100%', padding: 10, borderRadius: 8, borderColor: COLORS.border, borderWidth: 1 }}
                    />
                ) : (
                    <CustomButton 
                        title="Pick Image" 
                        onPress={pickImage} 
                        iconName="folder-multiple-image"
                        color={COLORS.primaryButton}
                    />
                )}
            </View>

            {/* Grading Button Section */}
            {!loading ? (
                <CustomButton
                    title="2. Analyze Quality"
                    onPress={uploadImage}
                    iconName="chart-bar"
                    disabled={!imageFile || loading}
                    color={COLORS.secondaryButton} 
                    style={{marginBottom: 30}}
                />
            ) : (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={COLORS.secondaryButton} />
                    <Text style={styles.loadingText}>{loadingMessage}</Text>
                </View>
            )}
            
            {/* Results Section */}
            {grade && (
                <Animated.View style={[
                    styles.card, 
                    styles.resultCard, 
                    { borderColor: GradeInfo.color, transform: [{ translateY: translateYAnim }], opacity: opacityAnim }
                ]}>
                    <Text style={styles.cardTitle}>3. Analysis Result</Text>
                    
                    <View style={styles.gradeDisplay}>
                        {Icon && <Icon name={GradeInfo.icon} size={30} color={GradeInfo.color} style={styles.gradeIcon} />}
                        <Text style={[styles.gradeText, { color: GradeInfo.color }]}>{grade}</Text>
                    </View>
                    <Text style={[styles.gradeDescription, {color: COLORS.textPrimary}]}>{GradeInfo.description}</Text>

                    <View style={styles.confidenceRow}>
                        {Icon && <Icon name="chart-areaspline" size={20} color={COLORS.textSecondary} style={styles.confidenceIcon} />}
                        <Text style={styles.confidenceLabel}>Confidence:</Text>
                        <Text style={styles.confidenceValue}>{confidence}%</Text>
                    </View>
                </Animated.View>
            )}
        </LinearGradient>
    );
};

export default QualityGrading;

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        // backgroundColor: COLORS.background, // Replaced by LinearGradient
        alignItems: 'center', 
        paddingTop: 60, 
        paddingHorizontal: 20 
    },
    title: { 
        fontSize: 32, 
        fontWeight: '800', 
        color: COLORS.textPrimary, 
        marginBottom: 30,
        textAlign: 'center',
        textShadowColor: 'rgba(0, 0, 0, 0.05)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    card: { 
        width: '100%', 
        backgroundColor: COLORS.cardBackground, 
        borderRadius: 15, // More rounded corners
        padding: 25, 
        marginBottom: 25, 
        shadowColor: COLORS.shadowColor, 
        shadowOffset: { width: 0, height: 8 }, // Softer, deeper shadow
        shadowOpacity: 0.2, 
        shadowRadius: 10, 
        elevation: 10,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    cardTitle: {
        fontSize: 19,
        fontWeight: '700',
        color: COLORS.primaryButton,
        marginBottom: 20,
        textAlign: 'center',
    },
    imagePlaceholder: { 
        width: '100%', 
        height: 220, // Slightly taller
        backgroundColor: COLORS.background, 
        borderRadius: 10, 
        overflow: 'hidden', 
        marginBottom: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: COLORS.border,
        borderStyle: 'dashed', // Dashed border for placeholder
    },
    image: { 
        width: '100%', 
        height: '100%', 
        resizeMode: 'cover' 
    },
    noImageTextContainer: {
        alignItems: 'center',
    },
    noImageText: {
        color: COLORS.textSecondary,
        marginTop: 10,
        fontSize: 15,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16, // Larger touch target
        paddingHorizontal: 25,
        borderRadius: 10, // More rounded
        width: '100%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 5,
        elevation: 5,
    },
    buttonIcon: {
        marginRight: 12, // More space for icon
    },
    buttonText: {
        color: COLORS.cardBackground,
        fontSize: 17,
        fontWeight: '700',
    },
    loadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        marginBottom: 30,
        width: '100%',
    },
    loadingText: {
        fontSize: 16,
        color: COLORS.textSecondary,
        marginLeft: 10,
        fontWeight: '500',
    },
    resultCard: {
        borderLeftWidth: 8, // Thicker accent border
        paddingVertical: 30, // More vertical padding
    },
    gradeDisplay: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    gradeIcon: {
        marginRight: 10,
    },
    gradeText: {
        fontSize: 68, // Larger grade text
        fontWeight: '900', 
        textAlign: 'center',
        lineHeight: 70,
    },
    gradeDescription: {
        fontSize: 22, // Larger description
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 20,
    },
    confidenceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 15,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
        marginTop: 10,
    },
    confidenceIcon: {
        marginRight: 8,
    },
    confidenceLabel: {
        fontSize: 16,
        color: COLORS.textSecondary,
        marginRight: 5,
        fontWeight: '500',
    },
    confidenceValue: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.textPrimary,
    }
});