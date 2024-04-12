import { useEffect, useState } from "react";
import {
  AsyncImage,
  ButtonOne,
  IconButtonTwo,
  LinkOne,
  MenuBar,
  SafeArea,
  SeparatedView,
  SideBySide,
  Spacer,
  TextIconPill,
  TextView,
  checkTime,
  convertDayOfWeek,
  convertDayOfWeekToNum,
  convertNumToDayOfWeek,
  firebase_DeleteDocument,
  firebase_GetAllDocuments,
  firebase_GetAllDocumentsListener,
  firebase_GetDocument,
  format,
  formatTime,
  getInDevice,
  layout,
  reduceArray,
  secondaryThemedBackgroundColor,
  themedBackgroundColor,
  themedButtonColor,
  themedButtonTextColor,
} from "../EVERYTHING/BAGEL/Things";
import { Alert, ScrollView, View } from "react-native";
import { TopFive } from "../SCREEN_COMPONENTS/Top";

export function Cart({ navigation, route }) {
  const [loading, setLoading] = useState(false);
  const [fakeLoading, setFakeLoading] = useState(false);
  const [theme, setTheme] = useState("");
  const [me, setMe] = useState({});
  const [cartItems, setCartItems] = useState([]);
  const [tax, setTax] = useState(0);
  const [storeClosed, setStoreClosed] = useState(false);
  //

  function onRemoveItem(item) {
    Alert.alert(
      "Remove Cart Item",
      "Are you sure you want to remove this cart item?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            setLoading(true);
            firebase_DeleteDocument(setLoading, "CartItems", item.id);
          },
        },
      ]
    );
  }

  useEffect(() => {
    getInDevice("theme", setTheme);
    getInDevice("user", (person) => {
      setMe(person);
      //   GET CART ITEMS
      firebase_GetAllDocumentsListener(
        setLoading,
        "CartItems",
        setCartItems,
        0,
        "UserID",
        "==",
        person.id,
        false,
        null,
        null,
        () => {},
        () => {},
        () => {}
      );
      firebase_GetDocument(setLoading, "Settings", "settings", (settings) => {
        setTax(settings.Tax);
      });
      // CHECK FOR SCHEDULE
      // firebase_GetAllDocuments(setLoading, "Hours", (daysOfWeek) => {
      //   const todayNum = new Date().getDay();
      //   const todayLong = convertNumToDayOfWeek(todayNum);
      //   if (daysOfWeek.some((ting) => ting.id === todayLong)) {
      //     const hours = {
      //       Start: daysOfWeek.find(
      //         (ting) => ting.id === convertNumToDayOfWeek(todayNum)
      //       ).Start,
      //       End: daysOfWeek.find(
      //         (ting) => ting.id === convertNumToDayOfWeek(todayNum)
      //       ).End,
      //     };
      //     const today = new Date();
      //     const startOfDay = new Date(hours.Start.seconds * 1000);
      //     const endOfDay = new Date(hours.End.seconds * 1000);
      //     const inShopHours = checkTime(formatTime(today), formatTime(startOfDay), formatTime(endOfDay))
      //     setStoreClosed(!inShopHours)
      //   } else {
      //     setStoreClosed(true);
      //   }
      // });
    });
  }, []);

  return (
    <SafeArea loading={loading} theme={theme}>
      {/* TOP */}
      <View
        style={[
          layout.padding_vertical,
          layout.horizontal,
          layout.padding_horizontal,
          layout.relative,
        ]}
      >
        <IconButtonTwo
          theme={theme}
          name="chevron-back-outline"
          size={24}
          padding={6}
          onPress={() => {
            navigation.navigate("menu");
          }}
        />
        <TopFive theme={theme} title={`My Cart (${cartItems.length})`} />
      </View>
      {/* BODY */}
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[layout.padding_horizontal]}>
          {cartItems.length === 0 && (
            <TextView theme={theme}>No items in your cart yet.</TextView>
          )}
        </View>
        <View style={[{ gap: 4 }]}>
          {cartItems.map((item, i) => {
            return (
              <View
                key={i}
                style={[
                  layout.padding,
                  { backgroundColor: secondaryThemedBackgroundColor(theme) },
                ]}
              >
                <View style={[layout.horizontal, { gap: 12 }]}>
                  <View>
                    <AsyncImage
                      path={item.Item.ImagePath}
                      width={80}
                      height={80}
                      radius={4}
                    />
                    <Spacer height={6} />
                    <TextIconPill
                      theme={theme}
                      icon={"cafe-outline"}
                      text={`${item.Quantity} x`}
                      paddingV={6}
                      textSize={17}
                      iconSize={23}
                      lightBackgroundColor={themedBackgroundColor(theme)}
                      darkBackgroundColor={themedBackgroundColor(theme)}
                    />
                  </View>
                  <View>
                    <TextView theme={theme} size={18}>
                      {item.Item.Name}
                    </TextView>
                    <SeparatedView>
                      <SideBySide>
                      {item.Discounted > 0 && <TextView theme={theme} size={16} styles={[format.strike]}>
                        ${(item.Item.Price).toFixed(2)} ea
                      </TextView>}
                      <TextView theme={theme} size={16} >
                        ${(item.Item.Price - (item.Item.Price * item.Discounted * 0.01)).toFixed(2)} ea
                      </TextView>
                      </SideBySide>
                    </SeparatedView>
                    <Spacer height={6} />
                    <View
                      style={[
                        layout.padding_small,
                        { borderLeftColor: "#1BA8FF", borderLeftWidth: 3 },
                      ]}
                    >
                      {item.ChosenOptions.map((opt, o) => {
                        return (
                          <View key={o}>
                            <SideBySide>
                              <TextView theme={theme}>{opt.Name} - </TextView>
                              <TextView theme={theme}>
                                {opt.OptionQuantity}x
                              </TextView>
                            </SideBySide>
                          </View>
                        );
                      })}
                    </View>
                  </View>
                </View>
                <SeparatedView>
                  <View>
                    {item.Details !== "" && (
                      <View>
                        <Spacer height={10} />
                        <TextView theme={theme}>
                          {item.Details.replaceAll("jjj", "\n")}
                        </TextView>
                      </View>
                    )}
                  </View>
                  <LinkOne
                    lightUnderlineColor={"red"}
                    darkUnderlineColor={"red"}
                    onPress={() => {
                      onRemoveItem(item);
                    }}
                  >
                    <TextView theme={theme} color={"red"}>
                      Remove
                    </TextView>
                  </LinkOne>
                </SeparatedView>
              </View>
            );
          })}
        </View>

        <Spacer height={60} />
      </ScrollView>
      {cartItems.length > 0 && (
        <View style={[layout.padding_horizontal]}>
          <SeparatedView>
            <TextView theme={theme}>Subtotal:</TextView>
            <TextView theme={theme}>
              ${reduceArray(cartItems, "Total").toFixed(2)}
            </TextView>
          </SeparatedView>
          <SeparatedView>
            <TextView theme={theme}>Tax:</TextView>
            <TextView theme={theme}>
              ${(reduceArray(cartItems, "Total") * tax * 0.01).toFixed(2)}
            </TextView>
          </SeparatedView>
          <SeparatedView>
            <TextView theme={theme} size={22} bold={true}>
              Total:
            </TextView>
            <TextView theme={theme} size={22} bold={true}>
              $
              {(
                reduceArray(cartItems, "Total") +
                reduceArray(cartItems, "Total") * tax * 0.01
              ).toFixed(2)}
            </TextView>
          </SeparatedView>

          <Spacer height={10} />
          {!storeClosed && (
            <ButtonOne
              backgroundColor={themedButtonColor(theme)}
              radius={100}
              onPress={() => {
                navigation.navigate("cart-review", { cartItems, tax });
              }}
            >
              <TextView
                theme={theme}
                color={themedButtonTextColor(theme)}
                size={16}
                center={true}
              >
                Proceed
              </TextView>
            </ButtonOne>
          )}
          {storeClosed && (
            <TextView theme={theme} center={true} size={18}>
              We apologize. The shop is currently closed.
            </TextView>
          )}
        </View>
      )}
    </SafeArea>
  );
}
