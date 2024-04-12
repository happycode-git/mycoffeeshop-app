import { useEffect, useState } from "react";
import {
  AsyncImage,
  Divider,
  Grid,
  MenuBar,
  SafeArea,
  SegmentedPicker,
  SeparatedView,
  SideBySide,
  Spacer,
  TextPill,
  TextView,
  backgrounds,
  compareDates,
  firebase_GetAllDocumentsListenerOrdered,
  firebase_GetAllDocumentsOrdered,
  firebase_GetDocument,
  format,
  getInDevice,
  layout,
  removeDuplicates,
  removeDuplicatesByProperty,
  secondaryThemedBackgroundColor,
  secondaryThemedTextColor,
  themedButtonColor,
  themedButtonTextColor,
  width,
} from "../EVERYTHING/BAGEL/Things";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { TopFive, TopSix } from "../SCREEN_COMPONENTS/Top";
import { Image } from "react-native";

export function Menu({ navigation, route }) {
  const [loading, setLoading] = useState(false);
  const [fakeLoading, setFakeLoading] = useState(false);
  const [theme, setTheme] = useState("");
  const [me, setMe] = useState({});
  const [items, setItems] = useState([]);
  const [chosenCategory, setChosenCategory] = useState("All");
  const [specials, setSpecials] = useState([]);

  useEffect(() => {
    getInDevice("theme", setTheme);
    getInDevice("user", (person) => {
      setMe(person);
    });
    firebase_GetAllDocumentsListenerOrdered(
      setLoading,
      "Items",
      setItems,
      0,
      "asc",
      "Category",
      "",
      "",
      "",
      false,
      null,
      null,
      () => {},
      () => {},
      () => {}
    );
    firebase_GetAllDocumentsOrdered(
      setLoading,
      "Specials",
      (theseSpecials) => {
        for (var i = 0; i < theseSpecials.length; i += 1) {
          const spec = theseSpecials[i];
          const isGood = compareDates(
            new Date(),
            new Date(spec.StartDate.seconds * 1000)
          );
          if (isGood) {
            firebase_GetDocument(setLoading, "Items", spec.ItemID, (item) => {
              setSpecials((prev) =>
                removeDuplicatesByProperty(
                  [...prev, { ...spec, Item: item }],
                  "id"
                )
              );
            });
          }
        }
      },
      0,
      "desc",
      "StartDate",
      "EndDate",
      ">=",
      new Date(),
      false,
      null,
      null
    );
  }, []);

  return (
    <SafeArea loading={loading} theme={theme}>
      <View style={[layout.padding_vertical, layout.relative]}>
        <TopFive theme={theme} title={"Menu"} caption={"Made fresh daily."} />
        <View style={[layout.absolute, { top: 12, right: 0, left: 0 }]}>
          <View style={[layout.center]}>
            <Image
              source={require("../assets/logo.png")}
              style={[{ width: 40, height: 40, borderRadius: 8 }]}
            />
          </View>
        </View>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* SPECIALS */}
        {specials.length > 0 && (
          <View style={[layout.padding]}>
            <ScrollView showsHorizontalScrollIndicator={true} horizontal>
              <View>
                {specials.map((special, i) => {
                  return (
                    <TouchableOpacity
                      key={i}
                      style={[
                        layout.padding,
                        {
                          backgroundColor:
                            secondaryThemedBackgroundColor(theme),
                        },
                        format.radius,
                        layout.horizontal,
                      ]}
                      onPress={() => {
                        navigation.navigate("item", {item: special.Item, percentage: special.Percentage})
                      }}
                    >
                      <AsyncImage
                        path={special.Item.ImagePath}
                        width={50}
                        height={50}
                        radius={100}
                      />
                      <View>
                        <TextView theme={theme} size={22}>
                          {special.Percentage}% OFF
                        </TextView>
                        <TextView theme={theme} size={18}>
                          {special.Item.Name}
                        </TextView>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>
          </View>
        )}
        {/* FEATURED */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={[layout.horizontal, layout.padding_horizontal]}>
            {items
              .filter((ting) => ting.Featured)
              .map((item, i) => {
                return (
                  <TouchableOpacity
                    key={i}
                    style={[layout.relative]}
                    onPress={() => {
                      navigation.navigate("item", { item });
                    }}
                  >
                    <AsyncImage
                      path={
                        item.ImagePath !== undefined
                          ? item.ImagePath
                          : "coffee.jpg"
                      }
                      width={width * 0.6}
                      height={width * 0.6}
                    />
                    <View
                      style={[
                        layout.absolute,
                        { bottom: 6, left: 6, right: 6 },
                      ]}
                    >
                      <TextPill
                        theme={theme}
                        text={item.Name}
                        paddingV={5}
                        textSize={14}
                      />
                    </View>
                  </TouchableOpacity>
                );
              })}
          </View>
          <Divider theme={theme} marginV={10} />
        </ScrollView>
        <View
          style={[
            {
              borderTopColor:
                theme === "light" ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)",
              borderTopWidth: 1,
              marginVertical: 20,
            },
          ]}
        ></View>
        {/* CATEGORIES */}
        <View style={[layout.padding_horizontal]}>
          <SegmentedPicker
            theme={theme}
            options={[
              "All",
              ...removeDuplicates(
                items.map((ting) => {
                  return ting.Category;
                })
              ),
            ]}
            value={chosenCategory}
            setter={setChosenCategory}
            selectedBackgroundColor={themedButtonColor(theme)}
            selectedTextColor={themedButtonTextColor(theme)}
          />
        </View>
        {/* MENU ITEMS */}
        <Spacer height={10} />
        <View
          style={[layout.padding_horizontal, layout.relative, layout.vertical]}
        >
          {items
            .filter(
              (ting) =>
                ting.Category === chosenCategory || chosenCategory === "All"
            )
            .map((item, i) => {
              return (
                <TouchableOpacity
                  key={i}
                  onPress={() => {
                    navigation.navigate("item", { item });
                  }}
                >
                  <View style={[layout.horizontal]}>
                    <AsyncImage
                      radius={6}
                      path={item.ImagePath}
                      width={70}
                      height={70}
                    />
                    <View style={[layout.padding_vertical_small]}>
                      <TextView theme={theme} size={18} bold={true}>
                        {item.Name}
                      </TextView>
                      <TextView theme={theme} size={14}>
                        ${item.Price.toFixed(2)}
                      </TextView>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
        </View>

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
    </SafeArea>
  );
}
