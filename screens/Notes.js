import React, { useEffect, useState, useContext } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import StoreService from "../services/StoreService";
import { AppContext } from "../App";
import { padBtnBorderMap } from "../styles/Colors";
import { Header } from "../components/Header";

export default function Notes({ route, navigation }) {
  const { title, body, img, padColor, ts, completed } = route.params ?? {};
  const [notes, setNotes] = useState([]);

  const { currPad } = useContext(AppContext);

  const [dynamicStyle, setDynamicStyle] = useState({
    backgroundColor: "white",
  });

  // helper function to format timestamp
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
    return `Completed at: ${formattedDate}`;
  };

  // toggle notes to complete or uncomplete on longpress
  const toggleComplete = ({ title, body, ts }) => {
    const newNotes = [...notes];
    const idx = newNotes.findIndex(
      (note) => note.title === title && note.body === body && note.ts === ts
    );
    newNotes.at(idx).completed = !newNotes.at(idx).completed;
    newNotes.at(idx).completedTs = formatTimestamp(Date.now());
    setNotes(newNotes);
  };

  // Change background colour depending on the chosen pad
  useEffect(() => {
    setDynamicStyle({ backgroundColor: padBtnBorderMap[currPad][1] });
  }, [currPad]);

  useEffect(() => {
    if (title && body) {
      setNotes((prevNotes) => [
        ...prevNotes,
        { title, body, img, padColor, ts, completed },
      ]);
    }
  }, [title, body, img]);

  // When notes screen first mounts load notes from store
  useEffect(() => {
    StoreService.getNotes().then((notes) => setNotes(notes));
  }, []);

  // When ever notes is updated save the notes to the store
  useEffect(() => {
    StoreService.saveNotes(notes);
  }, [notes]);

  const OpenItems = () => {
    return (
      <View>
        {notes
          .filter(
            (note) =>
              (currPad === "white" && !note.completed) ||
              (note.padColor === currPad && !note.completed)
          )
          .map(({ title, body, img, padColor, ts }, idx) => (
            <TouchableOpacity
              style={{
                ...styles.noteCard,
                backgroundColor: padColor,
                borderWidth: padColor === "white" ? 1 : 0,
                borderColor: padColor === "white" ? "silver" : undefined,
              }}
              key={title + idx}
              onPress={() =>
                navigation.navigate("Detail", {
                  title,
                  body,
                  img,
                  ts,
                  padColor,
                  notes,
                  setNotes: setNotes,
                })
              }
              onLongPress={() => {
                toggleComplete({ title, body, ts });
              }}
            >
              <View style={styles.noteCardContainer}>
                <Image
                  style={styles.noteCardImg}
                  source={{ uri: img }}
                  resize="cover"
                />
                <View style={styles.noteCardDescContainer}>
                  <View>
                    <Text style={styles.noteCardTitle}>{title}</Text>
                    <Text style={styles.noteCardBody}>{body}</Text>
                  </View>
                  <View style={{ alignItems: "flex-end" }}>
                    <Text style={styles.noteCardTs}>{ts}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
      </View>
    );
  };

  const ClosedItems = () => {
    return (
      <View style={styles.closedNoteCardContainer}>
        {notes
          .filter(
            (note) =>
              (currPad === "white" && note.completed) ||
              (note.padColor === currPad && note.completed)
          )
          .map(({ title, body, img, padColor, ts, completedTs }, idx) => (
            <TouchableOpacity
              style={{
                ...styles.closedNoteCard,
                backgroundColor: padColor,
                borderWidth: padColor === "white" ? 1 : 0,
                borderColor: padColor === "white" ? "silver" : undefined,
              }}
              key={title + idx}
              onPress={() =>
                navigation.navigate("Detail", {
                  title,
                  body,
                  img,
                  ts,
                  padColor,
                  notes,
                  setNotes: setNotes,
                })
              }
              onLongPress={() => {
                toggleComplete({ title, body, ts });
              }}
            >
              <View style={styles.closedNoteCardDesc}>
                <View>
                  <Text style={styles.closedNoteCardTitle}>{title}</Text>
                </View>
                <View>
                  <Text style={styles.closedNoteCardTs}>{completedTs}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
      </View>
    );
  };

  return (
    <View style={[styles.Containter, dynamicStyle]}>
      <Header setNotes={setNotes} />
      <ScrollView style={styles.notesContainer}>
        <OpenItems />
        <ClosedItems />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  Containter: {
    flex: 1,
  },
  notesContainer: {},
  noteCardContainer: {
    flexDirection: "row",
    padding: 10,
  },

  noteCard: {
    height: 120,
    borderRadius: 8,
    justifyContent: "center",
    marginHorizontal: 10,
    marginBottom: 5,
  },
  noteCardImg: {
    height: 100,
    width: 100,
    alignSelf: "center",
    borderWidth: 1,
    borderColor: "silver",
    borderRadius: 8,
  },
  noteCardDescContainer: {
    flex: 1,
    padding: 5,
    justifyContent: "space-between",
  },
  closedNoteCard: {
    height: 40,
    borderRadius: 8,
    justifyContent: "center",
    marginHorizontal: 10,
    marginBottom: 5,
  },
  closedNoteCardContainer: {
    flexDirection: "col",
  },
  closedNoteCardDesc: {
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  noteCardTitle: {
    fontWeight: "bold",
  },
  noteCardTs: {
    color: "grey",
    fontStyle: "italic",
  },
  closedNoteCardTitle: {
    fontWeight: "bold",
  },
  closedNoteCardTs: {
    color: "grey",
    fontStyle: "italic",
    paddingRight: 5,
  },
});
