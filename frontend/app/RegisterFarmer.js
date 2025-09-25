import React, { useState } from "react";
import { View, StyleSheet, ImageBackground, Text } from "react-native";
import { TextInput, Button } from "react-native-paper";
import {registerUser} from "../src/services/api"
import { useRouter } from "expo-router";
import Home from "./Home";

export default function RegisterFarmer({ navigation }) {
  const router = useRouter(); 
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const handleRegister = async () => {
    try {
      const userData = {
        name,
        email,
        password,
        role: "farmer",
        phone,
        location: { lat: 0, lng: 0, address },
      };
      const res = await registerUser(userData);
      alert("Farmer registered successfully!");
      router.replace("/Home");
      //  navigation.navigate("Home");
      console.log(res.data);
    } catch (err) {
      console.log(err);
      alert("Registration failed!");
    }
  };

  return (
    <ImageBackground
      source={require("../assets/images/profile.avif")}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>Register Farmer</Text>

        <TextInput
          label="Name"
          mode="outlined"
          value={name}
          onChangeText={setName}
          style={styles.input}
          theme={{ roundness: 10 }}
        />
        <TextInput
          label="Email"
          mode="outlined"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          style={styles.input}
          theme={{ roundness: 10 }}
        />
        <TextInput
          label="Password"
          mode="outlined"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
          theme={{ roundness: 10 }}
        />
        <TextInput
          label="Phone"
          mode="outlined"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          style={styles.input}
          theme={{ roundness: 10 }}
        />
        <TextInput
          label="Address"
          mode="outlined"
          value={address}
          onChangeText={setAddress}
          style={styles.input}
          multiline
          theme={{ roundness: 10 }}
        />

        <Button
          mode="contained"
          onPress={handleRegister}
          style={styles.button}
          contentStyle={{ paddingVertical: 6 }}
        >
          Register
        </Button>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  overlay: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  input: {
    marginBottom: 12,
    backgroundColor: "rgba(255,255,255,0.9)",
  },
  title: {
    fontSize: 26,
    marginBottom: 20,
    textAlign: "center",
    color: "#fff",
    fontWeight: "bold",
  },
  button: {
    marginTop: 15,
    borderRadius: 10,
  },
});