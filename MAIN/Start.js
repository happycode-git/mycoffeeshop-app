import { useEffect, useState } from "react";
import {
  SafeArea,
  auth_IsUserSignedIn,
  function_NotificationsSetup,
  getInDevice,
  setInDevice,
} from "../EVERYTHING/BAGEL/Things";
import { View } from "react-native";
import { GetStarted } from "../SCREENS/GetStarted";

export function Start({ navigation, route }) {
  const [loading, setLoading] = useState(false);
  const [fakeLoading, setFakeLoading] = useState(false);
  const [theme, setTheme] = useState("");

  useEffect(() => {
    getInDevice("theme", setTheme);
    
    auth_IsUserSignedIn(
      setLoading,
      navigation,
      "menu",
      "start",
      null,
      (user) => {
        setInDevice("user", user);
        function_NotificationsSetup(user.id)
      }
    );
  }, []);

  return (
    <SafeArea loading={loading} theme={theme}>
      <GetStarted
        theme={theme}
        onPress={() => {
          navigation.navigate("login");
        }}
      />
    </SafeArea>
  );
}
