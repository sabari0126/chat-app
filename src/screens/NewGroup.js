import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import Appcolor from "../";

export default function CreateGroup(props) {
  return (
    <View style={{ ...styles.mainContainer }}>
      <View style={{ ...styles.mainContainer, padding: 15 }}>
        <Text style={{ fontWeight: "bold", fontSize: 15 }}>Group Details</Text>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Appcolor.white,
  },
});
