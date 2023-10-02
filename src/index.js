import React from "react";
import StackNavigator from "./StackNavigator";
import { UserContext } from "./UserContext";

export default function Routes() {
  return (
    <>
      <UserContext>
        <StackNavigator />
      </UserContext>
    </>
  );
}
