import React, { useState, useEffect, useContext } from "react";

import Ionicons from "@expo/vector-icons/Ionicons";
import { View, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { AppContext } from "../App";
import StoreService from "../services/StoreService";

export const Header = ({ setNotes }) => {
  const padColors = ["white", "#FFDF36", "#FF7676", "#AAff76", "#76C5FF"];
  const padBtnBorderMap = {
    white: ["black", "white"],
    "#FFDF36": ["#D3B513", "#FFF3B2"], // yellow
    "#FF7676": ["#F94646", "#FFADAD"], // red
    "#AAff76": ["#64CC25", "#C9FFC0"], // green
    "#76C5FF": ["#2A8FD8", "#AADBFF"], // blue
  };

  const { currPad, currScreen, setCurrPad } = useContext(AppContext);

  const [dynamicStyle, setDynamicStyle] = useState({
    backgroundColor: "white",
  });

  useEffect(() => {
    setDynamicStyle({ backgroundColor: padBtnBorderMap[currPad][1] });
  }, [currPad]);

  const DeleteNotes = () => {
    Alert.alert(
      "Delete",
      "Are you sure you want to delete all tasks?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => {
            StoreService.deleteNotes();
            setNotes([]);
          },
        },
      ],
      { cancelable: false }
    );
  };

  const PadsBtn = ({ color }) => {
    return (
      <View style={styles.PadsBtnContainer}>
        <TouchableOpacity
          onPress={() => {
            setCurrPad(color);
          }}
        >
          <View
            style={[
              styles.PadsBtn,
              {
                backgroundColor: color,
                borderWidth: currPad === color ? 3 : 0,
                borderColor:
                  currPad === color ? padBtnBorderMap[color][0] : undefined,
              },
            ]}
          />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View>
      <View style={styles.topPadding}></View>
      <View style={[styles.HeaderContainer, dynamicStyle]}>
        <View style={styles.PadsContainer}>
          {currScreen === "Create" &&
            padColors.map(
              (color) =>
                color !== "white" && <PadsBtn key={color} color={color} />
            )}
          {currScreen === "Notes" &&
            padColors.map((color) => <PadsBtn key={color} color={color} />)}
        </View>
        <View style={styles.DeleteContainer}>
          <TouchableOpacity onPress={DeleteNotes}>
            <Ionicons name="md-trash-bin" color="grey" size={40} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  topPadding: { height: 30 },
  HeaderContainer: {
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    height: 90,
    paddingLeft: 20,
  },
  PadsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  DeleteContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingRight: 20,
  },
  PadsBtnContainer: {
    padding: 4,
  },
  PadsBtn: {
    height: 40,
    width: 40,
    borderRadius: 8,
  },
});
