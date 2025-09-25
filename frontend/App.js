import React from "react";
import { Provider as PaperProvider } from "react-native-paper";
import Toast from "react-native-toast-message";
import { ExpoRoot } from "expo-router";

export default function App() {
  const ctx = require.context("./app");

  return (
    <PaperProvider>
      <ExpoRoot context={ctx} />
      <Toast />
    </PaperProvider>
  );
}
