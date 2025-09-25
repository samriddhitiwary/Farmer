import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import { Card, Button } from "react-native-paper";
import { useRouter, useLocalSearchParams } from "expo-router"; // ✅ correct import
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export default function Home() {
  const router = useRouter();
  const params = useLocalSearchParams(); // ✅ get params
  const id = params.id; // farmer ID
  const [farmerName, setFarmerName] = useState("Farmer");

  useEffect(() => {
    const fetchFarmerName = async () => {
      if (!id) return;
      try {
        const response = await fetch(`http://localhost:5000/api/users/${id}`);
        if (!response.ok) throw new Error("Failed to fetch farmer data");
        const data = await response.json();
        setFarmerName(data.name || "Farmer");
      } catch (error) {
        console.log("Error fetching farmer name:", error);
      }
    };
    fetchFarmerName();
  }, [id]);

  const GradientButton = ({ colors, icon, text, onPress }) => (
    <LinearGradient colors={colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.gradientButton}>
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
    <LinearGradient colors={["#E0F7FA", "#B2EBF2"]} style={styles.background}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Welcome, {farmerName}!</Text>

        {/* Crop Actions */}
        <Card style={styles.card}>
          <Card.Title title="Crops" left={(props) => <MaterialCommunityIcons {...props} name="leaf" size={30} color="#388E3C" />} />
          <Card.Content>
            <GradientButton colors={["#4CAF50", "#0e1c0fff"]} icon="plus" text="Add Crop" onPress={() => router.push("/AddCrop")} />
            <GradientButton colors={["#81C784", "#112012ff"]} icon="eye" text="View My Crops" onPress={() => router.push("/MyCrops")} />
            <GradientButton colors={["#A5D6A7", "#152616ff"]} icon="account" text="Update Profile" onPress={() => router.push("/Profile")} />
          </Card.Content>
        </Card>

        {/* AI Features */}
        <Card style={styles.card}>
          <Card.Title title="AI Features" left={(props) => <MaterialCommunityIcons {...props} name="robot" size={30} color="#1976D2" />} />
          <Card.Content>
            <GradientButton colors={["#0412aaff", "#1976D2"]} icon="biohazard" text="Disease Detection" onPress={() => router.push("/DiseaseDetection")} />
            <GradientButton colors={["#1607dcff", "#1E88E5"]} icon="check-circle" text="Quality Grading" onPress={() => router.push("/QualityGrading")} />
            <GradientButton colors={["#031588ff", "#1565C0"]} icon="currency-inr" text="AI Suggested Price" onPress={() => router.push("/AISuggestedPrice")} />
          </Card.Content>
        </Card>

        {/* Logout */}
        <GradientButton colors={["#EF5350", "#E53935"]} icon="logout" text="Logout" onPress={() => router.replace("/RegisterFarmer")} />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  container: { flexGrow: 1, padding: 20, alignItems: "center" },
  title: { fontSize: 30, fontWeight: "bold", color: "#2E7D32", marginBottom: 25 },
  card: { width: "100%", marginVertical: 12, borderRadius: 18, backgroundColor: "#fff", elevation: 10, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 6, paddingVertical: 12 },
  gradientButton: { borderRadius: 14, marginVertical: 8, overflow: "hidden" },
});
