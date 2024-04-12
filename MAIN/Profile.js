import { useEffect, useState } from "react";
import {
  AsyncImage,
  Grid,
  MenuBar,
  OptionsView,
  ProgressCircle,
  SafeArea,
  SegmentedPickerTwo,
  SeparatedView,
  SideBySide,
  Spacer,
  TextPill,
  TextView,
  auth_SignOut,
  firebase_GetAllDocuments,
  firebase_GetDocument,
  formatDate,
  getInDevice,
  layout,
  setInDevice,
  width,
} from "../EVERYTHING/BAGEL/Things";
import { Alert, ScrollView, TouchableOpacity, View } from "react-native";
import { TopSix } from "../SCREEN_COMPONENTS/Top";

export function Profile({ navigation, route }) {
  const [loading, setLoading] = useState(false);
  const [fakeLoading, setFakeLoading] = useState(false);
  const [theme, setTheme] = useState("");
  const [me, setMe] = useState({});
  const [showOptions, setShowOptions] = useState(false);
  const [maxPoints, setMaxPoints] = useState(0);
  const [section, setSection] = useState("Favorites");
  const [favorites, setFavorites] = useState([]);
  const [redeemed, setRedeemed] = useState([]);

  useEffect(() => {
    getInDevice("theme", setTheme);
    getInDevice("user", (person) => {
      setMe(person);
      //   REDEEMED
      firebase_GetAllDocuments(
        setLoading,
        "Redeemed",
        setRedeemed,
        0,
        "UserID",
        "==",
        person.id,
        false,
        null,
        null
      );
      //   FAVORITES
      firebase_GetAllDocuments(
        setLoading,
        "Favorites",
        setFavorites,
        0,
        "UserID",
        "==",
        person.id,
        false,
        null,
        null
      );
    });
    // SETTINGS
    firebase_GetDocument(setLoading, "Settings", "settings", (settings) => {
      setMaxPoints(settings.MaxPoints);
    });
  }, []);

  return (
    <SafeArea loading={loading} theme={theme}>
      {/* TOP */}
      <View style={[layout.padding_vertical, layout.relative]}>
        <TopSix
          theme={theme}
          title={"Profile"}
          caption={`${me.FirstName} ${me.LastName}`}
          icon={"ellipsis-horizontal"}
          onPress={() => {
            setShowOptions(true);
          }}
        />
      </View>

      {/* BODY */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* CIRCLE */}
        <View style={[layout.relative]}>
          <View style={[layout.center]}>
            <ProgressCircle
              theme={theme}
              progress={me.Points}
              limit={maxPoints > 0 ? maxPoints : me.Points}
              strokeWidth={10}
              width={width * 0.8}
            />
            <View
              style={[
                layout.separate_vertical,
                layout.absolute,
                { top: 0, right: 0, left: 0, bottom: 0 },
              ]}
            >
              <View></View>
              <View style={[layout.separate_horizontal]}>
                <View></View>
                <View>
                  <TextView
                    theme={theme}
                    center={true}
                    bold={true}
                    size={50}
                    color={"#117DFA"}
                  >
                    {me.Points}
                  </TextView>
                  <TextView theme={theme} center={true}>
                    Points
                  </TextView>
                  <TextView theme={theme} center={true} size={20}>
                    {maxPoints} points max
                  </TextView>
                </View>
                <View></View>
              </View>
              <View></View>
            </View>
          </View>
        </View>
        {/* SAVED ITEMS */}
        <SegmentedPickerTwo
          theme={theme}
          options={["Favorites", "Redeemed"]}
          value={section}
          setter={setSection}
        />

        {section === "Favorites" && (
          <View>
            <Spacer height={10} />
            {favorites.length === 0 && (
              <View style={[layout.padding]}>
                <TextView theme={theme}>No saved items yet.</TextView>
              </View>
            )}
            {/* FAVORITES */}
            <Grid columns={2} gap={6}>
              {favorites.map((fave, i) => {
                return (
                  <TouchableOpacity
                    key={i}
                    style={[layout.relative]}
                    onPress={() => {
                      navigation.navigate("item", { item: fave.Item });
                    }}
                  >
                    <AsyncImage
                      path={fave.Item.ImagePath}
                      width={"100%"}
                      height={width * 0.5}
                      radius={0}
                    />
                    <View
                      style={[
                        layout.absolute,
                        { bottom: 4, right: 4, left: 5 },
                      ]}
                    >
                      <TextPill text={fave.Item.Name} theme={theme} />
                    </View>
                  </TouchableOpacity>
                );
              })}
            </Grid>
          </View>
        )}
        {section === "Redeemed" && (
          <View>
            <Spacer height={10} />
            {redeemed.length === 0 && (
              <View style={[layout.padding]}>
                <TextView theme={theme}>No redemmed rewards yet.</TextView>
              </View>
            )}
            {/* REDEEMED */}
            {redeemed.map((red, i) => {
              return (
                <View key={i} style={[layout.padding, layout.horizontal]}>
                  <AsyncImage
                    radius={100}
                    path={red.RedeemedItem.ImagePath}
                    width={80}
                    height={80}
                  />
                  <View style={[{ flex: 1 }]}>
                    <TextView theme={theme} size={18}>
                      {red.RedeemedItem.Name}
                    </TextView>
                    <TextView theme={theme} size={14}>
                      {red.Points} Points
                    </TextView>
                  </View>
                  <TextView theme={theme}>
                    {formatDate(new Date(red.Date.seconds * 1000))}
                  </TextView>
                </View>
              );
            })}
          </View>
        )}
        <Spacer height={60} />
      </ScrollView>

      {/*  */}
      <MenuBar
        theme={theme}
        options={[
          { Icon: "cafe", Route: "menu" },
          { Icon: "reader", Route: "orders" },
          { Icon: "notifications", Route: "updates" },
          { Icon: "person", Route: "profile" },
          { Icon: "cart", Route: "cart" },
        ]}
        navigation={navigation}
        route={route}
        iconSize={24}
      />

      {showOptions && (
        <OptionsView
          theme={theme}
          setToggle={setShowOptions}
          options={[
            {
              Icon: "sunny",
              Option: "Light/Dark Theme",
              Text: "Toggle between light and dark theme.",
              Func: () => {
                getInDevice("theme", (thisTheme) => {
                  if (thisTheme === "light") {
                    setInDevice("theme", "dark");
                    setTheme("dark");
                  } else {
                    setInDevice("theme", "light");
                    setTheme("light");
                  }
                });
              },
            },
            {
              Icon: "log-out",
              Func: () => {
                Alert.alert(
                  "Sign Out",
                  "Are you sure you want to sign out of this account?",
                  [
                    { text: "Cancel", style: "cancel" },
                    {
                      text: "Sign Out",
                      style: "destructive",
                      onPress: () => {
                        auth_SignOut(setLoading, navigation, "login");
                      },
                    },
                  ]
                );
              },
              Color: "red",
              Option: "Sign Out",
            },
          ]}
        />
      )}
    </SafeArea>
  );
}
