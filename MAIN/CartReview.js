import { useEffect, useState } from "react";
import {
  AsyncImage,
  ButtonOne,
  PaymentView,
  SafeArea,
  SeparatedView,
  SideBySide,
  Spacer,
  TextIconPill,
  TextView,
  firebase_CreateDocument,
  firebase_DeleteDocument,
  firebase_GetAllDocuments,
  firebase_GetDocument,
  firebase_UpdateDocument,
  format,
  getInDevice,
  layout,
  randomString,
  reduceArray,
  secondaryThemedBackgroundColor,
  themedBackgroundColor,
  themedButtonColor,
  themedButtonTextColor,
} from "../EVERYTHING/BAGEL/Things";
import { TopOne } from "../SCREEN_COMPONENTS/Top";
import { Alert, ScrollView, View } from "react-native";

export function CartReview({ navigation, route }) {
  const { cartItems, tax } = route.params;
  const [loading, setLoading] = useState(false);
  const [fakeLoading, setFakeLoading] = useState(false);
  const [theme, setTheme] = useState("");
  const [me, setMe] = useState({});
  const [pointsPerDollar, setPointsPerDollar] = useState(0);
  const [total, setTotal] = useState(0);
  //
  const [rewards, setRewards] = useState([]);
  const [deducted, setDeducted] = useState(0);
  const [updatedCartItems, setUpdatedCartItems] = useState([]);
  const [showPayment, setShowPayment] = useState(false);
  const [maxPoints, setMaxPoints] = useState(0);

  function onPay() {
    setLoading(true);
    for (idx in updatedCartItems) {
      const item = updatedCartItems[idx];
      firebase_DeleteDocument(setFakeLoading, "updatedCartItems", item.id);
    }
    firebase_UpdateDocument(setLoading, "Users", me.id, {
      Points:
        me.Points +
          parseInt(reduceArray(updatedCartItems, "Total")) * pointsPerDollar >
        maxPoints
          ? maxPoints
          : me.Points +
            parseInt(reduceArray(updatedCartItems, "Total")) * pointsPerDollar,
    });
    firebase_CreateDocument(
      {
        UserID: me.id,
        Date: new Date(),
        Status: "Preparing",
        PickUp: "In Store",
        Arrived: false,
        Items: updatedCartItems,
        FullName: `${me.FirstName} ${me.LastName}`,
        Phone: me.Phone
      },
      "Orders",
      randomString(25)
    ).then(() => {
      navigation.navigate("orders");
    });
  }
  function onRedeemReward(cartItem) {
    const item = cartItem.Item;
    // Ask
    const reward = rewards.find((ting) => ting.Category === item.Category);

    Alert.alert(
      `Redeem ${reward.Points} Points`,
      `Are you sure you want to redeem 30 points for ONE free item from ${reward.Category}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Redeem",
          style: "default",
          onPress: () => {
            setLoading(true);
            firebase_UpdateDocument(setLoading, "Users", me.id, {
              Points: me.Points - reward.Points,
            });
            me.Points -= reward.Points;
            //
            firebase_CreateDocument(
              {
                UserID: me.id,
                RedeemedItem: cartItem.Item,
                Amount: cartItem.Item.Price,
                Points: reward.Points,
                Date: new Date(),
              },
              "Redeemed",
              randomString(25)
            );
            //
            // remove from total
            setDeducted((prev) => prev + item.Price);
            setUpdatedCartItems((prev) => {
              return prev.map((item) => {
                if (item.id === cartItem.id) {
                  return {
                    ...item,
                    RedeemedCount: item.RedeemedCount + 1,
                  };
                }
                return item;
              });
            });
          },
        },
      ]
    );
    // Redeem
    // Subtract from total
    // Add a conditional that checks how many drinks can be redeemed either by count or amount
  }

  useEffect(() => {
    getInDevice("theme", setTheme);
    getInDevice("user", (person) => {
      setMe(person);
      // REWARDS
      firebase_GetAllDocuments(
        setLoading,
        "Rewards",
        setRewards,
        0,
        "",
        "",
        "",
        false,
        null,
        null
      );
      firebase_GetDocument(setLoading, "Settings", "settings", (settings) => {
        setPointsPerDollar(settings.PointsPerDollar);
        setMaxPoints(settings.MaxPoints)
      });
      setUpdatedCartItems((prev) => {
        return cartItems.map((item) => ({
          ...item,
          RedeemedCount: 0,
        }));
      });
      setTotal((prev) => reduceArray(cartItems, "Total"));
    });
  }, []);

  return (
    <SafeArea loading={loading} theme={theme}>
      <TopOne
        theme={theme}
        onPress={() => {
          navigation.navigate("cart");
        }}
      />
      {/*  */}
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[layout.padding_horizontal]}>
          <SeparatedView>
            <TextView theme={theme} size={20}>
              Review before purchasing
            </TextView>
            <TextView theme={theme} size={16} color={"#117DFA"}>
              Points: {me.Points}
            </TextView>
          </SeparatedView>
        </View>
        <Spacer height={10} />
        <View style={[{ gap: 4 }]}>
          {updatedCartItems.map((item, i) => {
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
                      radius={6}
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
                        ${item.Item.Price.toFixed(2)} ea
                      </TextView>}
                      <TextView theme={theme} size={16}>
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
                {item.Details !== "" && (
                  <View>
                    <Spacer height={10} />
                    <TextView theme={theme}>
                      {item.Details.replaceAll("jjj", "\n")}
                    </TextView>
                  </View>
                )}
                <SeparatedView>
                  <View></View>
                  {rewards.some(
                    (ting) => ting.Category === item.Item.Category
                  ) &&
                    rewards.find((obj) => obj.Category === item.Item.Category)
                      .Points <= me.Points &&
                    item.RedeemedCount < item.Quantity && item.Discounted === 0 &&
                    !showPayment && (
                      <View style={[layout.fit_width]}>
                        <ButtonOne
                          backgroundColor={"#117DFA"}
                          padding={8}
                          radius={100}
                          onPress={() => {
                            onRedeemReward(item);
                          }}
                        >
                          <View style={[layout.padding_horizontal]}>
                            <TextView theme={theme} color={"white"}>
                              Redeem Reward
                            </TextView>
                          </View>
                        </ButtonOne>
                      </View>
                    )}
                </SeparatedView>
              </View>
            );
          })}
        </View>
      </ScrollView>
      <View style={[layout.padding_horizontal]}>
        <SeparatedView>
          <TextView theme={theme}>Subtotal:</TextView>
          <TextView theme={theme}>${(total - deducted).toFixed(2)}</TextView>
        </SeparatedView>
        <SeparatedView>
          <TextView theme={theme}>Tax:</TextView>
          <TextView theme={theme}>
            ${((total - deducted) * tax * 0.01).toFixed(2)}
          </TextView>
        </SeparatedView>
        <SeparatedView>
          <TextView theme={theme} size={22} bold={true}>
            Total:
          </TextView>
          <TextView theme={theme} size={22} bold={true}>
            ${(total - deducted + (total - deducted) * tax * 0.01).toFixed(2)}
          </TextView>
        </SeparatedView>

        <Spacer height={10} />
        {showPayment ? (
          <PaymentView
            theme={theme}
            total={(
              (total - deducted + (total - deducted) * tax * 0.01) *
              100
            ).toFixed(0)}
            successFunc={onPay}
          >
            <View
              style={[
                { backgroundColor: "#117DFA" },
                layout.padding,
                format.radius_full,
              ]}
            >
              <TextView theme={theme} color={"white"} size={18} center={true}>
                Pay Now to Submit Order
              </TextView>
            </View>
          </PaymentView>
        ) : (
          <View>
            <ButtonOne
              backgroundColor={themedButtonColor(theme)}
              onPress={() => {
                setShowPayment(true);
              }}
            >
              <TextView theme={theme} color={themedButtonTextColor(theme)} center={true} size={16}>
                Confirm Order
              </TextView>
            </ButtonOne>
          </View>
        )}
      </View>
    </SafeArea>
  );
}
