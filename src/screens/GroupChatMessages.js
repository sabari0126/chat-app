import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  KeyboardAvoidingView,
  TextInput,
  Pressable,
  Image,
} from "react-native";
import React, {
  useState,
  useContext,
  useLayoutEffect,
  useEffect,
  useRef,
} from "react";
import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import EmojiSelector from "react-native-emoji-selector";
import { UserType } from "../UserContext";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import RandomColors from "../RandomColors";

const GroupChatMessages = ({ route }) => {
  const [groupInfo, setGroupInfo] = useState(route.params?.groupInfo);
  const [showEmojiSelector, setShowEmojiSelector] = useState(false);
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [messages, setMessages] = useState([]);
  const navigation = useNavigation();
  const [message, setMessage] = useState("");
  const { userId, setUserId } = useContext(UserType);
  const [members, setMembers] = useState(route.params?.groupInfo?.members);

  const scrollViewRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, []);

  const scrollToBottom = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: false });
    }
  };

  const handleContentSizeChange = () => {
    scrollToBottom();
  };

  const handleEmojiPress = () => {
    setShowEmojiSelector(!showEmojiSelector);
  };

  const fetchMessages = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/chat/groupMessages/${groupInfo._id}`
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
  }, []);

  const handleSend = async (messageType, imageUri) => {
    try {
      const formData = new FormData();
      formData.append("senderId", userId);

      //if the message type id image or a normal text
      if (messageType === "image") {
        formData.append("messageType", "image");
        formData.append("imageFile", {
          uri: imageUri,
          name: "image.jpg",
          type: "image/jpeg",
        });
      } else {
        formData.append("messageType", "text");
        formData.append("messageText", message);
      }

      const response = await fetch(
        `http://localhost:8000/api/v1/chat/groupMessages/${groupInfo._id}`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        setMessage("");
        fetchMessages();
        setShowEmojiSelector(false);
      }
    } catch (error) {
      console.log("error in sending the message", error);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerLeft: () => (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Ionicons
            onPress={() => navigation.goBack()}
            name="arrow-back"
            size={24}
            color="black"
          />

          {selectedMessages.length > 0 ? (
            <View>
              <Text style={{ fontSize: 16, fontWeight: "500" }}>
                {selectedMessages.length}
              </Text>
            </View>
          ) : (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View
                style={{
                  ...styles.avatarIcon,
                  backgroundColor:
                    RandomColors[(Math.random() * RandomColors.length) | 0],
                }}
              >
                <MaterialIcons name="groups" size={24} color="black" />
              </View>

              <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                {groupInfo?.name}
              </Text>
            </View>
          )}
        </View>
      ),
      headerRight: () =>
        selectedMessages.length > 0 ? (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <MaterialIcons
              onPress={() => deleteMessages(selectedMessages)}
              name="delete"
              size={24}
              color="black"
            />
          </View>
        ) : null,
    });
  }, [selectedMessages]);

  const deleteMessages = async (messageIds) => {
    try {
      const response = await fetch(
        "http://localhost:8000/api/v1/chat/groups/messages",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ messageIds, groupId: groupInfo._id }),
        }
      );

      if (response.ok) {
        setSelectedMessages((prevSelectedMessages) =>
          prevSelectedMessages.filter((id) => !messageIds.includes(id))
        );

        fetchMessages();
      } else {
        console.log("error deleting messages", response.status);
      }
    } catch (error) {
      console.log("error deleting messages", error);
    }
  };

  const formatTime = (time) => {
    const options = { hour: "numeric", minute: "numeric" };
    return new Date(time).toLocaleString("en-US", options);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      handleSend("image", result?.assets[0]?.uri);
    }
  };

  const handleSelectMessage = (message) => {
    //check if the message is already selected
    const isSelected = selectedMessages.includes(message._id);

    if (isSelected) {
      setSelectedMessages((previousMessages) =>
        previousMessages.filter((id) => id !== message._id)
      );
    } else {
      setSelectedMessages((previousMessages) => [
        ...previousMessages,
        message._id,
      ]);
    }
  };

  const findUserName = (id) => {
    const index = members.findIndex((e) => e._id === id);
    let value = "";
    if (index >= 0) {
      return members[index].name;
    }
    return value;
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: "#F0F0F0" }}>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={{ flexGrow: 1 }}
        onContentSizeChange={handleContentSizeChange}
      >
        {messages.length > 0 &&
          messages.map((item, index) => {
            if (item.messageType === "text") {
              const isSelected = selectedMessages.includes(item._id);
              return (
                <Pressable
                  onLongPress={() => handleSelectMessage(item)}
                  key={index}
                  style={[
                    item?.senderId === userId
                      ? {
                          alignSelf: "flex-end",
                          backgroundColor: "#DCF8C6",
                          padding: 8,
                          maxWidth: "60%",
                          borderRadius: 7,
                          margin: 10,
                        }
                      : {
                          alignSelf: "flex-start",
                          backgroundColor: "white",
                          padding: 8,
                          margin: 10,
                          borderRadius: 7,
                          maxWidth: "60%",
                        },

                    isSelected && { width: "100%", backgroundColor: "#F0FFFF" },
                  ]}
                >
                  <Text
                    style={{
                      fontSize: 13,
                      textAlign: isSelected ? "right" : "left",
                      marginBottom: 5,
                      fontWeight: "bold",
                      textTransform: "capitalize",
                    }}
                  >
                    {findUserName(item.senderId)}
                  </Text>

                  <Text
                    style={{
                      fontSize: 13,
                      textAlign: isSelected ? "right" : "left",
                    }}
                  >
                    {item?.message}
                  </Text>
                  <Text
                    style={{
                      textAlign: "right",
                      fontSize: 9,
                      color: "gray",
                      marginTop: 5,
                    }}
                  >
                    {formatTime(item.timestamp)}
                  </Text>
                </Pressable>
              );
            }

            if (item.messageType === "image") {
              const baseUrl = "http://localhost:8000/" + item.imageUrl;
              return (
                <Pressable
                  key={index}
                  style={[
                    item?.senderId === userId
                      ? {
                          alignSelf: "flex-end",
                          backgroundColor: "#DCF8C6",
                          padding: 8,
                          maxWidth: "60%",
                          borderRadius: 7,
                          margin: 10,
                        }
                      : {
                          alignSelf: "flex-start",
                          backgroundColor: "white",
                          padding: 8,
                          margin: 10,
                          borderRadius: 7,
                          maxWidth: "60%",
                        },
                  ]}
                >
                  <View>
                    <Text
                      style={{
                        fontSize: 13,
                        textAlign: "right",
                        marginBottom: 5,
                        fontWeight: "bold",
                        textTransform: "capitalize",
                      }}
                    >
                      {findUserName(item.senderId)}
                    </Text>

                    <Image
                      source={{ uri: baseUrl }}
                      style={{ width: 200, height: 200, borderRadius: 7 }}
                    />
                    <Text
                      style={{
                        textAlign: "right",
                        fontSize: 9,
                        position: "absolute",
                        right: 10,
                        bottom: 7,
                        color: "white",
                        marginTop: 5,
                      }}
                    >
                      {formatTime(item.timestamp)}
                    </Text>
                  </View>
                </Pressable>
              );
            }
          })}
      </ScrollView>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 10,
          paddingVertical: 10,
          borderTopWidth: 1,
          borderTopColor: "#dddddd",
          marginBottom: showEmojiSelector ? 0 : 25,
        }}
      >
        <Entypo
          onPress={handleEmojiPress}
          style={{ marginRight: 5 }}
          name="emoji-happy"
          size={24}
          color="gray"
        />

        <TextInput
          value={message}
          onChangeText={(text) => setMessage(text)}
          style={{
            flex: 1,
            height: 40,
            borderWidth: 1,
            borderColor: "#dddddd",
            borderRadius: 20,
            paddingHorizontal: 10,
          }}
          placeholder="Type Your message..."
        />

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 7,
            marginHorizontal: 8,
          }}
        >
          <Entypo onPress={pickImage} name="camera" size={24} color="gray" />
        </View>

        <Pressable
          onPress={() => handleSend("text")}
          style={{
            backgroundColor: "#007bff",
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderRadius: 20,
          }}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>Send</Text>
        </Pressable>
      </View>

      {showEmojiSelector && (
        <EmojiSelector
          onEmojiSelected={(emoji) => {
            setMessage((prevMessage) => prevMessage + emoji);
          }}
          style={{ height: 250 }}
        />
      )}
    </KeyboardAvoidingView>
  );
};

export default GroupChatMessages;

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
});
