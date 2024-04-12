import { useEffect, useState } from "react";
import {
  SafeArea,
  auth_IsUserSignedIn,
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
