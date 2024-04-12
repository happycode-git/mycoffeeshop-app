import { useEffect, useState } from "react";
import {
  AsyncImage,
  MenuBar,
  SafeArea,
  ShowMoreView,
  Spacer,
  TextView,
  firebase_GetAllDocumentsListenerOrdered,
  formatLongDate,
  getInDevice,
  height,
  layout,
  secondaryThemedTextColor,
  width,
} from "../EVERYTHING/BAGEL/Things";
import { TopFive } from "../SCREEN_COMPONENTS/Top";
import { ScrollView, View } from "react-native";

export function Updates({ navigation, route }) {
  const [loading, setLoading] = useState(false);
  const [fakeLoading, setFakeLoading] = useState(false);
  const [theme, setTheme] = useState("");
  const [updates, setUpdates] = useState([]);

  useEffect(() => {
    getInDevice("theme", setTheme);
    firebase_GetAllDocumentsListenerOrdered(
      setLoading,
      "Updates",
      setUpdates,
      50,
      "desc",
      "Date",
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
  }, []);

  return (
    <SafeArea loading={loading} theme={theme}>
      <TopFive theme={theme} title={"Things going on.."} />
      <Spacer height={15} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[layout.padding_horizontal, layout.vertical]}>
          {updates.map((update, i) => {
            return (
              <View key={i}>
                <AsyncImage
                  path={update.ImagePath}
                  width={"100%"}
                  height={height * 0.4}
                />
                <View style={[layout.padding_vertical]}>
                  <TextView theme={theme} bold={true} size={24}>
                    {update.Title}
                  </TextView>
                  <TextView
                    theme={theme}
                    color={secondaryThemedTextColor(theme)}
                    size={14}
                  >
                    {formatLongDate(new Date(update.Date.seconds * 1000))}
                  </TextView>
                  <ShowMoreView height={160}>
                    <View style={[layout.padding_vertical]}>
                      <TextView theme={theme} size={16}>
                        {update.Text.replaceAll("jjj", "\n")}
                      </TextView>
                    </View>
                  </ShowMoreView>
                </View>
              </View>
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
