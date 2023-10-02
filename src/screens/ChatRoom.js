import React from "react";
import { View, StyleSheet } from "react-native";
import MyBottomNavigator from "../components/MyBottomNavigator";

export default function ChatRoom() {
  return (
    <View style={styles.mainContainer}>
      <MyBottomNavigator />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
});
