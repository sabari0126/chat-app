import { StyleSheet, Text, View } from "react-native";
import React, { useLayoutEffect, useContext, useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { UserType } from "../UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwt_decode from "jwt-decode";
import axios from "axios";
import User from "../components/User";
import { CommonActions } from "@react-navigation/native";
import Appcolor from "../Appcolor";

const HomeScreen = () => {
  const navigation = useNavigation();
  const { userId, setUserId } = useContext(UserType);
  const [users, setUsers] = useState([]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerLeft: () => (
        <Text style={{ fontSize: 16, fontWeight: "bold" }}>Users</Text>
      ),
      headerRight: () => (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Ionicons
            onPress={() => navigation.navigate("ChatRoom")}
            name="chatbox-ellipses-outline"
            size={24}
            color="black"
          />
          <MaterialIcons
            style={{ marginLeft: 10 }}
            onPress={() => navigation.navigate("Friends")}
            name="people-outline"
            size={24}
            color="black"
          />
          <MaterialCommunityIcons
            onPress={clearAsyncStorage}
            style={{ marginLeft: 10 }}
            name="logout"
            size={24}
            color="black"
          />
        </View>
      ),
    });
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      const token = await AsyncStorage.getItem("authToken");
      const decodedToken = jwt_decode(token);
      const userId = decodedToken.userId;
      setUserId(userId);

      axios
        .get(`http://localhost:8000/api/v1/chat/users/${userId}`)
        .then((response) => {
          setUsers(response.data);
        })
        .catch((error) => {
          console.log("error retrieving users", error);
        });
    };

    fetchUsers();
  }, []);

  const clearAsyncStorage = async () => {
    try {
      await AsyncStorage.clear();

      // Reset the navigation stack to the Login screen
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "Login" }],
        })
      );
    } catch (e) {
      console.error("Error clearing AsyncStorage: ", e);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: Appcolor.white }}>
      <View style={{ padding: 10 }}>
        {users.map((item, index) => (
          <View
            key={index}
            style={{
              borderBottomWidth: 1,
              borderBottomColor: Appcolor.disable_grey,
            }}
          >
            <User key={index} item={item} />
          </View>
        ))}
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
