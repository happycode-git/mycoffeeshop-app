import { useEffect, useState } from "react";
import {
  Accordion,
  AsyncImage,
  ButtonOne,
  Grid,
  MenuBar,
  SafeArea,
  SegmentedPickerTwo,
  SeparatedView,
  SideBySide,
  Spacer,
  TextPill,
  TextView,
  firebase_GetAllDocumentsListenerOrdered,
  firebase_GetDocument,
  firebase_UpdateDocument,
  format,
  formatDateTime,
  getInDevice,
  layout,
  reduceArray,
  secondaryThemedBackgroundColor,
  secondaryThemedTextColor,
  themedBackgroundColor,
} from "../EVERYTHING/BAGEL/Things";
import { TopFive } from "../SCREEN_COMPONENTS/Top";
import { Alert, ScrollView, TouchableOpacity, View } from "react-native";

export function Orders({ navigation, route }) {
  const [loading, setLoading] = useState(false);
  const [fakeLoading, setFakeLoading] = useState(false);
  const [theme, setTheme] = useState("");
  const [me, setMe] = useState({});
  const [status, setStatus] = useState("Active");
  const [orders, setOrders] = useState([]);
  const [lastDoc, setlastDoc] = useState(null);
  const [tax, setTax] = useState(0);

  useEffect(() => {
    getInDevice("theme", setTheme);
    getInDevice("user", (person) => {
      setMe(person);
      firebase_GetAllDocumentsListenerOrdered(
        setLoading,
        "Orders",
        setOrders,
        100,
        "desc",
        "Date",
        "UserID",
        "==",
        me.id,
        true,
        lastDoc,
        setlastDoc,
        () => {},
        () => {},
        () => {}
      );
      firebase_GetDocument(setLoading, "Settings", "settings", (settings) => {
        setTax(settings.Tax);
      });
    });
  }, []);

  return (
    <SafeArea loading={loading} theme={theme}>
      <TopFive theme={theme} title={"My Orders"} />
      {/* BODY */}
      <View>
        <SegmentedPickerTwo
          theme={theme}
          options={["Active", "Completed"]}
          value={status}
          setter={setStatus}
        />
      </View>
      {/*  */}
      <Spacer height={10} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View>
          {status === "Active" && (
            <View style={{ gap: 5 }}>
              {orders
                .filter(
                  (ting) =>
                    ting.Status === "Preparing" || ting.Status === "Ready"
                )
                .map((order, i) => {
                  return (
                    <View
                      style={[
                        {
                          backgroundColor:
                            secondaryThemedBackgroundColor(theme),
                        },
                      ]}
                      key={i}
                    >
                      <Accordion
                        top={
                          <View style={[layout.padding]}>
                            <SeparatedView>
                              <TextView
                                theme={theme}
                                size={20}
                                bold={true}
                                styles={[format.all_caps]}
                              >
                                Order #{order.id.slice(-8)}
                              </TextView>
                              <TextView
                                theme={theme}
                                size={16}
                                color={"#117DFA"}
                              >
                                {order.Status}
                              </TextView>
                            </SeparatedView>
                            <TextView theme={theme}>
                              {formatDateTime(
                                new Date(order.Date.seconds * 1000)
                              )}
                            </TextView>
                          </View>
                        }
                      >
                        <View style={[{ gap: 6 }, layout.padding]}>
                          {order.Items.map((item, o) => {
                            return (
                              <View key={o}>
                                <View style={[layout.horizontal]}>
                                  <AsyncImage
                                    path={item.Item.ImagePath}
                                    width={80}
                                    height={80}
                                    radius={6}
                                  />
                                  <View style={[{ flex: 1 }]}>
                                    <TextView theme={theme} size={18}>
                                      {item.Item.Name}
                                    </TextView>
                                    <SeparatedView>
                                      <TextView theme={theme} size={16}>
                                        ${item.Item.Price.toFixed(2)} ea
                                      </TextView>
                                      <TextView
                                        theme={theme}
                                        size={18}
                                        bold={true}
                                      >
                                        {item.Quantity} x
                                      </TextView>
                                    </SeparatedView>
                                    <View
                                      style={[
                                        {
                                          borderLeftColor: "#1BA8FF",
                                          borderLeftWidth: 3,
                                          paddingHorizontal: 10,
                                        },
                                      ]}
                                    >
                                      {item.ChosenOptions.map((opt, j) => {
                                        return (
                                          <View key={j}>
                                            <SideBySide>
                                              <TextView theme={theme}>
                                                {opt.Name} -
                                              </TextView>
                                              <TextView theme={theme}>
                                                {opt.OptionQuantity} x
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
                                    <TextView theme={theme}>
                                      {item.Details.replaceAll("jjj", "\n")}
                                    </TextView>
                                  </View>
                                )}
                              </View>
                            );
                          })}
                          {/* PICK UP OPTIONS */}
                          {order.Status === "Preparing" && (
                            <View>
                              <TextView
                                theme={theme}
                                styles={[layout.padding_vertical_small]}
                                bold={true}
                              >
                                Pick Up Options
                              </TextView>
                              <Grid columns={2} gap={6}>
                                <ButtonOne
                                  backgroundColor={themedBackgroundColor(theme)}
                                  radius={100}
                                  onPress={() => {
                                    setLoading(true);
                                    firebase_UpdateDocument(
                                      setLoading,
                                      "Orders",
                                      order.id,
                                      {
                                        PickUp: "In Store",
                                      }
                                    ).then(() => {
                                      Alert.alert(
                                        "In Store Pick Up",
                                        "You have opted for IN STORE pick up."
                                      );
                                    });
                                  }}
                                >
                                  <TextView
                                    theme={theme}
                                    center={true}
                                    size={16}
                                  >
                                    In Store
                                  </TextView>
                                </ButtonOne>
                                <ButtonOne
                                  backgroundColor={"#117DFA"}
                                  radius={100}
                                  onPress={() => {
                                    setLoading(true);
                                    firebase_UpdateDocument(
                                      setLoading,
                                      "Orders",
                                      order.id,
                                      {
                                        PickUp: "Curbside",
                                      }
                                    ).then(() => {
                                      Alert.alert(
                                        "Pick Up",
                                        "You have opted for CURBSIDE pick up."
                                      );
                                    });
                                  }}
                                >
                                  <TextView
                                    theme={theme}
                                    center={true}
                                    size={16}
                                    color={"white"}
                                  >
                                    Curbside
                                  </TextView>
                                </ButtonOne>
                              </Grid>
                            </View>
                          )}
                          {order.Status === "Ready" && !order.Arrived && (
                            <View>
                              <ButtonOne
                                backgroundColor={"#117DFA"}
                                radius={100}
                                onPress={() => {
                                  setLoading(true);
                                  firebase_UpdateDocument(
                                    setLoading,
                                    "Orders",
                                    order.id,
                                    { Arrived: true }
                                  ).then(() => {
                                    Alert.alert(
                                      "Arrived!",
                                      "The shop has been informed of your arrival."
                                    );
                                  });
                                }}
                              >
                                <TextView
                                  theme={theme}
                                  color={"white"}
                                  center={true}
                                  size={16}
                                >
                                  I've Arrived
                                </TextView>
                              </ButtonOne>
                            </View>
                          )}
                        </View>
                      </Accordion>
                    </View>
                  );
                })}
              {orders.filter(
                (ting) => ting.Status === "Preparing" || ting.Status === "Ready"
              ).length === 0 && (
                <View style={[layout.padding_horizontal]}>
                  <TextView theme={theme}>No active orders yet.</TextView>
                </View>
              )}
            </View>
          )}
          {status === "Completed" && (
            <View>
              {orders
                .filter((ting) => ting.Status === "Completed")
                .map((order, i) => {
                  return (
                    <View
                      style={[
                        {
                          backgroundColor:
                            secondaryThemedBackgroundColor(theme),
                        },
                      ]}
                      key={i}
                    >
                      <Accordion
                        top={
                          <View style={[layout.padding]}>
                            <SeparatedView>
                              <TextView
                                theme={theme}
                                size={20}
                                bold={true}
                                styles={[format.all_caps]}
                              >
                                Order #{order.id.slice(-8)}
                              </TextView>
                              <TextView
                                theme={theme}
                                size={16}
                                color={"#117DFA"}
                              >
                                {order.Status}
                              </TextView>
                            </SeparatedView>
                            <TextView theme={theme}>
                              {formatDateTime(
                                new Date(order.Date.seconds * 1000)
                              )}
                            </TextView>
                          </View>
                        }
                      >
                        <View style={[{ gap: 6 }, layout.padding]}>
                          {order.Items.map((item, o) => {
                            return (
                              <View key={o}>
                                <View style={[layout.horizontal]}>
                                  <AsyncImage
                                    path={item.Item.ImagePath}
                                    width={80}
                                    height={80}
                                    radius={6}
                                  />
                                  <View style={[{ flex: 1 }]}>
                                    <TextView theme={theme} size={18}>
                                      {item.Item.Name}
                                    </TextView>
                                    <SeparatedView>
                                      <TextView
                                        theme={theme}
                                        size={18}
                                        bold={true}
                                      >
                                        {item.Quantity} x
                                      </TextView>
                                      <TextView theme={theme} size={16}>
                                        ${item.Item.Price.toFixed(2)} ea
                                      </TextView>
                                    </SeparatedView>
                                    <View
                                      style={[
                                        {
                                          borderLeftColor: "#1BA8FF",
                                          borderLeftWidth: 3,
                                          paddingHorizontal: 10,
                                        },
                                      ]}
                                    >
                                      {item.ChosenOptions.map((opt, j) => {
                                        return (
                                          <View key={j}>
                                            <SeparatedView>
                                              <SideBySide>
                                                <TextView theme={theme}>
                                                  {opt.Name} -
                                                </TextView>
                                                <TextView theme={theme}>
                                                  {opt.OptionQuantity} x
                                                </TextView>
                                              </SideBySide>
                                              <TextView
                                                theme={theme}
                                                color={"#117DFA"}
                                              >
                                                + ${opt.Amount.toFixed(2)}
                                              </TextView>
                                            </SeparatedView>
                                          </View>
                                        );
                                      })}
                                    </View>
                                    <View
                                      style={[
                                        {
                                          borderTopColor:
                                            secondaryThemedTextColor(theme),
                                          borderTopWidth: 1,
                                          marginVertical: 10,
                                        },
                                      ]}
                                    ></View>
                                    <SeparatedView>
                                      <View></View>
                                      <TextView
                                        theme={theme}
                                        bold={true}
                                        size={16}
                                      >
                                        ${item.Total.toFixed(2)}
                                      </TextView>
                                    </SeparatedView>
                                  </View>
                                </View>
                                {item.Details !== "" && (
                                  <View>
                                    <TextView theme={theme}>
                                      {item.Details.replaceAll("jjj", "\n")}
                                    </TextView>
                                  </View>
                                )}
                              </View>
                            );
                          })}
                          <Spacer height={10} />
                          <View>
                            <SeparatedView>
                              <TextPill text={"Paid"} lightBackgroundColor={"#28D782"} darkBackgroundColor={"#28D782"} textSize={16} />
                              <TextView theme={theme} size={18} bold={true}>
                                ${(
                                  parseFloat(
                                    reduceArray(order.Items, "Total")
                                  ) +
                                  parseFloat(
                                    reduceArray(order.Items, "Total") * tax * 0.01
                                  )
                                ).toFixed(2)}
                              </TextView>
                            </SeparatedView>
                          </View>
                        </View>
                      </Accordion>
                    </View>
                  );
                })}
              {orders.filter((ting) => ting.Status === "Completed").length ===
                0 && (
                <View style={[layout.padding_horizontal]}>
                  <TextView theme={theme}>No completed orders.</TextView>
                </View>
              )}
            </View>
          )}
        </View>
        <Spacer height={60} />
      </ScrollView>

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
