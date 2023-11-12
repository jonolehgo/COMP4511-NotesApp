import React, { useState, useEffect, useContext } from "react";
import {
  TextInput,
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Haptics from "expo-haptics";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { AppContext } from "../App";
import { padBtnBorderMap } from "../styles/Colors";
import { Header } from "../components/Header";

export default function Create({ route, navigation }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [img, setImg] = useState(null);

  const { currPad } = useContext(AppContext);

  var padColor = currPad;
  var ts = undefined;
  var completed = false;

  const [dynamicStyle, setDynamicStyle] = useState({
    backgroundColor: "white",
  });

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const options = {
      year: "2-digit",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    const formattedDate = new Intl.DateTimeFormat("en", options).format(date);
    return `Created at: ${formattedDate}`;
  };

  useEffect(() => {
    setDynamicStyle({ backgroundColor: padBtnBorderMap[currPad][1] });
  }, [currPad]);

  const ImageAndSaveBtn = () => {
    return (
      <View style={styles.ImageAndSaveBtnContainer}>
        <TouchableOpacity onPress={pickImage}>
          <MaterialCommunityIcons
            name="file-image-plus-outline"
            size={100}
            color="grey"
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            var timestamp = Date.now(); // Replace this with your timestamp
            ts = formatTimestamp(timestamp);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            navigation.navigate("Notes", {
              title,
              body,
              img,
              padColor,
              ts,
              completed,
            });
            setImg(null);
          }}
        >
          <Feather name="check-circle" size={90} color="grey" />
        </TouchableOpacity>
      </View>
    );
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [16, 16],
      cameraType: ImagePicker.CameraType.back,
    });
    if (!result.canceled) {
      setImg(result.assets[0].uri);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Header />
      <View style={[styles.Container, dynamicStyle]}>
        <View>
          <TextInput
            style={styles.TitleInput}
            placeholder="New Task"
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            style={styles.BodyInput}
            placeholder="Enter a description..."
            value={body}
            onChangeText={setBody}
            multiline={true}
            textAlignVertical="top"
          />
          {img && (
            <Image
              source={{ uri: img }}
              resize="cover"
              style={{ height: 200, width: 300, alignSelf: "center" }}
            ></Image>
          )}
        </View>
        <View>
          <ImageAndSaveBtn img={img} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    justifyContent: "space-between",
  },
  TitleInput: {
    fontSize: 30,
    fontWeight: "bold",
    paddingLeft: 10,
  },
  BodyInput: {
    fontSize: 25,
    padding: 10,
  },
  ImageAndSaveBtnContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingRight: 20,
    paddigLeft: 10,
    marginBottom: 20,
  },
});
