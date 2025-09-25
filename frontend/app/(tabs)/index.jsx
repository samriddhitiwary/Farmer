import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import RegisterFarmer from "../RegisterFarmer"; // ✅ now from app/
import Home from "../Home"; // ✅ from app/Home.js

const Stack = createNativeStackNavigator();

export default function AppStack() {
  return (
    <Stack.Navigator initialRouteName="RegisterFarmer">
      <Stack.Screen name="RegisterFarmer" component={RegisterFarmer} />
      <Stack.Screen name="Home" component={Home} />
    </Stack.Navigator>
  );
}
