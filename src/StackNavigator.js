import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import HomeScreen from "./screens/HomeScreen";
import FriendsScreen from "./screens/FriendsScreen";
import ChatRoom from "./screens/ChatRoom";
import ChatMessagesScreen from "./screens/ChatMessagesScreen";
import CreateGroup from "./screens/NewGroups";
import GroupChatMessages from "./screens/GroupChatMessages";

const StackNavigator = () => {
  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Home" component={HomeScreen} />

        <Stack.Screen name="Friends" component={FriendsScreen} />

        <Stack.Screen
          name="ChatRoom"
          component={ChatRoom}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="CreateGroup"
          component={CreateGroup}
          options={{ headerTitle: "New Group" }}
        />

        <Stack.Screen name="Messages" component={ChatMessagesScreen} />
        <Stack.Screen name="GroupMessages" component={GroupChatMessages} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigator;
