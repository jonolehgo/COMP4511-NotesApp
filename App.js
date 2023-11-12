import React, { useState } from "react";

import Ionicons from "@expo/vector-icons/Ionicons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import Settings from "./screens/Settings";
import Notes from "./screens/Notes";
import Detail from "./screens/Detail";
import Create from "./screens/Create";
import { View, StyleSheet } from "react-native";

const AppContext = React.createContext();

const Tabs = createBottomTabNavigator();
const RootStack = createNativeStackNavigator();

export default function App() {
  const [currPad, setCurrPad] = useState("white");
  const [currScreen, setCurrScreen] = useState("Notes");

  const BottomTabs = () => (
    <Tabs.Navigator screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="Notes"
        component={Notes}
        options={{
          tabBarIcon: ({ size }) => (
            <Ionicons name="md-document-text-outline" size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="Create"
        component={Create}
        options={{
          tabBarIcon: ({ size }) => (
            <Ionicons name="add-circle-outline" size={size} />
          ),
          onPress: () => {
            console.log("heylooooooooo");
            setCurrScreen("Create");
          },
        }}
      />
      <Tabs.Screen
        name="Settings"
        component={Settings}
        options={{
          tabBarIcon: ({ size }) => (
            <Ionicons name="md-settings-outline" size={size} />
          ),
        }}
      />
    </Tabs.Navigator>
  );

  return (
    <AppContext.Provider
      value={{ currPad, setCurrPad, currScreen, setCurrScreen }}
    >
      <View style={styles.Containter}>
        <NavigationContainer>
          <RootStack.Navigator>
            <RootStack.Screen
              name="Tabs"
              component={BottomTabs}
              options={{ headerShown: false }}
            />
            <RootStack.Screen name="Detail" component={Detail} />
            <RootStack.Screen name="Create" component={Create} />
          </RootStack.Navigator>
        </NavigationContainer>
      </View>
    </AppContext.Provider>
  );
}

export { AppContext };

const styles = StyleSheet.create({
  Containter: {
    flex: 1,
  },
});
