import { useEffect, useState } from "react";
import {
  Accordion,
  AsyncImage,
  ButtonOne,
  Icon,
  IconButtonOne,
  IconButtonTwo,
  SafeArea,
  SeparatedView,
  SideBySide,
  Spacer,
  TextAreaOne,
  TextFieldOne,
  TextView,
  firebase_CreateDocument,
  firebase_DeleteDocument,
  firebase_GetAllDocuments,
  firebase_GetDocument,
  format,
  getInDevice,
  height,
  layout,
  randomString,
  reduceArray,
  removeDuplicates,
  secondaryThemedBackgroundColor,
  themedBackgroundColor,
  themedButtonColor,
  themedButtonTextColor,
  themedTextColor,
} from "../EVERYTHING/BAGEL/Things";
import { TopOne } from "../SCREEN_COMPONENTS/Top";
import { Alert, ScrollView, TouchableOpacity, View } from "react-native";

export function Item({ navigation, route }) {
  const { item, percentage } = route.params;
  const [loading, setLoading] = useState(false);
  const [fakeLoading, setFakeLoading] = useState(false);
  const [theme, setTheme] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [chosenOptions, setChosenOptions] = useState([]);
  const [me, setMe] = useState({});
  const [details, setDetails] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [savedID, setSavedID] = useState("");
  const [discount, setDiscount] = useState(0);

  function onDecrease() {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  }
  function onIncrease() {
    if (quantity < 10) {
      setQuantity((prev) => prev + 1);
    }
  }
  function addToCart() {
    const requiredSubs = removeDuplicates(
      item.Options.filter((ting) => ting.Required).map((ting) => {
        return ting.SubCategory;
      })
    );
    const alreadyPickedRequired = requiredSubs.every((sub) =>
      chosenOptions.some((option) => option.SubCategory === sub)
    );

    if (alreadyPickedRequired) {
      const args = {
        UserID: me.id,
        Details: details.replaceAll("\n", "jjj"),
        ChosenOptions: chosenOptions,
        Item: item,
        Total: parseFloat(
          item.Options.length > 0
            ? (
                (item.Price -
                  item.Price * discount * 0.01 +
                  chosenOptions.reduce(
                    (total, option) =>
                      total + option.Amount * option.OptionQuantity,
                    0
                  )) *
                quantity
              ).toFixed(2)
            : ((item.Price - item.Price * discount * 0.01) * quantity).toFixed(
                2
              )
        ),
        Quantity: quantity,
        Discounted: discount
      };
      // READY TO ADD
      setLoading(true);
      firebase_CreateDocument(args, "CartItems", randomString(25)).then(() => {
        Alert.alert("Success", `${item.Name} has been added to your cart.`, [
          {
            text: "Okay",
            onPress: () => {
              navigation.navigate("menu");
            },
          },
        ]);
      });
    } else {
      Alert.alert(
        "Missing Information",
        "Make sure you select all required options provided for this item."
      );
    }
  }
  function onSave() {
    const thisID = randomString(25);
    firebase_CreateDocument(
      {
        UserID: me.id,
        SavedID: item.id,
        Item: item,
        Options: chosenOptions,
      },
      "Favorites",
      thisID
    );
    setSavedID(thisID);
    setIsSaved(true);
  }
  function onUnsave() {
    firebase_DeleteDocument(setLoading, "Favorites", savedID);
    setIsSaved(false);
    setSavedID("");
  }

  useEffect(() => {
    getInDevice("theme", setTheme);
    getInDevice("user", (person) => {
      setMe(person);
      firebase_GetAllDocuments(
        setLoading,
        "Favorites",
        (favorites) => {
          const hasIt = favorites.some((ting) => ting.SavedID === item.id);
          setSavedID(favorites.find((ting) => ting.SavedID === item.id).id);
          setChosenOptions(
            favorites.find((ting) => ting.SavedID === item.id).Options
          );
          setIsSaved(hasIt);
        },
        0,
        "UserID",
        "==",
        person.id,
        false,
        null,
        null
      );
      if (percentage !== undefined) {
        setDiscount(percentage);
      }
    });
  }, []);

  return (
    <SafeArea loading={loading} theme={theme}>
      <View style={[layout.padding]}>
        <SeparatedView>
          <IconButtonTwo
            theme={theme}
            name={"chevron-back-outline"}
            onPress={() => {
              navigation.navigate("menu");
            }}
          />
          <IconButtonTwo
            theme={theme}
            name={isSaved ? "bookmark" : "bookmark-outline"}
            lightColor={isSaved ? "white" : themedTextColor(theme)}
            darkColor={isSaved ? "white" : themedTextColor(theme)}
            lightBackground={
              isSaved ? "red" : secondaryThemedBackgroundColor(theme)
            }
            darkBackground={
              isSaved ? "red" : secondaryThemedBackgroundColor(theme)
            }
            onPress={() => {
              if (isSaved) {
                onUnsave();
              } else {
                onSave();
              }
            }}
          />
        </SeparatedView>
      </View>
      <View style={[{ flex: 1 }]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={[layout.padding_horizontal]}>
            <AsyncImage
              path={item.ImagePath}
              height={height * 0.4}
              width={"100%"}
            />
            <View style={[layout.padding_vertical]}>
              <TextView theme={theme} size={26}>
                {item.Name}
              </TextView>

              <View style={[layout.padding_vertical_small]}>
                <TextView
                  theme={theme}
                  bold={true}
                  styles={[format.all_caps, layout.padding_vertical_small]}
                >
                  Description
                </TextView>
                <TextView theme={theme} size={16}>
                  {item.Description.replaceAll("jjj", "\n")}
                </TextView>
              </View>
              {/* OPTIONS */}
              <View style={[layout.padding_vertical_small]}>
                <SideBySide>
                  <TextView
                    theme={theme}
                    bold={true}
                    styles={[format.all_caps, layout.padding_vertical_small]}
                  >
                    Options
                  </TextView>
                </SideBySide>
                <View style={[{ gap: 4 }]}>
                  {removeDuplicates(
                    item.Options.map((ting) => {
                      return ting.SubCategory;
                    }).sort((a, b) =>
                      a === "Size" ? -1 : b === "Size" ? 1 : 0
                    )
                  ).map((sub, i) => {
                    return (
                      <View key={i}>
                        <Accordion
                          top={
                            <View
                              style={[
                                {
                                  backgroundColor:
                                    secondaryThemedBackgroundColor(theme),
                                },
                                format.radius,
                                layout.padding,
                              ]}
                            >
                              <SeparatedView>
                                <TextView theme={theme} size={18}>
                                  {sub}
                                </TextView>
                                <SideBySide>
                                  {item.Options.find(
                                    (ting) => ting.SubCategory === sub
                                  ).Required && (
                                    <TextView theme={theme} color={"red"}>
                                      required
                                    </TextView>
                                  )}
                                  <Icon
                                    name={"chevron-down-outline"}
                                    theme={theme}
                                  />
                                </SideBySide>
                              </SeparatedView>
                            </View>
                          }
                        >
                          <View>
                            {item.Options.filter(
                              (ting) => ting.SubCategory === sub
                            ).map((opt, o) => {
                              const isOptionChosen = chosenOptions.some(
                                (ting) => ting.id === opt.id
                              );
                              const isSizeSubcategory = sub === "Size";

                              return (
                                <TouchableOpacity
                                  key={o}
                                  style={[
                                    layout.padding,
                                    {
                                      backgroundColor: isOptionChosen
                                        ? "#28D782"
                                        : secondaryThemedBackgroundColor(theme),
                                    },
                                  ]}
                                  onPress={() => {
                                    if (isSizeSubcategory) {
                                      // If the subcategory is "Size", only allow selecting one option
                                      const existingSizeOptionIndex =
                                        chosenOptions.findIndex(
                                          (option) =>
                                            option.SubCategory === "Size"
                                        );

                                      setChosenOptions((prev) => {
                                        if (isOptionChosen) {
                                          return prev.filter(
                                            (ting) => ting.id !== opt.id
                                          );
                                        } else {
                                          const updatedOptions = [...prev];
                                          if (existingSizeOptionIndex !== -1) {
                                            updatedOptions.splice(
                                              existingSizeOptionIndex,
                                              1,
                                              { ...opt, OptionQuantity: 1 }
                                            );
                                          } else {
                                            updatedOptions.push({
                                              ...opt,
                                              OptionQuantity: 1,
                                            });
                                          }
                                          return updatedOptions;
                                        }
                                      });
                                    } else {
                                      // Allow selecting multiple options for other subcategories
                                      setChosenOptions((prev) =>
                                        isOptionChosen
                                          ? prev.filter(
                                              (ting) => ting.id !== opt.id
                                            )
                                          : [
                                              ...prev,
                                              { ...opt, OptionQuantity: 1 },
                                            ]
                                      );
                                    }
                                  }}
                                >
                                  <SeparatedView>
                                    <TextView theme={theme}>
                                      {opt.Name}
                                    </TextView>
                                    <SideBySide>
                                      {opt.ShowOptionAmount && (
                                        <TextView theme={theme}>
                                          + ${opt.Amount.toFixed(2)}
                                        </TextView>
                                      )}
                                      {opt.AllowMultiple &&
                                        chosenOptions.some(
                                          (ting) => ting.id === opt.id
                                        ) && (
                                          <View>
                                            <SideBySide gap={4}>
                                              <IconButtonOne
                                                name={"remove-circle"}
                                                size={28}
                                                theme={theme}
                                                lightColor={"#000000"}
                                                darkColor={"#000000"}
                                                onPress={() => {
                                                  setChosenOptions((prev) =>
                                                    prev.map((option) =>
                                                      option.id === opt.id &&
                                                      option.OptionQuantity > 1
                                                        ? {
                                                            ...option,
                                                            OptionQuantity:
                                                              option.OptionQuantity -
                                                              1,
                                                          }
                                                        : option
                                                    )
                                                  );
                                                }}
                                              />
                                              <TextView theme={theme} size={16}>
                                                {
                                                  chosenOptions.find(
                                                    (ting) => ting.id === opt.id
                                                  ).OptionQuantity
                                                }
                                              </TextView>
                                              <IconButtonOne
                                                name={"add-circle"}
                                                size={28}
                                                theme={theme}
                                                lightColor={"#000000"}
                                                darkColor={"#000000"}
                                                onPress={() => {
                                                  setChosenOptions((prev) =>
                                                    prev.map((option) =>
                                                      option.id === opt.id &&
                                                      option.OptionQuantity < 10
                                                        ? {
                                                            ...option,
                                                            OptionQuantity:
                                                              option.OptionQuantity +
                                                              1,
                                                          }
                                                        : option
                                                    )
                                                  );
                                                }}
                                              />
                                            </SideBySide>
                                          </View>
                                        )}
                                    </SideBySide>
                                  </SeparatedView>
                                </TouchableOpacity>
                              );
                            })}
                          </View>
                        </Accordion>
                      </View>
                    );
                  })}
                </View>
              </View>
              {/* ADDITIONAL */}
              <View style={[layout.padding_vertical_small]}>
                <TextView
                  theme={theme}
                  bold={true}
                  styles={[format.all_caps, layout.padding_vertical_small]}
                >
                  Additional Details
                </TextView>
                <TextAreaOne
                  theme={theme}
                  placeholder={"Type details here.."}
                  value={details}
                  setter={setDetails}
                />
              </View>
            </View>
          </View>
        </ScrollView>
        <View style={[layout.padding_horizontal]}>
          <Spacer height={6} />
          <SideBySide>
            <SideBySide>
              <IconButtonTwo
                theme={theme}
                name={"remove"}
                onPress={onDecrease}
              />
              <TextView theme={theme} size={18}>
                {quantity}
              </TextView>
              <IconButtonTwo theme={theme} name={"add"} onPress={onIncrease} />
            </SideBySide>
            <View style={[{ flex: 1 }]}>
              <ButtonOne
                backgroundColor={themedButtonColor(theme)}
                radius={100}
                onPress={addToCart}
              >
                <View style={[layout.padding_horizontal]}>
                  <SeparatedView>
                    <TextView
                      theme={theme}
                      color={themedButtonTextColor(theme)}
                      size={18}
                    >
                      Add To Cart
                    </TextView>
                    <View style={[layout.horizontal, { alignItems: "center" }]}>
                      <TextView
                        theme={theme}
                        color={themedButtonTextColor(theme)}
                        size={discount > 0 ? 10 : 18}
                        styles={[discount > 0 && format.strike]}
                        center={true}
                      >
                        $
                        {item.Options.length > 0
                          ? (
                              (item.Price +
                                chosenOptions.reduce(
                                  (total, option) =>
                                    total +
                                    option.Amount * option.OptionQuantity,
                                  0
                                )) *
                              quantity
                            ).toFixed(2)
                          : (item.Price * quantity).toFixed(2)}
                      </TextView>
                      {discount > 0 && (
                        <TextView
                          theme={theme}
                          color={themedButtonTextColor(theme)}
                          size={16}
                          bold={true}
                          center={true}
                        >
                          $
                          {item.Options.length > 0
                            ? (
                                (item.Price -
                                  item.Price * discount * 0.01 +
                                  chosenOptions.reduce(
                                    (total, option) =>
                                      total +
                                      option.Amount * option.OptionQuantity,
                                    0
                                  )) *
                                quantity
                              ).toFixed(2)
                            : (
                                (item.Price - item.Price * discount * 0.01) *
                                quantity
                              ).toFixed(2)}
                        </TextView>
                      )}
                    </View>
                  </SeparatedView>
                </View>
              </ButtonOne>
            </View>
          </SideBySide>
        </View>
      </View>
    </SafeArea>
  );
}
