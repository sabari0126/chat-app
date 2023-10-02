import { Text, View } from "react-native";
import React, { useEffect, useContext, useState } from "react";
import axios from "axios";
import { UserType } from "../UserContext";
import FriendRequest from "../components/FriendRequest";

const FriendsScreen = () => {
  const { userId, setUserId } = useContext(UserType);
  const [friendRequests, setFriendRequests] = useState([]);
  useEffect(() => {
    fetchFriendRequests();
  }, []);

  const fetchFriendRequests = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/v1/chat/friend-request/${userId}`
      );
      if (response.status === 200) {
        const friendRequestsData = response.data.map((friendRequest) => ({
          _id: friendRequest._id,
          name: friendRequest.name,
          email: friendRequest.email,
          image: friendRequest.image,
        }));

        setFriendRequests(friendRequestsData);
      }
    } catch (err) {
      console.log("error message", err);
    }
  };

  return (
    <View style={{ padding: 10, marginHorizontal: 12 }}>
      {friendRequests.length > 0 ? (
        <View>
          {friendRequests.map((item, index) => (
            <FriendRequest
              key={index}
              item={item}
              friendRequests={friendRequests}
              setFriendRequests={setFriendRequests}
            />
          ))}
        </View>
      ) : (
        <Text>You have 0 Friend Requests!</Text>
      )}
    </View>
  );
};

export default FriendsScreen;
