import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from "react-native";
import {
  ButtonOne,
  Grid,
  Spacer,
  TextFieldOne,
  TextView,
  auth_CreateUser,
  firebase_GetAllDocuments,
  format,
  layout,
  themedBackgroundColor,
  themedButtonColor,
  themedButtonTextColor,
} from "../EVERYTHING/BAGEL/Things";
import { useState } from "react";

export function SignUpScreen({ navigation, setLoading, redirect, theme }) {
  const [fakeLoading, setFakeLoading] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConf, setPasswordConf] = useState("");

  function onSignUp() {
    setLoading(true)
    firebase_GetAllDocuments(
      setLoading,
      "Users",
      (users) => {
        if (users.length > 0) {
          Alert.alert(
            "Email already in use",
            "Please use another email, or log in using this email."
          );
        } else {
          // SIGN UP
          const args = {
            FirstName: firstName,
            LastName: lastName,
            Email: email,
            Phone: phone,
            // OTHER PROPERTIES
          };
          auth_CreateUser(
            setLoading,
            email,
            password,
            args,
            navigation,
            null,
            redirect,
            (userID) => {
              // IM CASE IT IS NEEDED
              console.log(userID);
            }
          );
        }
      },
      0,
      "Email",
      "==",
      email,
      false,
      null,
      null
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <View
        style={[
          { flex: 1 },
          layout.separate_vertical,
          layout.padding,
          { backgroundColor: themedBackgroundColor(theme) },
        ]}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <View>
            <TextView theme={theme} size={24}>
              Sign Up
            </TextView>
            <TextView theme={theme}>Join us!</TextView>
            <Spacer height={15} />
            {/* FORM */}
            <View style={[layout.vertical]}>
              {/* NAME */}
              <Grid columns={2} gap={10}>
                <View>
                  <TextView theme={theme} size={13}>
                    First Name
                  </TextView>
                  <Spacer height={4} />
                  <TextFieldOne
                    placeholder={"ex. John"}
                    value={firstName}
                    setter={setFirstName}
                    theme={theme}
                  />
                </View>
                <View>
                  <TextView theme={theme} size={13}>
                    Last Name
                  </TextView>
                  <Spacer height={4} />
                  <TextFieldOne
                    placeholder={"ex. Doe"}
                    value={lastName}
                    setter={setLastName}
                    theme={theme}
                  />
                </View>
              </Grid>
              {/* DISPLAY NAME */}
              <View>
                <TextView theme={theme} size={13}>
                  Phone
                </TextView>
                <Spacer height={4} />
                <TextFieldOne
                  placeholder={"ex. (123)456-7890"}
                  value={phone}
                  setter={setPhone}
                  theme={theme}
                />
              </View>
              {/* EMAIL */}
              <View>
                <TextView theme={theme} size={13}>
                  Email
                </TextView>
                <Spacer height={4} />
                <TextFieldOne
                  placeholder={"ex. bagel@happycodewebsites.com"}
                  value={email}
                  setter={setEmail}
                  theme={theme}
                />
              </View>
              {/* PASSWORD */}
              <View>
                <TextView theme={theme} size={13}>
                  Password
                </TextView>
                <Spacer height={4} />
                <TextFieldOne
                  placeholder={"must be 8+ chars"}
                  value={password}
                  setter={setPassword}
                  isPassword={true}
                  theme={theme}
                />
                {password !== "" && password.length < 8 && (
                  <View>
                    <Spacer height={2} />
                    <TextView theme={theme} size={12} color={"orange"}>
                      Password must be at least 8 characters long.
                    </TextView>
                  </View>
                )}
              </View>
              {/* CONFIRM PASSWORD */}
              <View>
                <TextView theme={theme} size={13}>
                  Confirm Password
                </TextView>
                <Spacer height={4} />
                <TextFieldOne
                  placeholder={"passwords must match"}
                  value={passwordConf}
                  setter={setPasswordConf}
                  isPassword={true}
                  theme={theme}
                />
                {password !== "" &&
                  password.length >= 8 &&
                  passwordConf !== "" &&
                  passwordConf !== password && (
                    <View>
                      <Spacer height={2} />
                      <TextView theme={theme} size={12} color={"#63EB91"}>
                        Passwords do not match
                      </TextView>
                    </View>
                  )}
                {password !== "" &&
                  password.length >= 8 &&
                  passwordConf !== "" &&
                  passwordConf === password && (
                    <View>
                      <Spacer height={2} />
                      <TextView theme={theme} size={12} color={"green"}>
                        Passwords match!
                      </TextView>
                    </View>
                  )}
              </View>
            </View>
          </View>
          <Spacer height={30} />
        </ScrollView>
        {/* BUTTON */}
        <View>
          {firstName !== "" &&
            lastName !== "" &&
            email !== "" &&
            phone !== "" &&
            password.length >= 8 &&
            password === passwordConf && (
              <ButtonOne
                backgroundColor={themedButtonColor(theme)}
                radius={100}
                onPress={onSignUp}
              >
                <TextView
                  theme={theme}
                  color={themedButtonTextColor(theme)}
                  size={16}
                  styles={[format.center_text]}
                >
                  Sign Up
                </TextView>
              </ButtonOne>
            )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
