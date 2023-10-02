import { StyleSheet, Text, View, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import Appcolor from "../Appcolor";
import RandomColors from "../RandomColors";

const GroupChat = ({ item }) => {
  const navigation = useNavigation();
  const [messages, setMessages] = useState({});

  const fetchMessages = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/chat/groups/${item._id}/last-message`
      );
      const data = await response.json();
      if (response.ok) {
        setMessages(data);
      } else {
        console.log("error showing messags", response.status.message);
      }
    } catch (error) {
      console.log("error fetching messages", error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [item]);

  const formatTime = (time) => {
    const options = { hour: "numeric", minute: "numeric" };
    return new Date(time).toLocaleString("en-US", options);
  };

  return (
    <>
      <Pressable
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
        onPress={() => {
          navigation.navigate("GroupMessages", { groupInfo: item });
        }}
      >
        <View
          style={{
            ...styles.avatarIcon,
            backgroundColor:
              RandomColors[(Math.random() * RandomColors.length) | 0],
          }}
        >
          <MaterialIcons name="groups" size={24} color="black" />
        </View>
        <View>
          <Text style={{ fontSize: 15, fontWeight: "bold" }}>{item.name}</Text>
          {Object.keys(messages).length > 0 && (
            <Text style={{ marginTop: 3, color: "gray", fontWeight: "500" }}>
              {messages.messageType === "Text"
                ? messages?.lastMessage
                : "Image"}
            </Text>
          )}
        </View>
        {Object.keys(messages).length > 0 && (
          <View
            style={{
              position: "absolute",
              right: 0,
            }}
          >
            <Text style={{ fontSize: 11, fontWeight: "400", color: "#585858" }}>
              {formatTime(messages?.lastMessageTimestamp)}
            </Text>
          </View>
        )}
      </Pressable>
      <View style={{ ...styles.dividerView }} />
    </>
  );
};

export default GroupChat;

const styles = StyleSheet.create({
  avatarIcon: {
    borderRadius: 50,
    backgroundColor: "#FF9040",
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  dividerView: {
    marginVertical: 10,
    width: "100%",
    height: 1,
    backgroundColor: Appcolor.disable_grey,
  },
});
