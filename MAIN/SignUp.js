import { useEffect, useState } from "react";
import {
  ButtonOne,
  SafeArea,
  SeparatedView,
  TextIconPill,
  getInDevice,
  layout,
} from "../EVERYTHING/BAGEL/Things";
import { View } from "react-native";
import { SignUpScreen } from "../SCREENS/SignUpScreen";

export function SignUp({ navigation, route }) {
  const [loading, setLoading] = useState(false);
  const [fakeLoading, setFakeLoading] = useState(false);
  const [theme, setTheme] = useState("");

  useEffect(() => {
    getInDevice("theme", setTheme);
  }, []);

  return (
    <SafeArea theme={theme} loading={loading}>
      <View style={[layout.padding]}>
        <ButtonOne
          backgroundColor={"transparent"}
          padding={0}
          radius={0}
          onPress={() => {
            navigation.navigate("login");
          }}
        >
          <TextIconPill
          theme={theme}
            text={"log in"}
            icon={"chevron-back-outline"}
            textSize={18}
            iconSize={20}
          />
        </ButtonOne>
      </View>
      <SignUpScreen
        theme={theme}
        redirect={"menu"}
        setLoading={setLoading}
        navigation={navigation}
      />
    </SafeArea>
  );
}
