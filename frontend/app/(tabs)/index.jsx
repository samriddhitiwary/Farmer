import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import RegisterFarmer from "../RegisterFarmer";
import Home from "../Home";
import QualityGrading from "../QualityGrading";

const Stack = createNativeStackNavigator();

export default function AppStack() {
  return (
    <Stack.Navigator initialRouteName="RegisterFarmer">
      <Stack.Screen name="RegisterFarmer" component={RegisterFarmer} />
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="QualityGrading" component={QualityGrading} />
    </Stack.Navigator>
  );
}
