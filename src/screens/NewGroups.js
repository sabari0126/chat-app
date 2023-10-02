import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  FlatList,
  Pressable,
  Image,
  TouchableOpacity,
} from "react-native";
import Checkbox from "expo-checkbox";
import Appcolor from "../Appcolor";
import { MaterialIcons } from "@expo/vector-icons";
import { UserType } from "../UserContext";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

export default function CreateGroup() {
  const navigation = useNavigation();
  const { userId, setUserId } = useContext(UserType);
  const [groupName, setGroupName] = useState("");

  const [users, setUsers] = useState("");
  const [selectedValues, setSelectedValues] = useState([userId]);

  useEffect(() => {
    const acceptedFriendsList = async () => {
      axios
        .get(`http://localhost:8000/api/v1/chat/accepted-friends/${userId}`)
        .then((response) => {
          const data = response.data;
          data.map((item) => {
            item.isSelected = false;
            return item;
          });
          setUsers(data);
        })
        .catch((error) => {
          Alert.alert("Accepted Friends Error", "error fetching messages");
          console.log("Messge Error", error);
        });
    };
    acceptedFriendsList();
  }, []);

  const createGroup = async () => {
    if (!groupName) {
      Alert.alert("Group Name", "Enter Valid Group Name");
      return;
    }
    if (selectedValues.length == 0) {
      Alert.alert("Select User", "Please select atleast one user in the list");
      return;
    }

    const data = {
      groupName,
      memberIds: selectedValues,
    };

    axios
      .post(`http://localhost:8000/api/v1/chat/groups`, data)
      .then((response) => {
        setGroupName("");
        setSelectedValues([]);
        navigation.goBack();
      })
      .catch((error) => {
        Alert.alert("Accepted Friends Error", "error fetching messages");
        console.log("Messge Error", error);
      });
  };

  const onItemSelect = (item, index) => {
    let updatedArr = [...users];
    let selectedItems = [...selectedValues];

    updatedArr[index] = { ...updatedArr[index], isSelected: !item.isSelected };

    const findIndex = selectedItems.indexOf(item._id);

    if (item.isSelected && findIndex !== -1) {
      selectedItems.splice(findIndex, 1);
    } else if (!item.isSelected) {
      selectedItems.push(item._id);
    }
    setUsers(updatedArr);
    setSelectedValues(selectedItems);
  };

  const renderItem = ({ item, index }) => {
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginVertical: 15,
        }}
      >
        <Checkbox
          value={item.isSelected}
          onValueChange={() => {
            onItemSelect(item, index);
          }}
        />
        <Pressable
          style={{ flexDirection: "row", marginLeft: 15 }}
          onPress={() => {
            onItemSelect(item, index);
          }}
        >
          <Image
            style={{
              width: 50,
              height: 50,
              borderRadius: 25,
              resizeMode: "cover",
            }}
            source={{ uri: item.image }}
          />
          <View style={{ marginLeft: 12 }}>
            <Text style={{ fontWeight: "bold" }}>{item?.name}</Text>
            <Text style={{ marginTop: 4, color: "gray" }}>{item?.email}</Text>
          </View>
        </Pressable>
      </View>
    );
  };

  return (
    <View style={{ ...styles.mainContainer }}>
      <View style={{ ...styles.mainContainer, padding: 15 }}>
        <Text style={{ fontWeight: "bold", fontSize: 15 }}>Group Details</Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 10,
          }}
        >
          <MaterialIcons name="groups" size={24} color="black" />
          <TextInput
            style={styles.input}
            placeholder="Enter group name"
            autoCapitalize="none"
            autoFocus={true}
            value={groupName}
            onChangeText={(text) => setGroupName(text)}
          />
        </View>
        <Text style={{ fontWeight: "bold", fontSize: 15, marginTop: 20 }}>
          Select Group Members
        </Text>
        {users.length > 0 && (
          <FlatList
            data={users}
            renderItem={renderItem}
            keyExtractor={(item, index) => `${index + 1}`}
          />
        )}
      </View>
      <TouchableOpacity
        style={{
          ...styles.bottomView,
        }}
        onPress={() => {
          createGroup();
        }}
      >
        <Text
          style={{ fontSize: 15, color: Appcolor.white, fontWeight: "bold" }}
        >
          Add Group
        </Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Appcolor.white,
  },
  input: {
    width: "80%",
    fontSize: 16,
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: Appcolor.disable_grey,
    marginLeft: 10,
  },
  bottomView: {
    width: "90%",
    backgroundColor: Appcolor.primary_blue,
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 20,
  },
});
