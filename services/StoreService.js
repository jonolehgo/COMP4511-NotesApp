import AsyncStorage from "@react-native-async-storage/async-storage";
const NOTES_CACHE_KEY = "@notes";

export default {
  async getNotes() {
    try {
      const storedNotes = await AsyncStorage.getItem(NOTES_CACHE_KEY);
      return storedNotes ? JSON.parse(storedNotes) : [];
    } catch (error) {
      console.log("Failed to get notes", error);
    }
  },
  async saveNotes(notes) {
    try {
      await AsyncStorage.setItem(NOTES_CACHE_KEY, JSON.stringify(notes));
    } catch (error) {
      console.log("Failed to save notes", error);
    }
  },
  async deleteNotes() {
    try {
      await AsyncStorage.removeItem(NOTES_CACHE_KEY);
    } catch (error) {
      console.log("Failed to set notes", error);
    }
  },
};
