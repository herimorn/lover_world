import StackNavigator from "./StackNavigator";
import { Text, View, Button } from "react-native";
import {logBox} from "react-native";
// logBox.ignorAlllogs(); // ignor lognotification by massages.
import { NavigationContainer } from "@react-navigation/native";
import * as React from "react";
import { AuthProvider } from "./hooks/useAuth";
export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <StackNavigator />
      </AuthProvider>
    </NavigationContainer>
  );
}
