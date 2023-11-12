import React, { useEffect, useState } from "react";
import {
  TextInput,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Header } from "../components/Header";
import { Feather } from "@expo/vector-icons";
import { padBtnBorderMap } from "../styles/Colors";

export default function Detail({ route, navigation }) {
  const { title, body, ts, img, padColor, notes, setNotes } = route.params;

  const [editTitle, setEditTitle] = useState(title);
  const [editBody, setEditBody] = useState(body);

  useEffect(() => navigation.setOptions({ title: ts }), [title]);

  useEffect(() => {
    navigation.setOptions({
      setNotes: setNotes,
    });
  }, [setNotes]);

  const updateNotes = ({ title, body, ts }) => {
    const newNotes = [...notes];
    const idx = newNotes.findIndex(
      (note) => note.title === title && note.body === body && note.ts === ts
    );
    newNotes.at(idx).title = editTitle;
    newNotes.at(idx).body = editBody;
    setNotes(newNotes);
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

  const ImageBtnAndSave = () => {
    return (
      <View style={styles.ImageAndSaveBtnContainer}>
        <TouchableOpacity onPress={pickImage}>
          <MaterialCommunityIcons
            name="file-image-plus-outline"
            size={100}
            color="grey"
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => updateNotes({ title, body, ts })}>
          <Feather name="check-circle" size={90} color="grey" />
        </TouchableOpacity>
      </View>
    );
  };
  return (
    <View
      style={[
        styles.Container,
        { backgroundColor: padBtnBorderMap[padColor][1] },
      ]}
    >
      <View>
        <View style={{ marginTop: -30 }}>
          <Header />
        </View>
        <TextInput
          style={styles.TitleInput}
          value={editTitle}
          onChangeText={(text) => setEditTitle(text)}
        />
        <TextInput
          style={styles.BodyInput}
          value={editBody}
          onChangeText={(text) => setEditBody(text)}
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
        <ImageBtnAndSave />
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
    marginTop: 10,
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
