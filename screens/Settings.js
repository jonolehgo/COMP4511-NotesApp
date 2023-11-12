import React from "react";
import { Button, Text, View } from "react-native";

export default function Settings({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Settings Screen</Text>
      <Button
        title="Click me to go to detail"
        onPress={() =>
          navigation.navigate("Detail", {
            title: "From Settings",
            body: "this is the body from settings...",
          })
        }
      />
    </View>
  );
}
