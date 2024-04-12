import { useEffect, useState } from "react";
import {
  ButtonOne,
  SafeArea,
  SeparatedView,
  TextPill,
  getInDevice,
  layout,
} from "../EVERYTHING/BAGEL/Things";
import { View } from "react-native";
import { LoginScreen } from "../SCREENS/LoginScreen";

export function Login({ navigation, route }) {
  const [loading, setLoading] = useState(false);
  const [fakeLoading, setFakeLoading] = useState(false);
  const [theme, setTheme] = useState("");

  useEffect(() => {
    getInDevice("theme", setTheme);
  }, []);

  return (
    <SafeArea loading={loading} theme={theme}>
      {/* TOP */}
      <View style={[layout.padding]}>
        <SeparatedView>
          <View></View>
          <ButtonOne
            backgroundColor={"transparent"}
            padding={0}
            radius={0}
            onPress={() => {
              navigation.navigate("signup");
            }}
          >
            <TextPill theme={theme} text={"sign up"} textSize={18} />
          </ButtonOne>
        </SeparatedView>
      </View>
      {/* LOGIN */}
      <LoginScreen
        theme={theme}
        redirect={"menu"}
        setLoading={setLoading}
        navigation={navigation}
      />
    </SafeArea>
  );
}
