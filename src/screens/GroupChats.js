import { ScrollView, Alert, View, Text, TouchableOpacity } from "react-native";
import React, { useContext, useState, useLayoutEffect, useRef } from "react";
import { UserType } from "../UserContext";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import Appcolor from "../Appcolor";
import GroupChat from "../components/GroupChat";
import { useFocusEffect } from "@react-navigation/native";

const GroupChats = () => {
  const [groups, setGroups] = useState([]);
  const { userId, setUserId } = useContext(UserType);
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Chat Room",
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
          style={{ flexDirection: "row", alignItems: "center" }}
        >
          <Ionicons name="chevron-back" size={24} color="#0096FF" />
          <Text style={{ fontWeight: "bold", fontSize: 15, color: "#0096FF" }}>
            Back
          </Text>
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("CreateGroup");
          }}
          style={{ alignItems: "center" }}
        >
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 12,
              color: "#0096FF",
              marginRight: 10,
            }}
          >
            Create Group
          </Text>
        </TouchableOpacity>
      ),
    });
  }, []);

  const getGroupData = async () => {
    axios
      .get(`http://localhost:8000/api/v1/chat/groups/${userId}`)
      .then((response) => {
        setGroups(response.data);
      })
      .catch((error) => {
        Alert.alert("Accepted Friends Error", "error fetching messages");
        console.log("Messge Error", error);
      });
  };

  // useFocusEffect for screen focus
  useFocusEffect(
    React.useCallback(() => {
      getGroupData();
    }, [])
  );

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{ flex: 1, backgroundColor: Appcolor.white }}
      contentContainerStyle={{ padding: 15 }}
    >
      {groups.length > 0 ? (
        <View>
          {groups.map((item, index) => (
            <GroupChat key={index} item={item} />
          ))}
        </View>
      ) : (
        <View>
          <Text>No Group in List</Text>
        </View>
      )}
    </ScrollView>
  );
};

export default GroupChats;
