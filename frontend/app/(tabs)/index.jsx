import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import RegisterFarmer from "../../src/screens/RegisterFarmer";
import AddCrop from "../../src/screens/AddCrop";

const Stack = createNativeStackNavigator();

export default function AppStack() {
  return (
    <Stack.Navigator initialRouteName="RegisterFarmer">
      <Stack.Screen name="RegisterFarmer" component={RegisterFarmer} />
      <Stack.Screen name="AddCrop" component={AddCrop} />
    </Stack.Navigator>
  );
}
