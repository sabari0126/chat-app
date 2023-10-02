import {
  ScrollView,
  Pressable,
  Alert,
  TouchableOpacity,
  Text,
} from "react-native";
import React, { useContext, useState, useLayoutEffect } from "react";
import { UserType } from "../UserContext";
import UserChat from "../components/UserChat";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import Appcolor from "../Appcolor";
import { useFocusEffect } from "@react-navigation/native";

const ChatsScreen = () => {
  const [acceptedFriends, setAcceptedFriends] = useState([]);
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
    });
  }, []);

  const acceptedFriendsList = async () => {
    axios
      .get(`http://localhost:8000/api/v1/chat/accepted-friends/${userId}`)
      .then((response) => {
        setAcceptedFriends(response.data);
      })
      .catch((error) => {
        Alert.alert("Accepted Friends Error", "error fetching messages");
        console.log("Messge Error", error);
      });
  };

  // useFocusEffect for screen focus
  useFocusEffect(
    React.useCallback(() => {
      acceptedFriendsList();
    }, [])
  );

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{ flex: 1, backgroundColor: Appcolor.white }}
    >
      <Pressable>
        {acceptedFriends.map((item, index) => (
          <UserChat key={index} item={item} />
        ))}
      </Pressable>
    </ScrollView>
  );
};

export default ChatsScreen;
