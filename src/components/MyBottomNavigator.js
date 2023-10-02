import React from "react";
import { StyleSheet, Text, View, Platform } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AppColor from "../Appcolor";
import ChatsScreen from "../screens/ChatsScreen";
import GroupChats from "../screens/GroupChats";
import { FontAwesome } from "@expo/vector-icons";

const Bottomtab = createBottomTabNavigator();

export default function MyBottomNavigator(props) {
  const tabs = [
    {
      route: "Chats",
      label: "Chats",
      component: ChatsScreen,
    },
    {
      route: "Groups",
      label: "Groups",
      component: GroupChats,
    },
  ];

  return (
    <Bottomtab.Navigator
      screenOptions={{
        tabBarStyle: {
          height: Platform.OS === "android" ? 80 : 100,
        },
        tabBarIconStyle: { display: "none" },
      }}
    >
      {tabs.map((item, index) => {
        return (
          <Bottomtab.Screen
            key={index}
            name={item.route}
            children={() => <item.component />}
            listeners={({ navigation, route }) => ({
              tabPress: (e) => {},
            })}
            options={{
              tabBarLabel: (tabInfo) => {
                return tabInfo.focused ? (
                  <View style={styles.activeTabBackground}>
                    {item.label === "Chats" ? (
                      <FontAwesome name="user" size={24} color="black" />
                    ) : (
                      <FontAwesome name="users" size={24} color="black" />
                    )}
                    <Text style={styles.activeTabText}>{item.label}</Text>
                  </View>
                ) : (
                  <View style={styles.inactiveTabBackground}>
                    {item.label === "Chats" ? (
                      <FontAwesome name="user" size={24} color="black" />
                    ) : (
                      <FontAwesome name="users" size={24} color="black" />
                    )}
                    <Text style={styles.inactiveTabText}>{item.label}</Text>
                  </View>
                );
              },
              headerShown: true,
              unmountOnBlur: true,
            }}
          />
        );
      })}
    </Bottomtab.Navigator>
  );
}

const styles = StyleSheet.create({
  activeTabBackground: {
    width: "100%",
    height: "100%",
    borderTopWidth: 2,
    borderTopColor: AppColor.active_dots,
    alignItems: "center",
    justifyContent: "center",
  },
  inactiveTabBackground: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  activeTabText: {
    fontSize: 12,
    color: AppColor.primary_blue,
  },
  inactiveTabText: {
    fontSize: 12,
    color: AppColor.grey_medium,
  },
  activeImage: {
    tintColor: AppColor.dark_black,
    marginBottom: 10,
  },
  inactiveImage: {
    tintColor: AppColor.grey_medium,
    marginBottom: 10,
  },
});
