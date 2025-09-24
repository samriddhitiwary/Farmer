import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

const AuthScreen = () => {
  const navigation = useNavigation();
  const [isRegister, setIsRegister] = useState(true); // Toggle between Register/Login
  const [loading, setLoading] = useState(false);

  // Common fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState({
    lat: "",
    lng: "",
    address: "",
  });

  // Handle registration
  const handleRegister = async () => {
    if (!name || !email || !password || !phone || !location.address) {
      Alert.alert("Error", "Please fill all the fields");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/users/register", {
        name,
        email,
        password,
        role: "farmer",
        phone,
        location: {
          lat: parseFloat(location.lat),
          lng: parseFloat(location.lng),
          address: location.address,
        },
      });

      setLoading(false);
      Alert.alert("Success", "Farmer registered successfully!");
      navigation.navigate("HomePage"); // Navigate to home
    } catch (err) {
      setLoading(false);
      Alert.alert("Registration Failed", err.response?.data?.message || "Server Error");
    }
  };

  // Handle login
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/users/login", {
        email,
        password,
      });

      setLoading(false);
      Alert.alert("Success", "Logged in successfully!");
      navigation.navigate("HomePage"); // Navigate to home
    } catch (err) {
      setLoading(false);
      Alert.alert("Login Failed", err.response?.data?.message || "Server Error");
    }
  };

  return (
    <View style={styles.container}>
      {/* Toggle buttons */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[styles.toggleButton, isRegister && styles.activeButton]}
          onPress={() => setIsRegister(true)}
        >
          <Text style={styles.toggleText}>Register</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.toggleButton, !isRegister && styles.activeButton]}
          onPress={() => setIsRegister(false)}
        >
          <Text style={styles.toggleText}>Login</Text>
        </TouchableOpacity>
      </View>

      {/* Form */}
      <View style={styles.formContainer}>
        {isRegister && (
          <>
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={styles.input}
              placeholder="Phone"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />
            <TextInput
              style={styles.input}
              placeholder="Location Address"
              value={location.address}
              onChangeText={(text) => setLocation({ ...location, address: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Latitude"
              keyboardType="numeric"
              value={location.lat}
              onChangeText={(text) => setLocation({ ...location, lat: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Longitude"
              keyboardType="numeric"
              value={location.lng}
              onChangeText={(text) => setLocation({ ...location, lng: text })}
            />
          </>
        )}

        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={isRegister ? handleRegister : handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>{isRegister ? "Register" : "Login"}</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AuthScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#f0f8ff",
  },
  toggleContainer: {
    flexDirection: "row",
    marginBottom: 20,
    borderRadius: 8,
    overflow: "hidden",
  },
  toggleButton: {
    flex: 1,
    padding: 15,
    backgroundColor: "#e0e0e0",
    alignItems: "center",
  },
  activeButton: {
    backgroundColor: "#2e8b57",
  },
  toggleText: {
    color: "#fff",
    fontWeight: "bold",
  },
  formContainer: {
    marginTop: 10,
  },
  input: {
    height: 50,
    borderColor: "#888",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
  },
  button: {
    height: 50,
    backgroundColor: "#2e8b57",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
