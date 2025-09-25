import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Card, Button } from "react-native-paper";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
 // for gradient buttons

export default function Home() {
  const router = useRouter();

  const GradientButton = ({ colors, icon, text, onPress }) => (
    <LinearGradient
      colors={colors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.gradientButton}
    >
      <Button
        mode="text"
        icon={icon}
        textColor="#fff"
        onPress={onPress}
        contentStyle={{ height: 50 }}
        labelStyle={{ fontSize: 16, fontWeight: "bold" }}
      >
        {text}
      </Button>
    </LinearGradient>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Welcome, Farmer!</Text>

      {/* Crop Actions */}
      <Card style={styles.card}>
        <Card.Title
          title="Crops"
          left={(props) => (
            <MaterialCommunityIcons {...props} name="leaf" size={30} color="#388E3C" />
          )}
        />
        <Card.Content>
          <GradientButton
            colors={["#4CAF50", "#2E7D32"]}
            icon="plus"
            text="Add Crop"
            onPress={() => router.push("/AddCrop")}
          />
          <GradientButton
            colors={["#A5D6A7", "#66BB6A"]}
            icon="eye"
            text="View My Crops"
            onPress={() => router.push("/MyCrops")}
          />
          <GradientButton
            colors={["#81C784", "#388E3C"]}
            icon="account"
            text="Update Profile"
            onPress={() => router.push("/Profile")}
          />
        </Card.Content>
      </Card>

      {/* AI Features */}
      <Card style={styles.card}>
        <Card.Title
          title="AI Features"
          left={(props) => (
            <MaterialCommunityIcons {...props} name="robot" size={30} color="#1976D2" />
          )}
        />
        <Card.Content>
          <GradientButton
            colors={["#2196F3", "#1976D2"]}
            icon="biohazard"
            text="Disease Detection"
            onPress={() => router.push("/DiseaseDetection")}
          />
          <GradientButton
            colors={["#42A5F5", "#1E88E5"]}
            icon="check-circle"
            text="Quality Grading"
            onPress={() => router.push("/QualityGrading")}
          />
          <GradientButton
            colors={["#64B5F6", "#1565C0"]}
            icon="currency-inr"
            text="AI Suggested Price"
            onPress={() => router.push("/AISuggestedPrice")}
          />
        </Card.Content>
      </Card>

      {/* Logout */}
      <GradientButton
        colors={["#EF5350", "#E53935"]}
        icon="logout"
        text="Logout"
        onPress={() => router.replace("/RegisterFarmer")}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#2E7D32",
    marginBottom: 25,
  },
  card: {
    width: "100%",
    marginVertical: 10,
    borderRadius: 15,
    backgroundColor: "#f9f9f9",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    paddingVertical: 10,
  },
  gradientButton: {
    borderRadius: 12,
    marginVertical: 8,
    overflow: "hidden",
  },
});
