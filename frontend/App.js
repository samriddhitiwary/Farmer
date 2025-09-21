import React from "react";
import { Provider as PaperProvider } from "react-native-paper";
import Toast from "react-native-toast-message";
import RegisterFarmer from "./src/screens/RegisterFarmer";

export default function App() {
  return (
    <PaperProvider>
      <RegisterFarmer />
      <Toast /> {/* Required for toasts */}
    </PaperProvider>
  );
}
