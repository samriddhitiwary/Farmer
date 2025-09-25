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
    Animated,
    Easing,
    SafeAreaView, // REQUIRED for proper header placement
    ScrollView,   // REQUIRED for scrollable content
} from 'react-native';

import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router"; // <-- EXPO ROUTER IMPORT
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; 
import { launchImageLibrary } from 'react-native-image-picker';

// --- THEME COLORS ---
const COLORS = {
    gradientStart: '#d2f4ef', 
    gradientEnd: '#aed6f1',   
    cardBackground: '#ffffff',
    primaryButton: '#3498db', 
    secondaryButton: '#2ecc71', 
    textPrimary: '#2c3e50',   
    textSecondary: '#7f8c8d', 
    accentSuccess: '#27ae60', 
    accentWarning: '#f39c12', 
    accentDanger: '#e74c3c',  
    border: '#ecf0f1',        
    shadowColor: '#aed6f1',   
    disabled: '#bdc3c7',      
    headerColor: '#1a73e8',
};
// --------------------

// --- CUSTOM HEADER COMPONENT (FIXED) ---
// --- CUSTOM HEADER COMPONENT (FINAL POLISHED UI) ---
const CustomHeader = ({ router }) => (
    <View style={polishedHeaderStyles.headerContainer}>
        <TouchableOpacity 
            style={polishedHeaderStyles.backButton} 
            // Ensures the button always returns to the main screen
            onPress={() => router.replace('/Home')} 
            activeOpacity={0.6} // More defined feedback on press
        >
            <Icon 
                name="chevron-left" // Modern back icon
                size={28} 
                color={COLORS.textPrimary} 
            />
        </TouchableOpacity>
        
        <Text style={polishedHeaderStyles.headerTitle}>Back To Dashboard</Text> 
        
        {/* Placeholder to keep the title perfectly centered */}
        <View style={polishedHeaderStyles.placeholder} />
    </View>
);


// --- FINALIZED STYLES FOR THE POLISHED HEADER ---
const polishedHeaderStyles = StyleSheet.create({
    headerContainer: {
        width: '100%',
        height: 65, // Premium height
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: COLORS.cardBackground, 
        
        // Modern Floating Effect:
        shadowColor: COLORS.primaryButton, // Use a theme color for a softer shadow
        shadowOffset: { width: 0, height: 4 }, // Lifts the header
        shadowOpacity: 0.1, 
        shadowRadius: 6,
        elevation: 8, // Stronger Android shadow
        
        borderBottomWidth: 0, // No hard bottom line
        paddingHorizontal: 15,
    },
    backButton: {
        // Generous padding for a large, comfortable touch area
        paddingVertical: 10,
        paddingRight: 15, 
    },
    headerTitle: {
        fontSize: 21, // Slightly larger title font
        fontWeight: '800', // Extra bold for prominence
        color: COLORS.textPrimary,
        letterSpacing: 0.5, // Adds a subtle, professional touch
    },
    placeholder: {
        width: 38, // Matches icon area width
    }
});

// REMINDER: Replace the existing 'headerStyles' definition 
// near the top of your component file with 'polishedHeaderStyles' 
// to complete the upgrade.

const headerStyles = StyleSheet.create({
    headerContainer: {
        width: '100%',
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: COLORS.cardBackground,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
        paddingHorizontal: 15,
        elevation: 4, 
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    backButton: {
        padding: 5,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: COLORS.textPrimary,
    },
    placeholder: {
        width: 36,
    }
});
// ---------------------------------


const QualityGrading = () => {
    // --- EXPO ROUTER HOOK ---
    const router = useRouter(); 
    // ------------------------

    const [imageUri, setImageUri] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [grade, setGrade] = useState(null);
    const [confidence, setConfidence] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('Analyzing...'); 

    const translateYAnim = useRef(new Animated.Value(50)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (grade) {
            Animated.parallel([
                Animated.timing(translateYAnim, { toValue: 0, duration: 500, easing: Easing.out(Easing.ease), useNativeDriver: true }),
                Animated.timing(opacityAnim, { toValue: 1, duration: 500, easing: Easing.out(Easing.ease), useNativeDriver: true }),
            ]).start();
        } else {
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
            setImageUri(asset.uri);
            setImageFile({ 
                uri: Platform.OS === 'android' ? asset.uri : asset.uri.replace('file://', ''),
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
        setLoadingMessage('Uploading image...');
        setGrade(null);
        setConfidence(null);

        const formData = new FormData();
        formData.append('file', imageFile);

        try {
            const response = await fetch(API_URL, { method: 'POST', body: formData });
            
            if (!response.ok) {
                const errText = await response.text();
                console.error('Server error:', errText);
                Alert.alert('Upload Failed', `Server responded with status ${response.status}.`);
                return;
            }

            setLoadingMessage('Processing quality...');
            const data = await response.json();

            setGrade(data.grade);
            setConfidence(data.confidence ? data.confidence.toFixed(2) : 'N/A');
            
        } catch (error) {
            console.error('Upload error:', error);
            Alert.alert('Upload Failed', `Could not connect to the server.`);
        } finally {
            setLoading(false);
            setLoadingMessage('Analyzing...');
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
            style={[styles.button, { backgroundColor: disabled ? COLORS.disabled : color || COLORS.primaryButton }, style]}
            disabled={disabled}
        >
            {Icon && iconName && <Icon name={iconName} size={20} color={COLORS.cardBackground} style={styles.buttonIcon} />}
            <Text style={styles.buttonText}>{title}</Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            {/* Pass the router object to the custom header */}
            <CustomHeader router={router} />
            
            <LinearGradient
                colors={[COLORS.gradientStart, COLORS.gradientEnd]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.contentContainer}
            >
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
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
                </ScrollView>
            </LinearGradient>
        </SafeAreaView>
    );
};

export default QualityGrading;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.cardBackground, 
    },
    contentContainer: { 
        flex: 1, 
        width: '100%',
    },
    scrollContent: {
        alignItems: 'center', 
        paddingTop: 30, 
        paddingHorizontal: 20,
        paddingBottom: 50, 
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
        borderRadius: 15, 
        padding: 25, 
        marginBottom: 25, 
        shadowColor: COLORS.shadowColor, 
        shadowOffset: { width: 0, height: 8 }, 
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
        height: 220, 
        backgroundColor: COLORS.border, 
        borderRadius: 10, 
        overflow: 'hidden', 
        marginBottom: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: COLORS.disabled,
        borderStyle: 'dashed',
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
        paddingVertical: 16, 
        paddingHorizontal: 25,
        borderRadius: 10, 
        width: '100%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 5,
        elevation: 5,
    },
    buttonIcon: {
        marginRight: 12, 
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
        borderLeftWidth: 8, 
        paddingVertical: 30, 
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
        fontSize: 68, 
        fontWeight: '900', 
        textAlign: 'center',
        lineHeight: 70,
    },
    gradeDescription: {
        fontSize: 22, 
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