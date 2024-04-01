// #region IMPORTS
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef, useState } from "react";
import {
  TouchableOpacity,
  View,
  Dimensions,
  StyleSheet,
  TextInput,
  Keyboard,
  Text,
  Alert,
  ActivityIndicator,
  Image,
  Platform,
  Animated,
  Easing,
  ScrollView,
  PanResponder,
  Switch,
  Pressable,
} from "react-native";
import * as Linking from "expo-linking";
import Slider from "@react-native-community/slider";
import * as ImagePicker from "expo-image-picker";
import { Camera, CameraType } from "expo-camera";
import { Ionicons } from "react-native-vector-icons";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";
import CheckBox from "expo-checkbox";
import * as Notifications from "expo-notifications";
import { Audio, Video } from "expo-av";
import DateTimePicker from "@react-native-community/datetimepicker";
import { BlurView } from "expo-blur";
import * as MailComposer from "expo-mail-composer";
import { LinearGradient } from "expo-linear-gradient";
import * as DocumentPicker from "expo-document-picker";
import PagerView from "react-native-pager-view";
import * as FileSystem from "expo-file-system";
import * as ngeohash from "ngeohash";
import algoliasearch from "algoliasearch";
import QRCode from "react-native-qrcode-svg";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Clipboard from "expo-clipboard";
import * as Sharing from 'expo-sharing';
//
import { initializeApp } from "firebase/app";
import {
  initializeAuth,
  getReactNativePersistence,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  limit,
  setDoc,
  startAfter,
  where,
  documentId,
} from "firebase/firestore";
import { StripeProvider, usePaymentSheet } from "@stripe/stripe-react-native";
import { Circle, Svg } from "react-native-svg";
// #endregion

// CONSTANTS
export const { height, width } = Dimensions.get("window");
// Bagel Algolia Account
export const searchClient = algoliasearch(
  "2DOEMGLWFB",
  "7cb8106771824a1a327f1e7cb9d81feb"
);
export const c_projectID = "178e14d8-0dce-4f61-8732-26291c7f545e";
export const c_googleMapsAPI = "AIzaSyD0y3c_it9f63AILxXHR-Y8YprSynEfxsY";
export var me = {};
export var myID = "test";
export var myToken = "";
export var stripePublishableKey =
  "pk_test_51NuJfZIDyFPNiK5CPKgovhg5fen3VM4SzxvBqdYAfwriYKzoqacsfIOiNAt5ErXss3eHYF45ak5PPFHeAD0AXit900imYxFTry";
//
export var serverURL = "https://garnet-private-hisser.glitch.me";
export var myCoords = {
  latitude: 35.66526085,
  longitude: 139.69219744,
};
// Config
const firebaseConfig = {
  apiKey: "AIzaSyAMkZs0qvSSYVfA4pOMzSkXl-Nkut7raqw",
  authDomain: "iic-appline-template.firebaseapp.com",
  projectId: "iic-appline-template",
  storageBucket: "iic-appline-template.appspot.com",
  messagingSenderId: "957439211423",
  appId: "1:957439211423:web:57d7872b6486b922102faa",
  measurementId: "G-D2Y4Q8QLJW",
};

// APP INFO
export var appName = "Happy Code Dev";

// EXTRAS
export const themedTextColor = (theme) => {
  if (theme === "light") {
    return "#000000"; // LIGHT THEME TEXT COLOR
  } else {
    return "#F4F4F4"; // DARK THEME TEXT COLOR
  }
};
export const secondaryThemedTextColor = (theme) => {
  if (theme === "light") {
    return "#55595B"; // LIGHT THEME TEXT COLOR
  } else {
    return "#65666B"; // DARK THEME TEXT COLOR
  }
};
export const themedBackgroundColor = (theme) => {
  if (theme === "light") {
    return "#ffffff"; // LIGHT THEME BACKGROUND COLOR
  } else {
    return "#0E0F13"; // DARK THEME BACKGROUND COLOR
  }
};
export const secondaryThemedBackgroundColor = (theme) => {
  if (theme === "light") {
    return "#F2F3F5"; // LIGHT THEME BACKGROUND COLOR
  } else {
    return "#1C1E25"; // DARK THEME BACKGROUND COLOR
  }
};
export const themedButtonColor = (theme) => {
  if (theme === "light") {
    return "#0E0F13";
  } else {
    return "#ffffff";
  }
};
export const themedButtonTextColor = (theme) => {
  if (theme === "light") {
    return "#ffffff";
  } else {
    return "#0E0F13";
  }
};

// COMPONENTS
export function SafeArea({ loading, children, theme, styles }) {
  return (
    <View
      style={[
        {
          flex: 1,
          backgroundColor: themedBackgroundColor(theme),
        },
        styles,
      ]}
    >
      <StatusBar style={theme === "light" ? "dark" : "light"}></StatusBar>
      {loading && <Loading />}
      <View
        style={[
          {
            flex: 1,
            paddingTop: Platform.OS === "ios" ? 42 : 30,
            paddingBottom: Platform.OS === "ios" ? 25 : 10,
          },
        ]}
      >
        {children}
      </View>
    </View>
  );
}
export function SplitView({ children, leftSize, rightSize, styles }) {
  const [left, right] = React.Children.toArray(children);
  return (
    <View
      style={[
        { flexDirection: "row", alignItems: "flex-start", gap: 10 },
        styles,
      ]}
    >
      <View style={[{ flex: leftSize }]}>{left}</View>
      <View style={[{ flex: rightSize }]}>{right}</View>
    </View>
  );
}
export function Grid({ columns, children, styles, gap }) {
  const childrenArray = React.Children.toArray(children);
  const rows = Math.ceil(childrenArray.length / columns);

  return (
    <View
      style={[{ flex: 1, flexDirection: "column", flexWrap: "wrap" }, styles]}
    >
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <View key={rowIndex} style={{ flexDirection: "row" }}>
          {childrenArray
            .slice(rowIndex * columns, (rowIndex + 1) * columns)
            .map((child, colIndex) => (
              <View
                key={colIndex}
                style={[
                  { flex: 1 / columns },
                  colIndex !== 0 && { marginLeft: gap }, // Add left margin for items after the first in a row
                  rowIndex !== rows - 1 && { marginBottom: gap }, // Add bottom margin for all items except the last row
                ]}
              >
                {child}
              </View>
            ))}
        </View>
      ))}
    </View>
  );
}
export function FadeWrapper({ children, seconds }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const milliseconds = seconds * 1000;
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: milliseconds !== undefined ? milliseconds : 2000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <Animated.View style={[{ opacity: fadeAnim }]}>{children}</Animated.View>
  );
}
export function Spacer({ height }) {
  return <View style={[{ height: height !== undefined ? height : 15 }]}></View>;
}
export function Loading() {
  return (
    <View
      style={[
        {
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 10000,
          minHeight: height,
          flex: 1,
        },
      ]}
    >
      <BlurWrapper
        intensity={40}
        radius={0}
        styles={[
          {
            flex: 1,
            height: height,
          },
        ]}
      >
        <View style={[{ flex: 1 }]}></View>
        <View style={[format.center_text, layout.padding]}>
          <PulsingView speed={0.5} scale={1.1}>
            <Image
              source={require("../../assets/loading.png")}
              style={[
                { width: 140, height: 140 },
                format.radius,
                layout.center,
              ]}
            />
          </PulsingView>
        </View>
        {/* <ActivityIndicator color={"white"} /> */}
        <View style={[{ flex: 1 }]}></View>
      </BlurWrapper>
    </View>
  );
}
export function RoundedCorners({
  children,
  topRight = 12,
  topLeft = 12,
  bottomRight = 12,
  bottomLeft = 12,
  lightBackground,
  darkBackground,
  theme,
  styles,
}) {
  return (
    <View
      style={[
        styles,
        {
          borderTopRightRadius: topRight,
          borderTopLeftRadius: topLeft,
          borderBottomRightRadius: bottomRight,
          borderBottomLeftRadius: bottomLeft,
          backgroundColor:
            lightBackground !== undefined && darkBackground !== undefined
              ? theme === "light"
                ? lightBackground
                : darkBackground
              : secondaryThemedBackgroundColor(theme),
        },
      ]}
    >
      {children}
    </View>
  );
}
export function PulsingView({ children, speed = 1, scale = 1.4 }) {
  const scaleValue = useRef(new Animated.Value(1)).current;

  const pulseAnimation = () => {
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: scale,
        duration: 300 / speed, // Adjust duration based on speed
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 300 / speed, // Adjust duration based on speed
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start(() => pulseAnimation());
  };

  useEffect(() => {
    pulseAnimation();
  }, [speed]);

  return (
    <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
      {children}
    </Animated.View>
  );
}
export function BlurWrapper({ intensity, tint, radius, children, styles }) {
  return (
    <View
      style={[
        styles,
        {
          borderRadius: radius !== undefined ? radius : 100,
          overflow: "hidden",
        },
      ]}
    >
      <BlurView
        blurReductionFactor={3}
        intensity={intensity !== undefined ? intensity : 50}
        tint={tint !== undefined ? tint : "dark"}
        style={[
          styles,
          {
            borderRadius: radius !== undefined ? radius : 100,
            overflow: "hidden",
          },
        ]}
      >
        {children}
      </BlurView>
    </View>
  );
}
export function SlideWrapper({
  mainContent,
  mainLightContentBackground,
  mainDarkContentBackground,
  sideContent,
  sideLightContentBackground,
  sideDarkContentBackground,
  theme,
  height,
}) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View
          style={{
            width: width,
            height: height !== undefined ? height : "auto",
            backgroundColor:
              mainLightContentBackground !== undefined &&
              mainDarkContentBackground !== undefined
                ? theme === "light"
                  ? mainLightContentBackground
                  : mainDarkContentBackground
                : secondaryThemedBackgroundColor(theme),
          }}
        >
          {mainContent}
        </View>
        <View
          style={{
            height: height !== undefined ? height : "auto",
            backgroundColor:
              sideLightContentBackground !== undefined &&
              sideDarkContentBackground !== undefined
                ? theme === "light"
                  ? sideLightContentBackground
                  : sideDarkContentBackground
                : secondaryThemedBackgroundColor(theme),
          }}
        >
          {sideContent}
        </View>
      </ScrollView>
    </View>
  );
}
export function ShowMoreView({ height, children, theme }) {
  const [showMore, setShowMore] = useState(false);

  return (
    <View>
      <View
        style={[
          { overflow: "hidden", height: showMore ? undefined : height },
        ]}
      >
        {children}
        {!showMore && (
          <LinearGradient
            colors={[
              `rgba(${hexToRgbObj(themedBackgroundColor(theme)).r},${
                hexToRgbObj(themedBackgroundColor(theme)).g
              },${hexToRgbObj(themedBackgroundColor(theme)).b}, 0)`,
              `rgba(${hexToRgbObj(themedBackgroundColor(theme)).r},${
                hexToRgbObj(themedBackgroundColor(theme)).g
              },${hexToRgbObj(themedBackgroundColor(theme)).b}, 1)`,
            ]}
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 80, // Adjust the faded area height as needed
            }}
          />
        )}
      </View>
      <TouchableOpacity onPress={() => setShowMore(!showMore)}>
        <View
          style={[
            {
              paddingVertical: 2,
              paddingHorizontal: 2,
              marginTop: !showMore ? -15 : -10,
            },
          ]}
        >
          <Text
            style={[
              {
                fontSize: 12,
                textAlign: "center",
                marginRight: 15,
                color: secondaryThemedTextColor(theme),
              },
            ]}
          >
            {showMore ? "Show Less" : "Show More"}
          </Text>
        </View>
      </TouchableOpacity>
      <View></View>
    </View>
  );
}
export function TimedView({ seconds, children }) {
  const [toggle, setToggle] = useState(true);
  useEffect(() => {
    const totalSec = (seconds !== undefined ? seconds : 5) * 1000;
    setTimeout(() => {
      setToggle(false);
    }, totalSec);
  }, []);

  return <View>{toggle && <View>{children}</View>}</View>;
}
export function GradientView({ colors, children, styles }) {
  return (
    <LinearGradient
      colors={colors}
      start={{ x: 0, y: 0.5 }}
      end={{ x: 1, y: 0.5 }}
      style={[styles]}
    >
      {children}
    </LinearGradient>
  );
}
export function GradientThemedView({
  lightColors,
  darkColors,
  children,
  styles,
  theme,
}) {
  return (
    <LinearGradient
      colors={theme === "light" ? lightColors : darkColors}
      start={{ x: 0, y: 0.5 }}
      end={{ x: 1, y: 0.5 }}
      style={[styles]}
    >
      {children}
    </LinearGradient>
  );
}
export function MenuBar({
  options,
  iconSize,
  color,
  selectedColor,
  lightBackgroundColor,
  darkBackgroundColor,
  paddingV,
  paddingH,
  radius,
  navigation,
  route,
  theme,
}) {
  return (
    <View style={[layout.absolute, { bottom: 20, right: 0, left: 0 }]}>
      <View
        style={[
          layout.fit_width,
          layout.center,
          layout.horizontal,
          { alignItems: "center" },
          {
            justifyContent: "space-around",
            backgroundColor:
              lightBackgroundColor !== undefined &&
              darkBackgroundColor !== undefined
                ? theme === "light"
                  ? lightBackgroundColor
                  : darkBackgroundColor
                : secondaryThemedBackgroundColor(theme),
            paddingVertical: paddingV !== undefined ? paddingV : 10,
            paddingHorizontal: paddingH !== undefined ? paddingH : 14,
            borderRadius: radius !== undefined ? radius : 100,
          },
        ]}
      >
        {options.map((opt, i) => {
          return (
            <TouchableOpacity
              key={i}
              onPress={() => {
                navigation.navigate(`${opt.Route}`);
              }}
            >
              <Ionicons
                name={`${opt.Icon}-outline`}
                size={iconSize !== undefined ? iconSize : 22}
                color={color !== undefined ? color : themedTextColor(theme)}
                style={[layout.center]}
              />

              {opt.Route === route.name && (
                <View>
                  <Spacer height={2} />
                  <Ionicons
                    name={"ellipse"}
                    size={7}
                    color={
                      selectedColor !== undefined ? selectedColor : "#1BA8FF"
                    }
                    style={[layout.center]}
                  />
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
export function CSVtoJSONConverterView({ func }) {
  const [jsonData, setJsonData] = useState(null);
  const [headers, setHeaders] = useState(null);
  const handleFilePick = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "text/csv",
      });
      const res = result.assets[0];
      if (!result.canceled) {
        const csvData = await FileSystem.readAsStringAsync(res.uri);
        // Parse CSV to JSON
        const parsedData = parseCSV(csvData);
        setHeaders(parsedData.headers);
        setJsonData(parsedData.data);
      }
    } catch (error) {
      console.error("Error picking file:", error);
    }
  };
  const parseCSV = (csvData) => {
    // console.log(csvData);
    const lines = csvData.trim().split("\n");
    const firstLine = lines[0].trim();

    // Determine the separator (`,` or `;`)
    const separator = firstLine.includes(";") ? ";" : ",";

    const headers = firstLine.split(separator);

    const jsonData = lines.slice(1).map((line) => {
      const values = line.split(",");
      return headers.reduce((obj, header, index) => {
        obj[header] = values[index];
        return obj;
      }, {});
    });

    return { headers, data: jsonData };
  };
  const renderTable = () => {
    if (!jsonData || jsonData.length === 0) {
      return null;
    }

    return (
      <View>
        <View style={{ flexDirection: "column" }}>
          {/* Table Header */}

          <View
            style={{
              flexDirection: "row",
              borderBottomWidth: 1,
              borderBottomColor: "#ccc",
            }}
          >
            {headers.map((header, index) => (
              <View
                key={index}
                style={{
                  width: 300,
                  padding: 10,
                  justifyContent: "center",
                  alignItems: "center",
                  borderRightWidth: 1,
                  borderRightColor: "#000000",
                  backgroundColor: "rgba(0,0,0,0.2)",
                }}
              >
                <Text style={[format.bold]}>{header}</Text>
              </View>
            ))}
          </View>

          {/* Table Rows */}
          {jsonData.map((row, rowIndex) => (
            <View
              key={rowIndex}
              style={{
                flexDirection: "row",
                borderBottomWidth: 1,
                borderBottomColor: "#ccc",
              }}
            >
              {headers.map((header, index) => (
                <View
                  key={index}
                  style={{
                    width: 300,
                    padding: 10,
                    borderRightWidth: 1,
                    borderRightColor: "#ccc",
                  }}
                >
                  <Text>{row[header]}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      </View>
    );
  };
  const saveData = () => {
    // console.log(jsonData);
  };

  return (
    <View style={[backgrounds.white]}>
      <View style={[layout.padding, layout.vertical]}>
        <ButtonOne
          onPress={handleFilePick}
          styles={[layout.separate_horizontal]}
        >
          <Text style={[colors.white, sizes.medium_text]}>Choose CSV File</Text>
          <Icon name="document-outline" color="white" size={30} />
        </ButtonOne>
        {jsonData && jsonData.length > 0 && (
          <View>
            <ButtonOne
              onPress={() => {
                func(jsonData);
              }}
              backgroundColor={"#2F70D5"}
            >
              <Text
                style={[colors.white, sizes.medium_text, format.center_text]}
              >
                Do Something
              </Text>
            </ButtonOne>
          </View>
        )}
      </View>
      <ScrollView horizontal>
        <ScrollView>{renderTable()}</ScrollView>
      </ScrollView>
      {jsonData && (
        <View style={[layout.padding]}>
          <ButtonOne onPress={saveData} styles={[layout.separate_horizontal]}>
            <Text style={[colors.white, sizes.medium_text]}>Save CSV Data</Text>
            <Icon name="save-outline" color="white" size={30} />
          </ButtonOne>
        </View>
      )}
    </View>
  );
}
export function SideBySide({ children, gap }) {
  return (
    <View
      style={[
        layout.horizontal,
        { alignItems: "center", gap: gap !== undefined ? gap : 10 },
      ]}
    >
      {children}
    </View>
  );
}
export function SeparatedView({ children }) {
  return (
    <View style={[layout.separate_horizontal, { gap: 10 }]}>{children}</View>
  );
}

//
export function TextView({
  children,
  color,
  bold,
  center,
  theme,
  size,
  styles,
}) {
  return (
    <Text
      style={[
        {
          color: color !== undefined ? color : themedTextColor(theme),
          fontSize: size !== undefined ? size : 14,
        },
        bold !== undefined && format.bold,
        center !== undefined && format.center_text,
        styles,
      ]}
    >
      {children}
    </Text>
  );
}
export function ButtonOne({
  children,
  backgroundColor,
  radius,
  padding,
  width,
  onPress,
  styles,
}) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={[
          {
            backgroundColor:
              backgroundColor !== undefined ? backgroundColor : "black",
            borderRadius: radius !== undefined ? radius : 6,
            padding: padding !== undefined ? padding : 14,
            width: width !== undefined ? width : "100%",
          },
          styles,
        ]}
      >
        {children}
      </View>
    </TouchableOpacity>
  );
}
export function ButtonTwo({
  children,
  borderWidth,
  borderColor,
  radius,
  padding,
  onPress,
  styles,
}) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={[
          {
            borderWidth: borderWidth !== undefined ? borderWidth : 1,
            borderColor: borderColor !== undefined ? borderColor : "black",
            borderRadius: radius !== undefined ? radius : 6,
            padding: padding !== undefined ? padding : 14,
          },
          styles,
        ]}
      >
        {children}
      </View>
    </TouchableOpacity>
  );
}
export function SelectedButton({
  children,
  func,
  borderColor,
  backgroundColor,
  selectedBackgroundColor,
  selectedTextColor,
  styles,
}) {
  const [selected, setSelected] = useState(false);
  function selectFunc() {
    setSelected((prev) => !prev);
    if (func !== undefined) {
      func();
    } else {
      console.log("PRESSED");
    }
  }
  return (
    <TouchableOpacity
      onPress={() => {
        selectFunc();
      }}
      style={[
        {
          backgroundColor: selected
            ? selectedBackgroundColor !== undefined
              ? selectedBackgroundColor
              : "rgba(0,0,0,0.2)"
            : backgroundColor !== undefined
            ? backgroundColor
            : "rgba(0,0,0,0.05)",
          borderWidth: selected ? 1 : 0,
          borderColor: selected
            ? borderColor !== undefined
              ? borderColor
              : "rgba(0,0,0,0.8)"
            : "rgba(0,0,0,0)",
        },
      ]}
    >
      <View style={[styles]}>{children}</View>
    </TouchableOpacity>
  );
}
export function IconButtonOne({
  name,
  size,
  lightColor,
  darkColor,
  onPress,
  styles,
  theme,
}) {
  return (
    <TouchableOpacity style={[styles]} onPress={onPress}>
      <Ionicons
        name={name !== undefined ? name : "flash"}
        size={size !== undefined ? size : 24}
        style={[
          {
            color:
              lightColor !== undefined && darkColor !== undefined
                ? theme === "light"
                  ? lightColor
                  : darkColor
                : themedTextColor(theme),
          },
        ]}
      />
    </TouchableOpacity>
  );
}
export function IconButtonTwo({
  name,
  size,
  padding,
  lightBackground,
  darkBackground,
  lightColor,
  darkColor,
  onPress,
  styles,
  theme,
}) {
  return (
    <TouchableOpacity
      style={[
        {
          padding: padding !== undefined ? padding : 8,
          backgroundColor:
            lightBackground !== undefined && darkBackground !== undefined
              ? theme === "light"
                ? lightBackground
                : darkBackground
              : secondaryThemedBackgroundColor(theme),
          borderRadius: 100,
          alignSelf: "flex-start",
        },
        styles,
      ]}
      onPress={onPress}
    >
      <Ionicons
        name={name !== undefined ? name : "flash"}
        size={size !== undefined ? size : 24}
        style={[
          {
            color:
              lightColor !== undefined && darkColor !== undefined
                ? theme === "light"
                  ? lightColor
                  : darkColor
                : themedTextColor(theme),
          },
        ]}
      />
    </TouchableOpacity>
  );
}
export function IconButtonThree({
  name,
  size,
  lightColor,
  darkColor,
  lightBorderColor,
  darkBorderColor,
  radius,
  padding,
  onPress,
  styles,
  theme,
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles,
        {
          borderWidth: 1,
          borderColor:
            lightBorderColor !== undefined && darkBorderColor !== undefined
              ? theme === "light"
                ? lightBorderColor
                : darkBorderColor
              : themedTextColor(theme),
          padding: padding !== undefined ? padding : 8,
          borderRadius: radius !== undefined ? radius : 100,
          alignSelf: "flex-start",
        },
      ]}
    >
      <Ionicons
        name={name !== undefined ? name : "flash"}
        size={size !== undefined ? size : 24}
        style={{
          color:
            lightColor !== undefined && darkColor !== undefined
              ? theme === "light"
                ? lightColor
                : darkColor
              : themedTextColor(theme),
        }}
      />
    </TouchableOpacity>
  );
}
export function Icon({ name, size, lightColor, darkColor, styles, theme }) {
  return (
    <Ionicons
      name={name !== undefined ? name : "flash"}
      size={size !== undefined ? size : 24}
      style={[
        {
          color:
            lightColor !== undefined && darkColor !== undefined
              ? theme === "light"
                ? lightColor
                : darkColor
              : themedTextColor(theme),
        },
        styles,
      ]}
    />
  );
}
export function LinkOne({
  children,
  lightUnderlineColor,
  darkUnderlineColor,
  onPress,
  styles,
  theme,
}) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={[
          {
            borderBottomWidth: 1,
            borderBottomColor:
              lightUnderlineColor !== undefined &&
              darkUnderlineColor !== undefined
                ? theme === "light"
                  ? lightUnderlineColor
                  : darkUnderlineColor
                : themedTextColor(theme),
            alignSelf: "flex-start",
          },
          styles,
        ]}
      >
        {children}
      </View>
    </TouchableOpacity>
  );
}
export function TextFieldOne({
  placeholder,
  lightPlaceholderColor,
  darkPlaceholderColor,
  lightBackgroundColor,
  darkBackgroundColor,
  borderBottomWidth,
  lightBorderColor,
  darkBorderColor,
  paddingH,
  paddingV,
  textSize,
  lightTextColor,
  darkTextColor,
  radius,
  isPassword,
  autoCap,
  isNum,
  value,
  setter,
  styles,
  onChange,
  theme,
}) {
  function onType(text) {
    setter(text);
    if (onChange !== undefined) {
      onChange(text)
    }
  }
  return (
    <TextInput
      placeholder={placeholder !== undefined ? placeholder : "Type here.."}
      placeholderTextColor={
        lightPlaceholderColor !== undefined &&
        darkPlaceholderColor !== undefined
          ? theme === "light"
            ? lightPlaceholderColor
            : darkPlaceholderColor
          : secondaryThemedTextColor(theme)
      }
      onChangeText={onType}
      value={value}
      secureTextEntry={isPassword !== undefined ? isPassword : false}
      autoCapitalize={autoCap !== undefined ? "sentences" : "none"}
      keyboardType={isNum !== undefined ? "decimal-pad" : "default"}
      style={[
        {
          paddingHorizontal: paddingH !== undefined ? paddingH : 14,
          paddingVertical: paddingV !== undefined ? paddingV : 14,
          backgroundColor:
            lightBackgroundColor !== undefined &&
            darkBackgroundColor !== undefined
              ? theme === "light"
                ? lightBackgroundColor
                : darkBackgroundColor
              : secondaryThemedBackgroundColor(theme),
          fontSize: textSize !== undefined ? textSize : 16,
          borderRadius: radius !== undefined ? radius : 6,
          borderBottomColor:
            lightBorderColor !== undefined && darkBorderColor !== undefined
              ? theme === "light"
                ? lightBorderColor
                : darkBorderColor
              : secondaryThemedTextColor(theme),
          borderBottomWidth:
            borderBottomWidth !== undefined ? borderBottomWidth : 0,
          color:
            lightTextColor !== undefined && darkTextColor !== undefined
              ? theme === "light"
                ? lightTextColor
                : darkTextColor
              : themedTextColor(theme),
        },
        styles,
      ]}
    />
  );
}
export function TextAreaOne({
  placeholder,
  lightPlaceholderColor,
  darkPlaceholderColor,
  lightBackgroundColor,
  darkBackgroundColor,
  textSize,
  lightTextColor,
  darkTextColor,
  radius,
  paddingV,
  paddingH,
  autoCap,
  value,
  setter,
  styles,
  onChange,
  theme,
}) {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  function onType(text) {
    setter(text);
    if (onChange !== undefined) {
      onChange(text)
    }
  }

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
      }
    );

    // Clean up listeners when component is unmounted
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <View>
      <View
        style={[
          {
            backgroundColor:
              lightBackgroundColor !== undefined &&
              darkBackgroundColor !== undefined
                ? theme === "light"
                  ? lightBackgroundColor
                  : darkBackgroundColor
                : secondaryThemedBackgroundColor(theme),
            paddingVertical: paddingV !== undefined ? paddingV : 10,
            paddingHorizontal: paddingH !== undefined ? paddingH : 12,
            borderRadius: radius !== undefined ? radius : 6,
          },
        ]}
      >
        <TextInput
          multiline={true}
          autoCapitalize={autoCap !== undefined ? "sentences" : "none"}
          placeholder={placeholder !== undefined ? placeholder : "Type here.."}
          placeholderTextColor={
            lightPlaceholderColor !== undefined &&
            darkPlaceholderColor !== undefined
              ? theme === "light"
                ? lightPlaceholderColor
                : darkPlaceholderColor
              : secondaryThemedTextColor(theme)
          }
          onChangeText={onType}
          value={value}
          style={[
            {
              fontSize: textSize !== undefined ? textSize : 16,
              color:
                lightTextColor !== undefined && darkTextColor !== undefined
                  ? theme === "light"
                    ? lightTextColor
                    : darkTextColor
                  : themedTextColor(theme),
            },
            styles,
          ]}
        />
      </View>
      {isKeyboardVisible && (
        <TouchableOpacity
          onPress={() => {
            Keyboard.dismiss();
          }}
        >
          <Text
            style={[
              {
                textAlign: "right",
                paddingVertical: 6,
                fontSize: 16,
                color: themedTextColor(theme),
              },
            ]}
          >
            Done
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
export function DropdownOne({
  options,
  radius,
  value,
  setter,
  lightBackgroundColor,
  darkBackgroundColor,
  lightColor,
  darkColor,
  textSize,
  iconSize,
  padding,
  styles,
  onChange,
  theme,
}) {
  const [toggle, setToggle] = useState(false);
  return (
    <View style={styles}>
      <TouchableOpacity
        onPress={() => {
          setToggle(!toggle);
        }}
      >
        <View
          style={[
            {
              backgroundColor:
                lightBackgroundColor !== undefined &&
                darkBackgroundColor !== undefined
                  ? theme === "light"
                    ? lightBackgroundColor
                    : darkBackgroundColor
                  : secondaryThemedBackgroundColor(theme),
              padding: padding !== undefined ? padding : 12,
              borderRadius: radius !== undefined ? radius : 10,
            },
            layout.separate_horizontal,
            layout.relative,
          ]}
        >
          <Text
            style={[
              {
                color:
                  lightColor !== undefined && darkColor !== undefined
                    ? theme === "light"
                      ? lightColor
                      : darkColor
                    : themedTextColor(theme),
                fontSize: textSize !== undefined ? textSize : 14,
              },
            ]}
          >
            {value}
          </Text>
          <Ionicons
            name="chevron-down-outline"
            size={iconSize !== undefined ? iconSize : 16}
            color={
              lightColor !== undefined && darkColor !== undefined
                ? theme === "light"
                  ? lightColor
                  : darkColor
                : themedTextColor(theme)
            }
          />
        </View>
      </TouchableOpacity>
      <Spacer height={6} />
      {toggle && (
        <View>
          {options.map((option, i) => {
            return (
              <TouchableOpacity
                key={i}
                style={[{ padding: 10, gap: 6 }, layout.separate_horizontal]}
                onPress={() => {
                  if (onChange !== undefined) {
                    onChange(option);
                  } else {
                    console.log(option);
                  }
                  setter(option);
                  setToggle(false);
                }}
              >
                <Text
                  style={[
                    {
                      color:
                        lightColor !== undefined && darkColor !== undefined
                          ? theme === "light"
                            ? lightColor
                            : darkColor
                          : themedTextColor(theme),
                      fontSize: textSize !== undefined ? textSize : 14,
                    },
                  ]}
                >
                  {option}
                </Text>
                {option === value && (
                  <Icon
                    name={"ellipse"}
                    size={iconSize !== undefined ? iconSize - 6 : 12}
                    lightColor={"#1BA8FF"}
                    darkColor={"#1BA8FF"}
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
}
export function CheckboxOne({
  value,
  setter,
  text,
  textSize,
  lightColor,
  darkColor,
  checkSize,
  radius,
  backgroundColor,
  gap,
  theme,
}) {
  function onCheck() {
    setter(!value);
  }
  return (
    <View
      style={[
        layout.horizontal,
        { alignItems: "center", gap: gap !== undefined ? gap : 10 },
      ]}
    >
      <CheckBox
        value={value}
        onValueChange={onCheck}
        style={[
          {
            borderRadius: radius !== undefined ? radius : 6,
            padding: checkSize !== undefined ? checkSize : 10,
          },
        ]}
        color={backgroundColor !== undefined ? backgroundColor : "#1BA8FF"}
      />
      <Text
        style={[
          {
            color:
              lightColor !== undefined && darkColor !== undefined
                ? theme === "light"
                  ? lightColor
                  : darkColor
                : themedTextColor(theme),
            fontSize: textSize !== undefined ? textSize : 16,
          },
        ]}
      >
        {text}
      </Text>
    </View>
  );
}
export function SwitchOne({
  toggledOnColor,
  toggledOffColor,
  thumbColor,
  value,
  setter,
  func,
  theme,
}) {
  return (
    <Switch
      trackColor={{
        false:
          toggledOffColor !== undefined
            ? toggledOffColor
            : secondaryThemedBackgroundColor(theme),
        true: toggledOnColor !== undefined ? toggledOnColor : "#1BA8FF",
      }}
      thumbColor={thumbColor !== undefined ? thumbColor : "#F8F8F8"}
      value={value}
      onValueChange={(value) => {
        setter(value);
        if (func !== undefined) {
          func();
        } else {
          console.log("TOGGLED");
        }
      }}
    />
  );
}
export function DatePicker({
  date,
  setDate,
  padding,
  radius,
  lightTextColor,
  darkTextColor,
  textSize,
  lightBackgroundColor,
  darkBackgroundColor,
  textStyles,
  theme,
}) {
  const [showPicker, setShowPicker] = useState(false);

  return (
    <View>
      {showPicker && (
        <View
          style={[
            {
              backgroundColor:
                lightBackgroundColor !== undefined &&
                darkBackgroundColor !== undefined
                  ? theme === "light"
                    ? lightBackgroundColor
                    : darkBackgroundColor
                  : secondaryThemedBackgroundColor(theme),
              borderRadius: radius !== undefined ? radius : 12,
            },
          ]}
        >
          <DateTimePicker
            textColor={
              lightTextColor !== undefined && darkTextColor !== undefined
                ? theme === "light"
                  ? lightTextColor
                  : darkTextColor
                : themedTextColor(theme)
            }
            testID="datePicker"
            value={date}
            onChange={(event, selected) => {
              setShowPicker(false);
              if (event.type === "set") {
                const currentDate = selected || new Date(); // Use current time if selectedTime is null
                setDate(currentDate);
              }
            }}
            mode="date"
            display="spinner"
          />
        </View>
      )}
      {!showPicker && (
        <ButtonOne
          padding={padding !== undefined ? padding : 12}
          backgroundColor={
            lightBackgroundColor !== undefined &&
            darkBackgroundColor !== undefined
              ? theme === "light"
                ? lightBackgroundColor
                : darkBackgroundColor
              : secondaryThemedBackgroundColor(theme)
          }
          radius={radius !== undefined ? radius : 12}
          onPress={() => {
            setShowPicker(true);
          }}
        >
          <Text
            style={[
              format.center_text,
              {
                color:
                  lightTextColor !== undefined && darkTextColor !== undefined
                    ? theme === "light"
                      ? lightTextColor
                      : darkTextColor
                    : themedTextColor(theme),
                fontSize: textSize !== undefined ? textSize : 14,
              },
              textStyles,
            ]}
          >
            {formatDate(date)}
          </Text>
        </ButtonOne>
      )}
    </View>
  );
}
export function TimePicker({
  time,
  setTime,
  padding,
  radius,
  lightTextColor,
  darkTextColor,
  textSize,
  lightBackgroundColor,
  darkBackgroundColor,
  textStyles,
  theme,
}) {
  const [showPicker, setShowPicker] = useState(false);

  return (
    <View>
      {showPicker && (
        <View
          style={[
            {
              backgroundColor:
                lightBackgroundColor !== undefined &&
                darkBackgroundColor !== undefined
                  ? theme === "light"
                    ? lightBackgroundColor
                    : darkBackgroundColor
                  : secondaryThemedBackgroundColor(theme),
              borderRadius: radius !== undefined ? radius : 12,
            },
          ]}
        >
          <DateTimePicker
            textColor={
              lightTextColor !== undefined && darkTextColor !== undefined
                ? theme === "light"
                  ? lightTextColor
                  : darkTextColor
                : themedTextColor(theme)
            }
            testID="timePicker"
            value={time}
            onChange={(event, selected) => {
              setShowPicker(false);
              if (event.type === "set") {
                const currentTime = selected || new Date(); // Use current time if selectedTime is null
                setTime(currentTime);
              }
            }}
            mode="time"
            display="spinner"
          />
        </View>
      )}
      {!showPicker && (
        <ButtonOne
          padding={padding !== undefined ? padding : 12}
          backgroundColor={
            lightBackgroundColor !== undefined &&
            darkBackgroundColor !== undefined
              ? theme === "light"
                ? lightBackgroundColor
                : darkBackgroundColor
              : secondaryThemedBackgroundColor(theme)
          }
          radius={radius !== undefined ? radius : 12}
          onPress={() => {
            setShowPicker(true);
          }}
        >
          <Text
            style={[
              format.center_text,
              {
                color:
                  lightTextColor !== undefined && darkTextColor !== undefined
                    ? theme === "light"
                      ? lightTextColor
                      : darkTextColor
                    : themedTextColor(theme),
                fontSize: textSize !== undefined ? textSize : 14,
              },
              textStyles,
            ]}
          >
            {formatTime(time)}
          </Text>
        </ButtonOne>
      )}
    </View>
  );
}
export function TextPill({
  text,
  lightColor,
  darkColor,
  textSize,
  paddingV,
  paddingH,
  lightBackgroundColor,
  darkBackgroundColor,
  radius,
  theme,
}) {
  return (
    <View
      style={[
        layout.fit_width,
        {
          backgroundColor:
            lightBackgroundColor !== undefined &&
            darkBackgroundColor !== undefined
              ? theme === "light"
                ? lightBackgroundColor
                : darkBackgroundColor
              : secondaryThemedBackgroundColor(theme),
          borderRadius: radius !== undefined ? radius : 100,
          paddingVertical: paddingV !== undefined ? paddingV : 10,
          paddingHorizontal: paddingH !== undefined ? paddingH : 14,
        },
      ]}
    >
      <Text
        style={[
          {
            color:
              lightColor !== undefined && darkColor !== undefined
                ? theme === "light"
                  ? lightColor
                  : darkColor
                : themedTextColor(theme),
            fontSize: textSize !== undefined ? textSize : 12,
          },
        ]}
      >
        {text !== undefined ? text : "Hello, Bagel."}
      </Text>
    </View>
  );
}
export function TextIconPill({
  icon,
  lightIconColor,
  darkIconColor,
  iconSize,
  text,
  lightTextColor,
  darkTextColor,
  textSize,
  paddingV,
  paddingH,
  lightBackgroundColor,
  darkBackgroundColor,
  radius,
  theme,
}) {
  return (
    <View
      style={[
        layout.horizontal,
        { alignItems: "center" },
        layout.fit_width,
        {
          backgroundColor:
            lightBackgroundColor !== undefined &&
            darkBackgroundColor !== undefined
              ? theme === "light"
                ? lightBackgroundColor
                : darkBackgroundColor
              : secondaryThemedBackgroundColor(theme),
          borderRadius: radius !== undefined ? radius : 100,
          paddingVertical: paddingV !== undefined ? paddingV : 10,
          paddingHorizontal: paddingH !== undefined ? paddingH : 14,
        },
      ]}
    >
      <Ionicons
        name={icon !== undefined ? icon : "flash-outline"}
        color={
          lightIconColor !== undefined && darkIconColor !== undefined
            ? theme === "light"
              ? lightIconColor
              : darkIconColor
            : "#1BA8FF"
        }
        size={iconSize !== undefined ? iconSize : 16}
      />
      <Text
        style={[
          {
            color:
              lightTextColor !== undefined && darkTextColor !== undefined
                ? theme === "light"
                  ? lightTextColor
                  : darkTextColor
                : themedTextColor(theme),
            fontSize: textSize !== undefined ? textSize : 12,
          },
        ]}
      >
        {text !== undefined ? text : "Hello, Bagel."}
      </Text>
    </View>
  );
}
export function BorderPill({
  children,
  lightBorderColor,
  darkBorderColor,
  paddingV,
  paddingH,
  radius,
  theme,
}) {
  return (
    <View
      style={[
        layout.fit_width,
        {
          borderRadius: radius !== undefined ? radius : 100,
          paddingVertical: paddingV !== undefined ? paddingV : 10,
          paddingHorizontal: paddingH !== undefined ? paddingH : 14,
          borderColor:
            lightBorderColor !== undefined && darkBorderColor !== undefined
              ? theme === "light"
                ? lightBorderColor
                : darkBorderColor
              : themedTextColor(theme),
          borderWidth: 1,
        },
      ]}
    >
      {children}
    </View>
  );
}
export function Divider(color, marginV, theme) {
  return (
    <View
      style={[
        {
          borderTopColor:
            color !== undefined
              ? color
              : `rgba(${hexToRgbObj(themedTextColor(theme)).r},${
                  hexToRgbObj(themedTextColor(theme)).g
                }, ${hexToRgbObj(themedTextColor(theme)).b}, 0.5)`,
          borderTopWidth: 1,
          marginVertical: marginV !== undefined ? marginV : 15,
        },
      ]}
    ></View>
  );
}
export function SegmentedPicker({
  options,
  value,
  setter,
  textSize,
  selectedTextColor,
  lightBackgroundColor,
  darkBackgroundColor,
  selectedBackgroundColor,
  paddingV,
  paddingH,
  radius,
  theme,
}) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={[layout.horizontal]}>
        {options.map((option, i) => {
          return (
            <TouchableOpacity
              key={i}
              style={[
                {
                  paddingVertical: paddingV !== undefined ? paddingV : 10,
                  paddingHorizontal: paddingH !== undefined ? paddingH : 16,
                  borderRadius: radius !== undefined ? radius : 100,
                  backgroundColor:
                    value === option
                      ? selectedBackgroundColor !== undefined
                        ? selectedBackgroundColor
                        : "#1BA8FF"
                      : lightBackgroundColor !== undefined &&
                        darkBackgroundColor !== undefined
                      ? theme === "light"
                        ? lightBackgroundColor
                        : darkBackgroundColor
                      : secondaryThemedBackgroundColor(theme),
                },
              ]}
              onPress={() => {
                setter(option);
              }}
            >
              <Text
                style={[
                  {
                    color:
                      value === option
                        ? selectedTextColor !== undefined
                          ? selectedTextColor
                          : "white"
                        : themedTextColor(theme),
                    fontSize: textSize !== undefined ? textSize : 14,
                  },
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
}
export function SegmentedPickerTwo({
  options,
  value,
  setter,
  borderColor,
  borderWidth,
  selectedColor,
  textSize,
  paddingV,
  paddingH,
  theme,
}) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={[layout.horizontal]}>
        {options.map((option, i) => {
          return (
            <TouchableOpacity
              key={i}
              style={[
                {
                  paddingVertical: paddingV !== undefined ? paddingV : 10,
                  paddingHorizontal: paddingH !== undefined ? paddingH : 12,
                  borderRadius: 0,
                  borderBottomWidth:
                    borderWidth !== undefined ? borderWidth : 2,
                  borderBottomColor:
                    value === option
                      ? borderColor !== undefined
                        ? borderColor
                        : "#1BA8FF"
                      : "rgba(0,0,0,0.0)",
                },
              ]}
              onPress={() => {
                setter(option);
              }}
            >
              <Text
                style={[
                  {
                    color:
                      value === option
                        ? selectedColor !== undefined
                          ? selectedColor
                          : themedTextColor(theme)
                        : themedTextColor(theme),
                    fontSize: textSize !== undefined ? textSize : 14,
                  },
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
}
export function Accordion({ children, top, gap, func }) {
  const [toggle, setToggle] = useState(false);
  return (
    <TouchableOpacity
      onPress={() => {
        if (func !== undefined) {
          func();
        }
        setToggle(!toggle);
      }}
    >
      <View>{top}</View>
      {toggle && (
        <View>
          <Spacer height={gap !== undefined ? gap : 8} />
          {children}
        </View>
      )}
    </TouchableOpacity>
  );
}
export function CameraView({ setToggle, func, theme }) {
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const cameraRef = React.useRef(null);

  function toggleCameraType() {
    setType((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  }
  async function takePicture() {
    if (cameraRef.current && isCameraReady && !capturing) {
      setCapturing(true);
      try {
        const photo = await cameraRef.current.takePictureAsync();
        if (func !== undefined) {
          func(photo.uri);
        }
        setToggle(false);
      } finally {
        setCapturing(false);
        setToggle(false);
      }
    }
  }

  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View
        style={[
          layout.absolute,
          layout.full_height,
          layout.full_width,
          {
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 10000,
            minHeight: height,
            flex: 1,
          },
          themedBackgroundColor(theme),
          layout.separate_vertical,
        ]}
      >
        <View></View>
        <View style={[layout.vertical]}>
          <TextView theme={theme} styles={{ textAlign: "center" }}>
            We need your permission to show the camera
          </TextView>
          <TouchableOpacity
            onPress={() => {
              requestPermission();
              console.log("GRANTED");
              // setToggle(true);
            }}
          >
            <Text style={[format.center_text, sizes.medium_text, colors.blue]}>
              Grant Permission
            </Text>
          </TouchableOpacity>
        </View>
        <View></View>
      </View>
    );
  }

  return (
    <View
      style={[
        backgrounds.black,
        layout.absolute,
        layout.full_width,
        {
          paddingVertical: 55,
          top: 0,
          right: 0,
          left: 0,
          bottom: 0,
          zIndex: 10000,
          flex: 1,
          minHeight: height,
        },
      ]}
    >
      <Camera
        style={[{ height: "100%", width: "100%", flex: 1 }]}
        type={type}
        ref={(ref) => {
          cameraRef.current = ref;
        }}
        onCameraReady={() => setIsCameraReady(true)}
      >
        <View
          style={[
            layout.separate_horizontal,
            layout.padding,
            layout.absolute,
            layout.full_width,
            layout.align_bottom,
            {
              right: 0,
              left: 0,
              bottom: 0,
              zIndex: 10000,
              flex: 1,
            },
          ]}
        >
          <View style={[layout.separate_horizontal]}>
            <TouchableOpacity
              style={[
                { paddingVertical: 8, paddingHorizontal: 14 },
                layout.margin,
                layout.fit_width,
                { backgroundColor: "rgba(0,0,0,0.6)", borderRadius: 30 },
              ]}
              onPress={() => {
                setToggle(false);
              }}
            >
              <View>
                <Text style={[colors.white]}>Close</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                {
                  backgroundColor: "rgba(0,0,0,0.6)",
                  borderRadius: 30,
                  paddingVertical: 8,
                  paddingHorizontal: 14,
                },
                layout.fit_height,
              ]}
              onPress={toggleCameraType}
            >
              <Text style={[colors.white]}>Flip Camera</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={[
              {
                width: 50,
                height: 50,
                borderRadius: 25,
                backgroundColor: "white",
                justifyContent: "center",
                alignItems: "center",
              },
            ]}
            onPress={takePicture}
          >
            <Ionicons name="camera-outline" size={25} style={[colors.black]} />
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  );
}
export function AsyncImage({ path, width, height, radius }) {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const newPath = `${
      !path.startsWith("Images/") && !path.startsWith("Stock/") ? "Images/" : ""
    }${path}`;

    var storageRef = ref(storage, newPath);
    if (path === "") {
      storageRef = ref(storage, "Stock/abstract.jpg");
    }
    // console.log(path)
    getDownloadURL(storageRef)
      .then((url) => {
        // Image has been successfully loaded
        setImageUrl(url);
      })
      .catch((error) => {
        // Handle any errors
        console.error("Error loading image:", error);
        getDownloadURL(ref(storage, "Stock/abstract.jpg")).then((url) => {
          setImageUrl(url);
        });
      })
      .finally(() => {
        // Update loading state when the operation is complete
        setLoading(false);
      });
  }, [path]);

  return (
    <View style={[layout.relative]}>
      {loading ? (
        <View
          style={[
            {
              width: width !== undefined ? width : 100,
              height: height !== undefined ? height : 100,
              backgroundColor: "rgba(255,255,255,0.1)",
              borderRadius: radius !== undefined ? radius : 10,
            },
            layout.separate_vertical,
          ]}
        >
          <View></View>
          <ActivityIndicator />
          <View></View>
        </View>
      ) : (
        <Image
          source={{ uri: imageUrl }}
          style={{
            width: width !== undefined ? width : 100,
            height: height !== undefined ? height : 100,
            borderRadius: radius !== undefined ? radius : 10,
          }}
          resizeMode="cover"
          onLoadStart={() => setImageLoaded(false)} // Set imageLoaded to false when loading starts
          onLoad={() => setImageLoaded(true)} // Set imageLoaded to true when the image has finished loading
        />
      )}
      {!imageLoaded && (
        <View
          style={[
            {
              width: width !== undefined ? width : 100,
              height: height !== undefined ? height : 100,
              backgroundColor: "rgba(255,255,255,0.1)",
              borderRadius: radius !== undefined ? radius : 10,
            },
            layout.separate_vertical,
            layout.absolute,
          ]}
        >
          <View></View>
          <ActivityIndicator />
          <View></View>
        </View>
      )}
    </View>
  );
}
export function AsyncImagesView({ paths, radius, styles }) {
  const [currentPage, setCurrentPage] = useState(0);
  const total = paths.length;

  const handlePageSelected = (event) => {
    const { position } = event.nativeEvent;
    setCurrentPage(position);
    if (onPageSelected) {
      onPageSelected(position);
    }
  };

  useEffect(() => {
    // console.log(paths);
  }, []);

  return (
    <View style={{ height: "100%" }}>
      <PagerView
        style={[styles, { height: "100%" }]}
        onPageSelected={handlePageSelected}
      >
        {paths.map((path, i) => (
          <View key={i}>
            <AsyncImage
              path={path}
              width={"100%"}
              height={"100%"}
              radius={radius !== undefined ? radius : 10}
            />
          </View>
        ))}
      </PagerView>
      {paths.length > 1 && (
        <View style={[layout.absolute, { right: 10, bottom: 10 }]}>
          <BlurWrapper intensity={80}>
            <Text
              style={[
                colors.white,
                { fontSize: 10, paddingVertical: 4, paddingHorizontal: 8 },
              ]}
            >
              {currentPage + 1}/{total}
            </Text>
          </BlurWrapper>
        </View>
      )}
    </View>
  );
}
export function Map({
  coordsArray,
  delta,
  height,
  radius,
  markerSize,
  func,
  scrollEnabled = true,
}) {
  // Default location for the app's headquarters
  const defaultLocation = {
    latitude: 37.7749, // Default latitude
    longitude: -122.4194, // Default longitude
  };

  useEffect(() => {}, []);

  const getMapRegion = () => {
    if (coordsArray.length === 0) {
      return {
        latitude: defaultLocation.latitude,
        longitude: defaultLocation.longitude,
        latitudeDelta: delta !== undefined ? delta : 0.005,
        longitudeDelta: delta !== undefined ? delta : 0.005,
      };
    }

    let minX = coordsArray[0].latitude;
    let maxX = coordsArray[0].latitude;
    let minY = coordsArray[0].longitude;
    let maxY = coordsArray[0].longitude;

    coordsArray.forEach((coord) => {
      minX = Math.min(minX, coord.latitude);
      maxX = Math.max(maxX, coord.latitude);
      minY = Math.min(minY, coord.longitude);
      maxY = Math.max(maxY, coord.longitude);
    });

    const midX = (minX + maxX) / 2;
    const midY = (minY + maxY) / 2;
    const latitudeDistance = maxX - minX;
    const longitudeDistance = maxY - minY;
    const padding = Math.max(latitudeDistance, longitudeDistance) * 0.2; // 10% of the larger distance as padding
    const deltaX = latitudeDistance + padding; // Add padding to latitudeDelta
    const deltaY = longitudeDistance + padding; // Add padding to longitudeDelta

    return {
      latitude: midX,
      longitude: midY,
      latitudeDelta: deltaX,
      longitudeDelta: deltaY,
    };
  };

  return (
    <View>
      <MapView
        style={{
          width: "100%",
          height: height !== undefined ? height : 125,
          borderRadius: radius !== undefined ? radius : 10,
        }}
        region={getMapRegion()}
        scrollEnabled={scrollEnabled}
      >
        {coordsArray.map((coords, index) => (
          <TouchableOpacity
            onPress={() => {
              if (func !== undefined) {
                func(coords);
              } else {
                console.log(coords);
              }
            }}
          >
            <Marker
              key={index}
              coordinate={{
                latitude: coords.latitude,
                longitude: coords.longitude,
              }}
            >
              <Image
                source={require("../../assets/marker.png")}
                style={{
                  width: markerSize !== undefined ? markerSize : 45,
                  height: markerSize !== undefined ? markerSize : 45,
                }}
              />
            </Marker>
          </TouchableOpacity>
        ))}
      </MapView>
    </View>
  );
}
export function InteractiveMap({ onMarkerPress, height = 300, initialLat = 47.92165474151632, initialLon = 106.91706877201796 }) {
  const [markerCoords, setMarkerCoords] = useState(null);

  const handleMapPress = (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setMarkerCoords({ latitude, longitude });
    onMarkerPress({ latitude, longitude });
  };

  return (
    <View style={{ height }}>
      <MapView
        style={{ width: "100%", height }}
        onPress={handleMapPress}
        initialRegion={{
          latitude: initialLat, // Default latitude for Ulaanbaatar, Mongolia
          longitude: initialLon, // Default longitude
          latitudeDelta: 0.0722,
          longitudeDelta: 0.0721,
        }}
      >
        {markerCoords && (
          <Marker
            coordinate={markerCoords}
            onPress={() => console.log(markerCoords)}
          >
            <Image
              source={require("../../assets/marker.png")}
              style={{ width: 45, height: 45 }}
            />
          </Marker>
        )}
      </MapView>
    </View>
  );
}
export function LocalNotification({
  icon,
  title,
  message,
  iconColor,
  setToggle,
  radius,
  seconds,
  lightBackgroundColor,
  darkBackgroundColor,
  theme,
}) {
  useEffect(() => {
    console.log("NOTIFICATION START");
    setTimeout(() => {
      setToggle(false);
      console.log("NOTIFICATION ENDED");
    }, (seconds !== undefined ? seconds : 5) * 1000);
  }, []);

  return (
    <View style={[{ zIndex: 2000 }]}>
      <FadeWrapper seconds={1}>
        <TouchableOpacity
          style={[
            layout.absolute,
            layout.margin_horizontal,
            layout.padding,
            {
              top: Platform.OS === "ios" ? 25 : 35,
              right: 0,
              left: 0,
              borderRadius: radius !== undefined ? radius : 10,
              backgroundColor:
                lightBackgroundColor !== undefined &&
                darkBackgroundColor !== undefined
                  ? theme === "light"
                    ? lightBackgroundColor
                    : darkBackgroundColor
                  : secondaryThemedBackgroundColor(theme),
            },
          ]}
          onPress={() => {
            setToggle(false);
          }}
        >
          <View style={[layout.horizontal, { alignItems: "center" }]}>
            <Ionicons
              name={icon !== undefined ? icon : "flash-outline"}
              size={26}
              color={iconColor !== undefined ? iconColor : "red"}
            />
            <View>
              <TextView theme={theme} styles={[format.bold, sizes.small_text]}>
                {title !== undefined ? title : "Everything Bagel"}
              </TextView>
              <TextView theme={theme} styles={[{ width: "85%", fontSize: 14 }]}>
                {message !== undefined
                  ? message
                  : "There are many things to know about the bagel."}
              </TextView>
            </View>
          </View>
        </TouchableOpacity>
      </FadeWrapper>
    </View>
  );
}
export function AudioPlayer({ audioName, audioPath, sliderColor, theme }) {
  const [sound, setSound] = useState();
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const path = audioPath || require("../../assets/AUDIO/sample.mp3");

  function formatTime(milliseconds) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  }
  async function playPauseSound() {
    if (sound) {
      if (isPlaying) {
        console.log("Pausing Sound");
        await sound.pauseAsync();
      } else {
        console.log("Resuming Sound");
        await sound.playAsync();
      }
      setIsPlaying(!isPlaying);
    } else {
      console.log("Loading Sound");
      const { sound, status } = await Audio.Sound.createAsync(path, {
        shouldPlay: true,
      });

      setSound(sound);
      setIsPlaying(true);
      console.log("Playing Sound");

      // Update the duration of the audio
      setDuration(status.durationMillis);

      // Set up a periodic callback to update the position of the slider
      sound.setOnPlaybackStatusUpdate((status) => {
        setPosition(status.positionMillis);

        // Check if audio has finished playing
        if (status.didJustFinish) {
          // Reset position to the beginning
          sound.setPositionAsync(0);
          setPosition(0);
          setIsPlaying(false);
        }
      });
    }
  }
  async function stopSound() {
    if (sound) {
      console.log("Stopping Sound");
      await sound.stopAsync();
      // Reset position to the beginning
      sound.setPositionAsync(0);
      setPosition(0);
      setIsPlaying(false);
    }
  }
  const onSliderValueChange = (value) => {
    if (sound) {
      sound.setPositionAsync(value);
      setPosition(value);
    }
  };
  //
  useEffect(() => {
    return () => {
      if (sound) {
        console.log("Unloading Sound");
        sound.unloadAsync();
      }
    };
  }, [sound]);

  return (
    <View
      style={[
        layout.padding,
        secondaryThemedBackgroundColor(theme),
        format.radius,
      ]}
    >
      <View style={[layout.horizontal, { alignItems: "center" }]}>
        <IconButtonTwo
          theme={theme}
          name={isPlaying ? "pause" : "play"}
          onPress={playPauseSound}
          size={24}
        />
        <IconButtonTwo
          name="stop"
          onPress={stopSound}
          size={24}
          theme={theme}
        />
        <TextView theme={theme} styles={[sizes.small_text]}>
          {audioName !== undefined ? audioName : "Hello, Bagel"}
        </TextView>
      </View>
      <Spacer height={5} />
      <View style={[layout.horizontal, { alignItems: "center" }]}>
        <Slider
          style={{ width: "75%", height: 10 }}
          minimumValue={0}
          maximumValue={duration}
          value={position}
          onValueChange={onSliderValueChange}
          minimumTrackTintColor={
            sliderColor !== undefined ? sliderColor : "#1BA8FF"
          }
        />
        <TextView theme={theme}>{`${formatTime(position)} / ${formatTime(
          duration
        )}`}</TextView>
      </View>
    </View>
  );
}
export function VideoPlayer({
  videoRef = null,
  videoPath,
  radius,
  autoPlay = false,
  autoLoop = false,
  noControls = false,
  width = "100%",
  height = 300,
  startTime = "00:00",
}) {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadStart = () => {
    setIsLoading(true);
  };

  const handleLoad = async () => {
    console.log("THE VIDEO IS LOADED");
    setIsLoading(false);
    if (autoPlay) {
      await videoRef.current.playAsync();
    }
    if (startTime !== "00:00") {
      await videoRef.current.setPositionAsync(parseTime(startTime) * 1000);
    }
  };

  const parseTime = (timeString) => {
    const [minutes, seconds] = timeString
      .split(":")
      .map((str) => parseInt(str, 10));
    return minutes * 60 + seconds;
  };

  useEffect(() => {
    const loadVideo = async () => {
      try {
        if (typeof videoPath === "string") {
          // If videoPath is a string, assume it's a URI
          await videoRef.current.loadAsync({ uri: videoPath }, {}, false);
        } else {
          // If videoPath is not a string, assume it's a local require statement
          await videoRef.current.loadAsync(videoPath, {}, false);
        }
      } catch (error) {
        console.error("Error loading video:", error);
      }
    };

    loadVideo();
  }, [videoPath]);

  return (
    <View>
      <Video
        style={{
          width: width,
          height: height,
          borderRadius: radius !== undefined ? radius : 10,
        }}
        ref={videoRef}
        useNativeControls={!noControls}
        resizeMode="contain"
        isLooping={autoLoop}
        onLoadStart={handleLoadStart}
        onLoad={handleLoad}
      />
      {isLoading && (
        <View
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.3)",
            borderRadius: 10,
          }}
        >
          <ActivityIndicator size="large" color="white" />
        </View>
      )}
    </View>
  );
}
export function ClockView({
  isActive,
  setSeconds,
  seconds,
  textSize,
  styles,
  theme,
}) {
  const timerRef = useRef(null);

  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isActive, setSeconds]);

  const formatTime = (timeInSeconds) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(2, "0")}`;
  };

  return (
    <View>
      <TextView
        theme={theme}
        styles={[styles, { fontSize: textSize !== undefined ? textSize : 14 }]}
      >
        {formatTime(seconds)}
      </TextView>
    </View>
  );
}
export function TimerView({
  textSize,
  iconSize,
  theme,
  startHour = 0,
  startMinute = 1,
  startSecond = 0,
  onTimerEnd = () => {
    console.log("FINISHED");
  },
}) {
  let adjustedStartHour = startHour;
  let adjustedStartMinute = startMinute;

  if (adjustedStartMinute >= 60) {
    adjustedStartHour += Math.floor(adjustedStartMinute / 60);
    adjustedStartMinute %= 60;
  }

  const [currentHour, setCurrentHour] = useState(adjustedStartHour);
  const [currentMinute, setCurrentMinute] = useState(adjustedStartMinute);
  const [currentSecond, setCurrentSecond] = useState(startSecond);
  const [isActive, setIsActive] = useState(false);
  const timerRef = useRef(null);

  const resetTimer = () => {
    setCurrentHour(adjustedStartHour);
    setCurrentMinute(adjustedStartMinute);
    setCurrentSecond(startSecond);
    clearInterval(timerRef.current);
  };

  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        if (currentSecond > 0) {
          setCurrentSecond((prevSecond) => prevSecond - 1);
        } else {
          if (currentMinute > 0) {
            setCurrentMinute((prevMinute) => prevMinute - 1);
            setCurrentSecond(59);
          } else {
            if (currentHour > 0) {
              setCurrentHour((prevHour) => prevHour - 1);
              setCurrentMinute(59);
              setCurrentSecond(59);
            } else {
              clearInterval(timerRef.current);
              onTimerEnd();
            }
          }
        }
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isActive, currentHour, currentMinute, currentSecond, onTimerEnd]);

  const formatTime = (hours, minutes, seconds) => {
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(2, "0")}`;
  };

  return (
    <View>
      <TextView
        size={textSize !== undefined ? textSize : 26}
        theme={theme}
        center={true}
      >
        {formatTime(currentHour, currentMinute, currentSecond)}
      </TextView>
      <View style={[layout.center]}>
        <SideBySide>
          {!isActive && (
            <IconButtonOne
              name={"play"}
              theme={theme}
              size={iconSize !== undefined ? iconSize : 26}
              onPress={() => {
                setIsActive(true);
              }}
            />
          )}
          {isActive && (
            <IconButtonOne
              name={"pause"}
              theme={theme}
              size={iconSize !== undefined ? iconSize : 26}
              onPress={() => {
                setIsActive(false);
              }}
            />
          )}
          <IconButtonOne
            name={"square"}
            theme={theme}
            size={iconSize !== undefined ? iconSize : 26}
            onPress={() => {
              resetTimer();
              setIsActive(false);
            }}
          />
        </SideBySide>
      </View>
    </View>
  );
}
export function BarGraphView({
  stats,
  barWidth,
  barRadius,
  graphHeight,
  showValue = true,
  showHeading = true,
  textSize,
  gap,
  theme,
}) {
  const maxValue = Math.max(...stats.map((stat) => stat.Value));

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View
        style={{
          flexDirection: "row",
          padding: 16,
          height: graphHeight !== undefined ? graphHeight : height * 0.3,
          gap: gap !== undefined ? gap : 8,
        }}
      >
        {stats.map((stat, index) => (
          <View key={index} style={{ alignItems: "center" }}>
            <TextView
              theme={theme}
              styles={{
                fontSize: textSize !== undefined ? textSize : 14,
                marginBottom: 4,
              }}
            >
              {showValue ? stat.Value : ""}
            </TextView>
            <View
              style={{
                backgroundColor: `${
                  stat.Color !== undefined ? stat.Color : "#1BA8FF"
                }`,
                width: barWidth !== undefined ? barWidth : 40,
                height: (stat.Value / maxValue) * 70 + "%",
                marginTop: "auto", // Align at the bottom
                borderRadius: barRadius !== undefined ? barRadius : 8,
              }}
            />
            <TextView
              theme={theme}
              styles={{
                fontSize: textSize !== undefined ? textSize : 14,
                marginTop: 8,
              }}
            >
              {showHeading ? stat.Heading : ""}
            </TextView>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
export function ProgressBar({
  progress,
  radius,
  color,
  lightBackgroundColor,
  darkBackgroundColor,
  height,
  limit,
  theme,
}) {
  const normalizedProgress = Math.min(100, Math.max(0, progress)); // Ensure progress is within the range 0-100

  const normalizedLimit = limit !== undefined ? limit : 100;
  const normalizedWidth = (normalizedProgress / normalizedLimit) * 100;

  return (
    <View
      style={{
        height: height !== undefined ? height : 8,
        width: "100%",
        backgroundColor:
          lightBackgroundColor !== undefined &&
          darkBackgroundColor !== undefined
            ? theme === "light"
              ? lightBackgroundColor
              : darkBackgroundColor
            : secondaryThemedBackgroundColor(theme),
        borderRadius: radius !== undefined ? radius : 6,
        overflow: "hidden",
      }}
    >
      <View
        style={{
          height: "100%",
          width: `${normalizedWidth}%`,
          backgroundColor: color !== undefined ? color : "#1BA8FF",
          borderRadius: radius !== undefined ? radius : 6,
        }}
      ></View>
    </View>
  );
}
export function ProgressCircle({
  progress,
  limit,
  color,
  strokeWidth,
  width,
  theme,
}) {
  const normalizedProgress = Math.min(100, Math.max(0, progress)); // Ensure progress is within the range 0-100
  const radius = width !== undefined ? width / 2 - (width / 2) * 0.2 : 15; // Fixed radius assuming default width of 40
  const circumference = 2 * Math.PI * radius;
  const progressOffset =
    (((limit !== undefined ? limit : 100) - normalizedProgress) /
      (limit !== undefined ? limit : 100)) *
    circumference;

  const svgWidth = width !== undefined ? width : 40;
  const center = svgWidth / 2;

  return (
    <View style={[layout.padding]}>
      <Svg
        width={svgWidth}
        height={svgWidth}
        viewBox={`0 0 ${svgWidth} ${svgWidth}`}
        style={{ transform: [{ rotate: "-90deg" }] }}
      >
        <Circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={secondaryThemedBackgroundColor(theme)}
          strokeWidth={strokeWidth !== undefined ? strokeWidth : 6}
        />
        <Circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={color !== undefined ? color : "#1BA8FF"}
          strokeWidth={strokeWidth !== undefined ? strokeWidth : 6}
          strokeDasharray={circumference}
          strokeDashoffset={progressOffset}
        />
      </Svg>
    </View>
  );
}
export function ImagesView({ images, styles, onPageSelected }) {
  const [currentPage, setCurrentPage] = useState(0);
  const total = images.length;

  const handlePageSelected = (event) => {
    const { position } = event.nativeEvent;
    setCurrentPage(position);
    if (onPageSelected !== undefined) {
      onPageSelected(position);
    }
  };

  return (
    <View style={{ height: "100%" }}>
      <PagerView
        style={[{ height: "100%" }]}
        onPageSelected={handlePageSelected}
      >
        {images.map((img, i) => (
          <View key={i}>
            <Image
              source={img}
              style={[styles, { width: "100%", height: "100%" }]}
            />
          </View>
        ))}
      </PagerView>
      <View style={[layout.absolute, { right: 10, bottom: 10 }]}>
        <BlurWrapper intensity={80}>
          <Text
            style={[
              colors.white,
              { fontSize: 10, paddingVertical: 4, paddingHorizontal: 12 },
            ]}
          >
            {currentPage + 1}/{total}
          </Text>
        </BlurWrapper>
      </View>
    </View>
  );
}
export function NotificationCircle({
  text,
  textSize,
  backgroundColor,
  paddingV,
  paddingH,
  children,
}) {
  return (
    <View style={[{ position: "relative" }, layout.fit_width]}>
      <View
        style={[
          {
            position: "absolute",
            top: -14,
            right: -16,
            paddingVertical: paddingV !== undefined ? paddingV : 4,
            paddingHorizontal: paddingH !== undefined ? paddingH : 6,
            backgroundColor:
              backgroundColor !== undefined ? backgroundColor : "#F40202",
            zIndex: 800,
          },
          format.radius_full,
        ]}
      >
        <Text
          style={[
            { fontSize: textSize !== undefined ? textSize : 12 },
            colors.white,
          ]}
        >
          {text !== undefined ? text : "1"}
        </Text>
      </View>
      {children}
    </View>
  );
}
export function SliderCircleView({
  func,
  padding,
  icon,
  iconColor,
  iconSize,
  text,
  textSize,
  circleSize = 40,
  circleColor,
  lightBackgroundColor,
  darkBackgroundColor,
  theme,
}) {
  const [screenWidth, setScreenWidth] = useState(
    Dimensions.get("window").width
  );

  useEffect(() => {
    const handleScreenResize = () => {
      setScreenWidth(Dimensions.get("window").width);
    };

    Dimensions.addEventListener("change", handleScreenResize);

    return () => {
      Dimensions.removeEventListener("change", handleScreenResize);
    };
  }, []);

  const pan = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
      useNativeDriver: false,
    }),
    onPanResponderRelease: (_, gesture) => {
      // Check if the circle has reached the end (right edge of the screen)
      const endPositionX = screenWidth - circleSize;
      if (gesture.moveX >= endPositionX) {
        // Trigger the function when the circle reaches the end
        if (func !== undefined) {
          func();
        } else {
          console.log("TRIGGERED");
        }
      }

      // Reset the position of the circle to the starting position
      Animated.spring(pan, {
        toValue: { x: 0, y: 0 },
        useNativeDriver: false,
      }).start();
    },
  });

  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        height: circleSize + (padding !== undefined ? padding : 10), // Set the height of the container to the size of the circle
        backgroundColor:
          lightBackgroundColor !== undefined &&
          darkBackgroundColor !== undefined
            ? theme === "light"
              ? lightBackgroundColor
              : darkBackgroundColor
            : secondaryThemedBackgroundColor(theme),
        borderRadius: 100, // Set borderRadius based on circleSize
        position: "relative", // Added to position the icon relative to the container
      }}
    >
      <View style={[layout.absolute, format.center_text]}>
        <TextView
          theme={theme}
          styles={[{ fontSize: textSize !== undefined ? textSize : 16 }]}
        >
          {text !== undefined ? text : "Everything Bagel"}
        </TextView>
      </View>
      <Animated.View
        {...panResponder.panHandlers}
        style={{
          position: "absolute",
          left: 0,
          width: circleSize,
          height: circleSize,
          borderRadius: 100,
          backgroundColor: circleColor !== undefined ? circleColor : "white",
          transform: [{ translateX: pan.x }],
          marginLeft: padding !== undefined ? padding / 2 : 5,
        }}
      >
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          {/* Use your preferred icon component here */}
          <Ionicons
            name={icon !== undefined ? icon : "flash-outline"}
            size={iconSize !== undefined ? iconSize : 24}
            color={iconColor !== undefined ? iconColor : "black"}
          />
        </View>
      </Animated.View>
    </View>
  );
}
export function NumberPad({ setter, value, text, theme, func }) {
  //
  function onTypeNum(num) {
    const thing = `${num}`;
    if (thing !== "back") {
      setter((prev) => `${prev}${thing}`);
    } else {
      if (value.length > 0) {
        // REMOVE CHAR
        setter((prev) => prev.slice(0, -1));
      }
    }
  }
  return (
    <View
      style={[
        layout.absolute,
        {
          bottom: 20,
          right: 0,
          left: 0,
          backgroundColor: themedBackgroundColor(theme),
        },
      ]}
    >
      <View
        style={[
          layout.padding_horizontal,
          layout.padding_vertical_small,
          { backgroundColor: secondaryThemedBackgroundColor(theme) },
        ]}
      >
        <TextView theme={theme} styles={[sizes.small_text]}>
          {text !== undefined ? text : "Enter Number"}
        </TextView>
        <TextView theme={theme} styles={[sizes.xlarge_text, format.bold]}>
          {value}
        </TextView>
      </View>
      <Grid columns={3}>
        <TouchableOpacity
          onPress={() => {
            onTypeNum(1);
          }}
        >
          <View style={[{ padding: 20 }]}>
            <TextView
              theme={theme}
              styles={[sizes.xlarge_text, format.bold, format.center_text]}
            >
              1
            </TextView>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            onTypeNum(2);
          }}
        >
          <View style={[{ padding: 20 }]}>
            <TextView
              theme={theme}
              styles={[sizes.xlarge_text, format.bold, format.center_text]}
            >
              2
            </TextView>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            onTypeNum(3);
          }}
        >
          <View style={[{ padding: 20 }]}>
            <TextView
              theme={theme}
              styles={[sizes.xlarge_text, format.bold, format.center_text]}
            >
              3
            </TextView>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            onTypeNum(4);
          }}
        >
          <View style={[{ padding: 20 }]}>
            <TextView
              theme={theme}
              styles={[sizes.xlarge_text, format.bold, format.center_text]}
            >
              4
            </TextView>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            onTypeNum(5);
          }}
        >
          <View style={[{ padding: 20 }]}>
            <TextView
              theme={theme}
              styles={[sizes.xlarge_text, format.bold, format.center_text]}
            >
              5
            </TextView>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            onTypeNum(6);
          }}
        >
          <View style={[{ padding: 20 }]}>
            <TextView
              theme={theme}
              styles={[sizes.xlarge_text, format.bold, format.center_text]}
            >
              6
            </TextView>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            onTypeNum(7);
          }}
        >
          <View style={[{ padding: 20 }]}>
            <TextView
              theme={theme}
              styles={[sizes.xlarge_text, format.bold, format.center_text]}
            >
              7
            </TextView>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            onTypeNum(8);
          }}
        >
          <View style={[{ padding: 20 }]}>
            <TextView
              theme={theme}
              styles={[sizes.xlarge_text, format.bold, format.center_text]}
            >
              8
            </TextView>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            onTypeNum(9);
          }}
        >
          <View style={[{ padding: 20 }]}>
            <TextView
              theme={theme}
              styles={[sizes.xlarge_text, format.bold, format.center_text]}
            >
              9
            </TextView>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            onTypeNum(".");
          }}
        >
          <View style={[{ padding: 20 }]}>
            <TextView
              theme={theme}
              styles={[sizes.xlarge_text, format.bold, format.center_text]}
            >
              .
            </TextView>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            onTypeNum(0);
          }}
        >
          <View style={[{ padding: 20 }]}>
            <TextView
              theme={theme}
              styles={[sizes.xlarge_text, format.bold, format.center_text]}
            >
              0
            </TextView>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            onTypeNum("back");
          }}
        >
          <View style={[{ padding: 20 }]}>
            <Ionicons
              style={[layout.center]}
              name={"backspace-outline"}
              size={40}
              color={themedTextColor(theme)}
            />
          </View>
        </TouchableOpacity>
      </Grid>
      <View style={[layout.padding_horizontal]}>
        <ButtonOne
          backgroundColor={secondaryThemedBackgroundColor(theme)}
          radius={14}
          padding={10}
          onPress={() => {
            if (func !== undefined) {
              func();
            } else {
              console.log("DONE");
            }
          }}
        >
          <TextView theme={theme} styles={[format.center_text, format.bold]}>
            Done
          </TextView>
        </ButtonOne>
      </View>
    </View>
  );
}
export function QRCodeView({ value, backgroundColor, color, size, theme }) {
  return (
    <View style={{ justifyContent: "center", alignItems: "center" }}>
      <QRCode
        value={
          value !== undefined
            ? value
            : "https://innovativeinternetcreations.com"
        }
        size={size !== undefined ? size : 200}
        bgColor={
          backgroundColor !== undefined
            ? backgroundColor
            : secondaryThemedBackgroundColor(theme)
        }
        fgColor={color !== undefined ? color : "white"}
      />
    </View>
  );
}
export function QRReader({ func, theme }) {
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [scanning, setScanning] = useState(false);
  const [qrValue, setQrValue] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      requestPermission();
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanning(false);
    setQrValue(data);
    if (func !== undefined) {
      func(data);
    } else {
      Alert.alert(data);
    }
  };

  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }
  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: themedBackgroundColor(theme),
        }}
      >
        <TextView theme={theme}>
          We need your permission to show the camera
        </TextView>
        <ButtonTwo borderColor={"#2F70D5"}>
          <TextView theme={theme} styles={[sizes.small_text, colors.blue]}>
            Grant Permission
          </TextView>
        </ButtonTwo>
        <TouchableOpacity
          onPress={() => {
            requestPermission();
            console.log("GRANTED");
            // setToggle(true);
          }}
        ></TouchableOpacity>
      </View>
    );
  }

  return (
    <View
      style={[
        backgrounds.black,
        layout.absolute,
        { top: 0, right: 0, left: 0, bottom: 0 },
      ]}
    >
      {qrValue === null && (
        <View
          style={[
            backgrounds.black,
            layout.absolute,
            { top: 30, right: 0, left: 0, bottom: 0 },
            layout.full_height,
            layout.full_width,
            layout.padding_vertical,
          ]}
        >
          <View style={[layout.vertical]}>
            <Text style={[colors.white, layout.padding_horizontal]}>
              Scanning for QR Code...
            </Text>
            <Camera
              style={[{ width: width, height: "100%" }]}
              type={Camera.Constants.Type.back}
              onBarCodeScanned={handleBarCodeScanned}
            />
          </View>
        </View>
      )}
    </View>
  );
}
export function PaymentView({ children, total, currency, successFunc, theme }) {
  const [pi, setPi] = useState("");
  const [stripeLoading, setStripeLoading] = useState(true);
  const { initPaymentSheet, presentPaymentSheet } = usePaymentSheet();
  const newTotal = total !== undefined ? total : 1000;
  //
  const fetchPaymentSheetParams = async () => {
    const customerID = me.CustomerID !== undefined ? me.CustomerID : null;
    const response = await fetch(`${serverURL}/test-payment-sheet`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customerId: customerID,
        total: newTotal,
        currency: currency !== undefined ? currency : "usd", // Pass existing CustomerID if available
      }),
    });

    const { paymentIntent, ephemeralKey, customer } = await response.json();
    setPi(`${paymentIntent.split("_")[0]}_${paymentIntent.split("_")[1]}`);

    return {
      paymentIntent,
      ephemeralKey,
      customer,
    };
  };
  const initializePaymentSheet = async () => {
    const { paymentIntent, ephemeralKey, customer } =
      await fetchPaymentSheetParams();
    const { error } = await initPaymentSheet({
      merchantDisplayName: appName,
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
      allowsDelayedPaymentMethods: true,
      // applePay: {
      //   merchantCountryCode: "usd",
      // },
      // googlePay: {
      //   merchantCountryCode: "usd",
      //   testEnv: true,
      //   currencyCode: "usd",
      // },
    });
    if (!error) {
      if (me.CustomerID === undefined) {
        firebase_UpdateDocument(setStripeLoading, "Users", me.id, {
          CustomerID: customer,
        });
      }
      setStripeLoading(false);
    }
  };
  const openPaymentSheet = async () => {
    console.log("HERE");
    const { error } = await presentPaymentSheet();

    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      successFunc(pi);
    }
  };

  useEffect(() => {
    initializePaymentSheet();
  }, []);

  return (
    <StripeProvider
      publishableKey={stripePublishableKey}
      merchantIdentifier={`iicdev.com.${appName}`}
    >
      <View>
        {!stripeLoading && (
          <Pressable onPress={openPaymentSheet}>{children}</Pressable>
        )}
        {stripeLoading && <ActivityIndicator color={themedTextColor(theme)} />}
      </View>
    </StripeProvider>
  );
}
export function ModalView({ children, radius, width, setToggle, theme }) {
  return (
    <View
      style={[
        layout.separate_vertical,
        layout.absolute,
        {
          top: 0,
          right: 0,
          left: 0,
          right: 0,
          bottom: 0,
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.6)",
        },
      ]}
    >
      <View style={[layout.absolute, { top: 40, right: 10 }]}>
        <IconButtonOne
          theme={theme}
          lightColor={"white"}
          darkColor={"white"}
          name={"close-outline"}
          onPress={() => {
            setToggle(false);
          }}
          size={40}
        />
      </View>
      <View></View>
      <View style={[layout.separate_horizontal]}>
        <View></View>
        <View
          style={[
            {
              borderRadius: radius !== undefined ? radius : 14,
              width: width !== undefined ? width : "80%",
              backgroundColor: themedBackgroundColor(theme),
            },
          ]}
        >
          {children}
        </View>
        <View></View>
      </View>
      <View></View>
    </View>
  );
}
export function SmallBubble({
  icon,
  iconSize,
  text,
  textSize,
  paddingV,
  paddingH,
  seconds,
  setToggle,
  theme,
}) {
  useEffect(() => {
    setTimeout(
      () => {
        setToggle(false);
      },
      seconds !== undefined ? seconds * 1000 : 5000
    );
  }, []);

  return (
    <TouchableOpacity
      style={[layout.absolute_bottom_full, { marginBottom: 30 }]}
      onPress={() => {
        setToggle(false);
      }}
    >
      <View
        style={[
          layout.center,
          {
            backgroundColor: secondaryThemedBackgroundColor(theme),
            paddingVertical: paddingV !== undefined ? paddingV : 8,
            paddingHorizontal: paddingH !== undefined ? paddingH : 14,
          },
          format.radius_full,
        ]}
      >
        <SideBySide>
          {icon !== undefined && (
            <Icon
              name={icon}
              size={iconSize !== undefined ? iconSize : 24}
              theme={theme}
            />
          )}
          <TextView theme={theme} size={textSize !== undefined ? textSize : 14}>
            {text !== undefined ? text : "Hello, Bagel"}
          </TextView>
        </SideBySide>
      </View>
    </TouchableOpacity>
  );
}
export function OptionsView({ options, setToggle, theme }) {
  return (
    <View
      style={[
        layout.absolute,
        {
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
        },
        layout.separate_vertical,
      ]}
    >
      <View></View>
      <View>
        <View
          style={[
            { backgroundColor: secondaryThemedBackgroundColor(theme) },
            format.radius,
            layout.margin_horizontal,
          ]}
        >
          {/* OPTIONS HERE */}
          {options.map((opt, i) => (
            <React.Fragment key={i}>
              <TouchableOpacity style={[layout.padding]} onPress={opt.Func}>
                <SideBySide gap={20}>
                  <Icon
                    theme={theme}
                    name={opt.Icon !== undefined ? opt.Icon : "flash-outline"}
                    size={20}
                    lightColor={
                      opt.Color !== undefined
                        ? opt.Color
                        : themedTextColor(theme)
                    }
                    darkColor={
                      opt.Color !== undefined
                        ? opt.Color
                        : themedTextColor(theme)
                    }
                  />
                  <View>
                    <TextView
                      size={15}
                      theme={theme}
                      color={
                        opt.Color !== undefined
                          ? opt.Color
                          : themedTextColor(theme)
                      }
                    >
                      {opt.Option}
                    </TextView>
                    {opt.Text !== undefined && (
                      <TextView
                        size={13}
                        color={secondaryThemedTextColor(theme)}
                        theme={theme}
                      >
                        {opt.Text}
                      </TextView>
                    )}
                  </View>
                </SideBySide>
              </TouchableOpacity>
              {i !== options.length - 1 && (
                <View
                  style={{
                    borderBottomWidth: 1,
                    borderBottomColor: "rgba(0,0,0,0.1)",
                  }}
                />
              )}
            </React.Fragment>
          ))}
        </View>

        <Spacer height={15} />
        <Pressable
          onPress={() => {
            setToggle(false);
          }}
          style={[layout.center]}
        >
          <TextPill theme={theme} paddingH={22} paddingV={8} text={"Cancel"} />
        </Pressable>
        <Spacer height={30} />
      </View>
    </View>
  );
}
export function CalendarView({
  year,
  radius,
  weekdays,
  isAllDays = true,
  includeToday = true,
  disabledFunc,
  theme,
}) {
  const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  let filteredMonths = [...months]; // Copy the original months array

  if (year === currentYear) {
    filteredMonths = months.filter((month) => {
      const monthNumber = months.indexOf(month) + 1;
      return monthNumber >= currentMonth;
    });
  }

  return (
    <ScrollView showsVerticalScrollIndicator={true}>
      <View style={[]}>
        {filteredMonths.map((month, i) => (
          <View key={i} style={[layout.padding_vertical_small]}>
            <TextPill theme={theme} text={monthNumToLong(month)} />
            <View style={[layout.padding_vertical_small]}>
              <View style={[layout.padding_vertical_small]}>
                <Grid columns={7}>
                  {["S", "M", "T", "W", "T", "F", "S"]
                    .slice(0, 7)
                    .map((day, index) => (
                      <TextView
                        key={index}
                        theme={theme}
                        color={secondaryThemedTextColor(theme)}
                        size={12}
                        styles={[format.center_text]}
                      >
                        {day}
                      </TextView>
                    ))}
                </Grid>
              </View>
              <Grid columns={7}>
                {emptyArray(getFirstDateOfMonth(month, year)).map(
                  (thing, t) => {
                    return <View key={t}></View>;
                  }
                )}
                {getDaysOfMonth(month, year).map((day, j) => {
                  //  #region LOGIC
                  const date = createDate(month, day, year);
                  const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, ...
                  // HIGHLIGHTED TRUTH ************************************************
                  const isHighlighted =
                    (weekdays === undefined &&
                      (!isAllDays ? compareDates(date, new Date()) : true) &&
                      (disabledFunc !== undefined
                        ? disabledFunc(date)
                        : true)) ||
                    (weekdays !== undefined &&
                      weekdays.includes(dayOfWeek) &&
                      (!isAllDays ? compareDates(date, new Date()) : true) &&
                      (disabledFunc !== undefined
                        ? disabledFunc(date)
                        : true)) ||
                    (checkDate(date, new Date()) &&
                      (includeToday ? true : false));
                  //  #endregion
                  return (
                    <TouchableOpacity
                      key={j}
                      disabled={isHighlighted ? false : true}
                      style={[
                        layout.padding,
                        {
                          backgroundColor: isHighlighted
                            ? secondaryThemedBackgroundColor(theme)
                            : "transparent",
                          borderRadius: radius !== undefined ? radius : 0,
                        },
                      ]}
                    >
                      <TextView
                        theme={theme}
                        size={16}
                        color={
                          isHighlighted
                            ? themedTextColor(theme)
                            : secondaryThemedTextColor(theme)
                        }
                        styles={[format.center_text]}
                      >
                        {day}
                      </TextView>
                    </TouchableOpacity>
                  );
                })}
              </Grid>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

// BASIC FUNCTIONS
export async function copyToClipboard(text, func) {
  await Clipboard.setStringAsync(text).then(() => {
    if (func !== undefined) {
      func();
    } else {
      console.log("COPIED");
    }
  });
}
export async function pasteFromClipboard() {
  const text = await Clipboard.getStringAsync();
  return text;
}
export function randomString(length) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}
export function shuffleString(str) {
  const array = str.split("");
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array.join("");
}
export function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
export function getRandomNumberWithLength(length) {
  let min = Math.pow(10, length - 1);
  let max = Math.pow(10, length) - 1;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
export function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
export function emptyArray(length) {
  return Array.from({ length });
}
export function getMaxArr(arr) {
  return Math.max(...arr);
}
export function getMaxArrObj(arr, property) {
  return Math.max(...arr.map((obj) => obj[property]));
}
export function getMinArr(arr) {
  return Math.min(...arr);
}
export function getMinArrObj(arr, property) {
  return Math.min(...arr.map((obj) => obj[property]));
}
export function filterArr(array, property, value) {
  return array.filter((item) => item[property] === value);
}
export function filterArrayMultiple(array, filters) {
  // property, value
  return array.filter((item) =>
    filters.every((filter) => item[filter.property] === filter.value)
  );
}
export function reduceArray(array, property) {
  return array.reduce(
    (total, item) => total + parseFloat(item[property] || 0),
    0
  );
}
export function removeDuplicates(array) {
  const seen = new Set();
  return array.filter((item) => {
    if (seen.has(item)) {
      return false;
    } else {
      seen.add(item);
      return true;
    }
  });
}
export function removeDuplicatesByProperty(array, property) {
  const seen = new Set();
  return array.filter((item) => {
    const value = item[property];
    if (seen.has(value)) {
      return false;
    } else {
      seen.add(value);
      return true;
    }
  });
}
export function shuffleArray(array) {
  let currentIndex = array.length,
    temporaryValue,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}
export function sortArray(arr, order) {
  if (order === "asc") {
    return arr.slice().sort((a, b) => a - b);
  } else if (order === "desc") {
    return arr.slice().sort((a, b) => b - a);
  } else {
    throw new Error('Invalid sort order. Use "asc" or "desc".');
  }
}
export function sortObjectArray(arr, order, property) {
  return arr.sort((a, b) => {
    if (order === "asc") {
      if (a[property] < b[property]) return -1;
      if (a[property] > b[property]) return 1;
      return 0;
    } else if (order === "desc") {
      if (a[property] > b[property]) return -1;
      if (a[property] < b[property]) return 1;
      return 0;
    } else {
      throw new Error('Invalid sort order. Use "asc" or "desc".');
    }
  });
}
export function createDate(month, day, year) {
  return new Date(year, month - 1, day);
}
export function formatDate(date) {
  const tempDate = date;

  const formattedDate = tempDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  return formattedDate;
}
export function formatTime(date) {
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0"); // Ensure two digits for minutes
  const period = hours >= 12 ? "PM" : "AM";
  const formattedHours = (hours % 12 || 12).toString().padStart(2, "0"); // Convert to 12-hour format

  return `${formattedHours}:${minutes} ${period}`;
}
export function formatLongDate(date) {
  const tempDate = date;

  const formattedDate = tempDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return formattedDate;
}
export function formatDateTime(date) {
  const tempDate = date;

  const formattedDateTime = `${tempDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })} ${tempDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  })}`;

  return formattedDateTime;
}
export function createDateFromMonthDayYear(longMonth, day, year) {
  const monthIndex = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ].indexOf(longMonth);
  return new Date(year, monthIndex, day);
}
export function compareDates(date1, date2) {
  const timestamp1 = date1 instanceof Date ? date1.getTime() : NaN;
  const timestamp2 = date2 instanceof Date ? date2.getTime() : NaN;

  if (isNaN(timestamp1) || isNaN(timestamp2)) {
    throw new Error("Invalid date format");
  }

  return timestamp1 > timestamp2;
}
export function compareHours(date1, date2) {
  const hours1 = date1 instanceof Date ? date1.getHours() : NaN;
  const hours2 = date2 instanceof Date ? date2.getHours() : NaN;

  if (isNaN(hours1) || isNaN(hours2)) {
    throw new Error("Invalid date format");
  }

  return hours1 > hours2;
}
export function checkDate(date, checkedDate) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0); // Set to 00:00:00.000

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999); // Set to 23:59:59.999

  return checkedDate >= startOfDay && checkedDate <= endOfDay;
}
export function checkHours(hour, startHour, endHour) {
  return hour >= startHour && hour <= endHour;
}
export function checkTime(time, startTime, endTime) {
  const [startHour, startMinute] = startTime.split(":").map(Number);
  const [endHour, endMinute] = endTime.split(":").map(Number);
  const [hour, minute] = time.split(":").map(Number);

  const startTotalMinutes = startHour * 60 + startMinute;
  const endTotalMinutes = endHour * 60 + endMinute;
  const totalMinutes = hour * 60 + minute;

  return totalMinutes >= startTotalMinutes && totalMinutes <= endTotalMinutes;
}
export function getDaysOfMonth(monthNum, year) {
  const daysInMonth = new Date(year, monthNum, 0).getDate();
  return Array.from({ length: daysInMonth }, (_, i) => i + 1);
}
export function monthNumToLong(monthNum) {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return monthNames[monthNum - 1];
}
export function monthLongtoNum(monthStr) {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return monthNames.indexOf(monthStr) + 1;
}
export function getFirstDateOfMonth(monthNum, year) {
  const firstDate = new Date(year, monthNum - 1, 1);
  const dayOfWeek = firstDate.getDay();
  return dayOfWeek;
}
export function dateToHHMM(date) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
export function dateToTime24(date) {
  const hours = date.getHours();
  const minutes = date.getMinutes();

  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
}
export function HHMMtoDate(timeString) {
  const [time, period] = timeString.split(" "); // Split the time string into time and period (AM/PM)
  let [hours, minutes] = time.split(":"); // Split the time into hours and minutes
  hours = parseInt(hours, 10); // Parse hours as an integer
  minutes = parseInt(minutes, 10); // Parse minutes as an integer

  // Adjust hours for PM if necessary
  if (period === "PM" && hours < 12) {
    hours += 12;
  }

  // Create a new Date object with the adjusted hours and minutes
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);

  return date;
}
export async function getDistanceInMiles(coords1, coords2) {
  const apiKey = c_googleMapsAPI;
  const apiUrl = "https://maps.googleapis.com/maps/api/distancematrix/json";

  const origin = `${coords1.latitude},${coords1.longitude}`;
  const destination = `${coords2.latitude},${coords2.longitude}`;
  const requestUrl = `${apiUrl}?origins=${origin}&destinations=${destination}&key=${apiKey}`;

  console.log("Request URL:", requestUrl);

  try {
    const response = await fetch(requestUrl);
    const data = await response.json();

    console.log("API Response:", data);

    if (
      data.status === "OK" &&
      data.rows.length > 0 &&
      data.rows[0].elements.length > 0
    ) {
      const distanceInMeters = data.rows[0].elements[0].distance.value;
      const distanceInMiles = (distanceInMeters * 0.000621371).toFixed(2);
      console.log(distanceInMiles);
      return distanceInMiles;
    } else {
      throw new Error("Error fetching distance data");
    }
  } catch (error) {
    console.error("Error:", error.message);
    throw error;
  }
}
export async function getDistanceInKilometers(coords1, coords2) {
  const apiKey = c_googleMapsAPI;
  const apiUrl = "https://maps.googleapis.com/maps/api/distancematrix/json";

  const origin = `${coords1.latitude},${coords1.longitude}`;
  const destination = `${coords2.latitude},${coords2.longitude}`;

  try {
    const response = await fetch(
      `${apiUrl}?origins=${origin}&destinations=${destination}&key=${apiKey}`
    );

    const data = await response.json();

    if (
      data.status === "OK" &&
      data.rows.length > 0 &&
      data.rows[0].elements.length > 0
    ) {
      const distanceInMeters = data.rows[0].elements[0].distance.value;
      const distanceInKilometers = (distanceInMeters / 1000).toFixed(2);
      return distanceInKilometers;
    } else {
      throw new Error("Error fetching distance data");
    }
  } catch (error) {
    console.error("Error:", error.message);
    throw error;
  }
}
export function separateKeys(inputArray) {
  const resultArray = [];

  inputArray.forEach((obj) => {
    // Iterate through each key in the object
    Object.keys(obj).forEach((key) => {
      // Create a new object with a single key
      const newObj = { [key]: obj[key] };
      // Add the new object to the result array
      resultArray.push(newObj);
    });
  });

  return resultArray;
}
export function createGeohash(latitude, longitude) {
  // Generate a geohash from latitude and longitude
  const geohash = ngeohash.encode(latitude, longitude, 10);

  return geohash;
}
export function convertToPrecision10(geohash) {
  // Ensure the geohash is at least 10 characters long
  while (geohash.length < 10) {
    geohash += "0";
  }

  // Trim extra characters if the geohash is longer than 10 characters
  return geohash.substring(0, 10);
}
export function ensurePrecision10(geohash) {
  // Ensure the geohash has at least 10 characters
  while (geohash.length < 10) {
    geohash += "0";
  }

  return geohash;
}
export function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c; // Distance in kilometers

  return distance;
}
export async function setInDevice(key, value) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("Error storing data:", error);
  }
}
export async function getInDevice(key, setter) {
  try {
    const value = await AsyncStorage.getItem(key);
    setter(value ? JSON.parse(value) : null);
  } catch (error) {
    console.error("Error getting data:", error);
    return null;
  }
}
export async function removeInDevice(key) {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error("Error removing data:", error);
  }
}
export function hexToRgb(hex) {
  // Remove the '#' at the beginning, if it exists
  hex = hex.replace("#", "");

  // Convert the hex color to RGB
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Return the RGB color as a string
  return `rgb(${r}, ${g}, ${b})`;
}
export function hexToRgbObj(hex) {
  // Remove the '#' at the beginning, if it exists
  hex = hex.replace("#", "");

  // Convert the hex color to RGB
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Return the RGB color as an object
  return { r, g, b };
}
export function rgbToHex(r, g, b) {
  // Convert each component to hexadecimal and concatenate them
  const hexR = r.toString(16).padStart(2, "0");
  const hexG = g.toString(16).padStart(2, "0");
  const hexB = b.toString(16).padStart(2, "0");

  return `#${hexR}${hexG}${hexB}`;
}

// CONVERSION FUNCTIONS
export function milesToLat(miles) {
  return miles / 69.172; // Approximate degrees of latitude per mile
}
export function milesToLon(miles, longitude) {
  const milesPerDegreeLon = 69.172 * Math.cos(longitude * (Math.PI / 180));
  return miles / milesPerDegreeLon;
}
export function kmToLat(km) {
  return km / 110.574;
}
export function kmToLon(km, latitude) {
  const kmPerDegreeLon = 111.32 * Math.cos(latitude * (Math.PI / 180));
  return km / kmPerDegreeLon;
}
export function fahrenheitToCelsius(fahrenheit) {
  return (5 / 9) * (fahrenheit - 32);
}
export function celsiusToFahrenheit(celsius) {
  return (9 / 5) * celsius + 32;
}

// FUNCTIONS
export async function function_NotificationsSetup(userID) {
  try {
    // Always request notification permissions
    const { status } = await Notifications.requestPermissionsAsync();

    if (status === "denied") {
      Alert.alert(
        "Permission Required",
        "Push notifications are required for this app. Please enable notifications in your device settings."
      );

      // Optionally provide a button to open device settings
      Alert.alert(
        "Enable Notifications",
        "To receive notifications, go to your device settings and enable notifications for this app.",
        [
          {
            text: "Open Settings",
            onPress: () => Linking.openSettings(),
          },
        ]
      );

      return;
    }

    // Force generation of a new push token
    Notifications.addNotificationReceivedListener((notification) => {
      console.log("Notification received while app is open:", notification);
      // Handle the notification as needed
    });
    const pushTokenData = await Notifications.getExpoPushTokenAsync({
      projectId: c_projectID,
    });
    console.log(pushTokenData);
    firebase_UpdateToken(pushTokenData.data, userID);
    myToken = pushTokenData.data;

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.DEFAULT,
      });
    }
  } catch (error) {
    console.error("Error requesting notification permissions:", error);
  }
}
export function sendPushNotification(token, title, body) {
  fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      to: token,
      title: title,
      body: body,
    }),
  });
}
export async function function_PickImage(setLoading, setImage, func) {
  // No permissions request is necessary for launching the image library
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.All,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
  });

  console.log(result);

  if (!result.canceled) {
    setLoading(false);
    setImage(result.assets[0].uri);
    func(result.assets[0].uri);
  }
}
export async function function_PickImageWithParams(
  setLoading,
  setImage,
  func,
  returnParams
) {
  // No permissions request is necessary for launching the image library
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.All,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
  });

  console.log(result);

  if (!result.canceled) {
    setLoading(false);
    setImage(result.assets[0].uri);
    func(result.assets[0].uri, returnParams);
  }
}
export async function function_PickImageToArr(
  setLoading,
  setImages,
  setImage,
  multiple,
  func
) {
  // No permissions request is necessary for launching the image library
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.All,
    allowsMultipleSelection: multiple !== undefined ? multiple : false, // Allow picking multiple images
    aspect: [4, 3],
    quality: 1,
  });

  console.log(result);

  if (!result.cancelled) {
    setLoading(false);
    const newUris = result.assets.map((asset) => asset.uri);
    setImages((prev) => {
      const uniqueUris = newUris.filter((uri) => !prev.includes(uri));
      return [...prev, ...uniqueUris];
    });
    func(newUris);
  }
}
export async function function_GetLocation(setLoading, setLocation) {
  try {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Permission to access location was denied."
      );
      return;
    }

    let userLocation = await Location.getCurrentPositionAsync({});
    setLocation(userLocation);
    setLoading(false);
    console.log(status);
    console.log(userLocation.coords);
    myCoords = userLocation.coords;
  } catch (error) {
    console.error("Error getting location:", error);
    setLoading(false);
  }
}
export function function_GetDirections(lat, lon) {
  const destination = `${lat},${lon}`;
  console.log(destination);
  const url = `https://www.google.com/maps/dir/?api=1&destination=${destination}`;

  Linking.openURL(url).catch((err) =>
    console.error("Error opening Google Maps:", err)
  );
}
export async function function_AddressToLatLon(address, setter, apiKey) {
  const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
    address
  )}&key=${apiKey}`;
  console.log(apiUrl);
  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch. Status: ${response.status}`);
    }

    const data = await response.json();
    if (data.results.length > 0) {
      console.log("HERE WE ARE");
      const location = data.results[0].geometry.location;
      const { lat, lng } = location;
      setter({ latitude: lat, longitude: lng });
    } else {
      throw new Error(`No results found for the given address: ${address}`);
    }
  } catch (error) {
    console.error("Error geocoding address:", error.message);
    throw error;
  }
}
export async function function_SendEmail(toEmails, subject, HTML) {
  try {
    const isAvailable = await MailComposer.isAvailableAsync();
    if (!isAvailable) {
      Alert.alert("Email functionality is not available on this device.");
      return;
    }

    await MailComposer.composeAsync({
      recipients: toEmails,
      subject: subject,
      body: HTML,
      isHtml: true,
    });
  } catch (error) {
    console.error("Error opening email composer:", error);
    Alert.alert("Error", "Failed to open email composer");
  }
}
export async function function_PlaySound(audio) {
  const { sound } = await Audio.Sound.createAsync(audio, { shouldPlay: true });
}
export async function function_PlaySoundFromUrl(
  url,
  soundInstance,
  setSoundInstance,
  isPlaying,
  setIsPlaying
) {
  try {
    if (soundInstance && isPlaying) {
      // If a sound is already playing, stop it
      await soundInstance.stopAsync();
      setSoundInstance(null);
      setIsPlaying(false);
    } else {
      // Create a new sound instance
      const { sound } = await Audio.Sound.createAsync(
        { uri: url },
        { shouldPlay: true }
      );
      setSoundInstance(sound);
      setIsPlaying(true);
    }
  } catch (error) {
    console.error("Error playing sound:", error);
  }
}
export function function_TimedFunction(func, timesPerMinute) {
  const millisecondsPerMinute = 60 * 1000;
  const interval = millisecondsPerMinute / timesPerMinute;

  const executeAtNextInterval = () => {
    const now = Date.now();
    const nextExecution = Math.ceil(now / interval) * interval;
    const delay = nextExecution - now;

    setTimeout(() => {
      func();
      executeAtNextInterval();
    }, delay);
  };

  executeAtNextInterval();

  // Return a function to stop the timer when needed
  return () => clearTimeout(timerId);
}
export async function function_OpenLink(url) {
  try {
    await Linking.openURL(url);
  } catch (error) {
    console.error("An error occurred while opening the link:", error);
  }
}
export async function function_ChooseFile(setter, setterType) {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: [
        "application/pdf",
        "image/*",
        "application/msword",
        "application/vnd.ms-excel",
        "audio/*",
        "video/*",
      ],
    });
    const newResult = result.assets[0];
    const type = result.assets[0].mimeType;
    if (newResult.uri !== undefined) {
      console.log(newResult);
      setter(newResult);
      setterType(type);
    } else {
      // Handle the case where the user cancels the picker or selects an unsupported file type
      console.log("Document picker canceled or unsupported file type");
    }
  } catch (error) {
    console.error("Error picking document:", error);
    // Handle other errors if needed
  }
}
export function function_CallPhoneNumber(phoneNumber) {
  const formattedPhoneNumber = phoneNumber.replace(/[^0-9]/g, ""); // Remove non-numeric characters
  const phoneNumberUrl = `tel:${formattedPhoneNumber}`;

  Linking.canOpenURL(phoneNumberUrl)
    .then((supported) => {
      if (supported) {
        return Linking.openURL(phoneNumberUrl);
      } else {
        console.error("Cannot open phone dialer");
      }
    })
    .catch((error) => console.error("An error occurred", error));
}
export async function function_AlgoliaSearch(searchText, index, setter) {
  // Initialize Algolia index
  const thisIndex = searchClient.initIndex(index);

  // Example search query
  const query = searchText;

  // Perform search
  thisIndex
    .search(query)
    .then(({ hits }) => {
      console.log(hits.length);
      setter(hits);
      // Handle the search results
    })
    .catch((error) => {
      console.error("Search Error:", error);
      // Handle the error
    });
}
export async function function_AlgoliaCreateRecord(index, args) {
  const thisIndex = searchClient.initIndex(index);

  console.log(args);
  const record = args;

  // Add the record to the index
  thisIndex
    .saveObject(record)
    .then(({ objectID }) => {
      console.log(
        `---------------------------------------------Record added with objectID: ${objectID}`
      );
    })
    .catch((error) => {
      console.error(
        "-------------------------------------------Error adding record:",
        error
      );
    });
}
export async function function_AlgoliaDeleteRecord(index, objectID) {
  // Specify the index name
  const thisIndex = searchClient.initIndex(index);
  // Define the objectID of the record to be deleted
  const objectIDToDelete = objectID;
  // Delete the record
  thisIndex
    .deleteObject(objectIDToDelete)
    .then(({ taskID }) => {
      console.log(
        `----------------------------------------------Record deletion taskID: ${taskID}`
      );
    })
    .catch((error) => {
      console.error(
        "-----------------------------------------------Error deleting record:",
        error
      );
    });
}
export async function function_Refund(paymentIntentID, amount, successFunc) {
  const newTotal = amount;
  const paymentIntentId = paymentIntentID;
  try {
    const response = await fetch(`${serverURL}/refund`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ paymentIntentId, total: newTotal }),
    });

    if (response.ok) {
      successFunc();
      Alert.alert("Refund successful!");
    } else {
      Alert.alert("Refund failed. Please try again.");
    }
  } catch (error) {
    console.error("Error refunding payment:", error);
  }
}
export async function function_DownloadFileToDevice(fileUri) {
  try {
    const fileUriParts = fileUri.split('.');
    const fileExtension = fileUriParts[fileUriParts.length - 1];
    const downloadDest = `${FileSystem.documentDirectory}PhotoOPphoto-${randomString(20)}.${fileExtension}`;

    const { uri } = await FileSystem.downloadAsync(fileUri, downloadDest);
    console.log('File downloaded to:', uri);
    return uri;
  } catch (error) {
    console.error('Error downloading file:', error);
    return null;
  }
};
export async function function_ShareFile(fileUri) {
  try {
    const isAvailable = await Sharing.isAvailableAsync();
    if (!isAvailable) {
      console.log("Sharing is not available on this device");
      return;
    }

    await Sharing.shareAsync(fileUri);

    console.log("File shared successfully");
  } catch (error) {
    console.error("Error sharing file:", error);
  }
};

// STYLES
export const format = StyleSheet.create({
  center_text: {
    textAlign: "center",
  },
  right_text: {
    textAlign: "right",
  },
  left_text: {
    textAlign: "left",
  },
  bold: {
    fontWeight: "bold",
  },
  radius: {
    borderRadius: 10,
  },
  radius_full: {
    borderRadius: 100,
  },
  all_caps: {
    textTransform: "uppercase",
  },
  strike: {
    textDecorationLine: "line-through",
  },
  shadow: {
    ...Platform.select({
      ios: {
        shadowColor: "black",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
});
export const sizes = StyleSheet.create({
  xsmall_text: {
    fontSize: 12,
  },
  small_text: {
    fontSize: 16,
  },
  medium_text: {
    fontSize: 20,
  },
  large_text: {
    fontSize: 25,
  },
  xlarge_text: {
    fontSize: 30,
  },
  xxlarge_text: {
    fontSize: 35,
  },
});
export const colors = StyleSheet.create({
  white: {
    color: "white",
  },
  black: {
    color: "black",
  },
  blue: {
    color: "#169FFF",
  },
  gray: {
    color: "#CFCFD0",
  },
});
export const layout = StyleSheet.create({
  padding: {
    padding: 14,
  },
  padding_small: {
    padding: 6,
  },
  padding_vertical: {
    paddingVertical: 14,
  },
  padding_vertical_small: {
    paddingVertical: 6,
  },
  padding_horizontal: {
    paddingHorizontal: 14,
  },
  padding_horizontal_small: {
    paddingHorizontal: 6,
  },
  margin: {
    margin: 14,
  },
  margin_small: {
    margin: 6,
  },
  margin_vertical: {
    marginVertical: 14,
  },
  margin_vertical_small: {
    marginVertical: 6,
  },
  margin_horizontal: {
    marginHorizontal: 14,
  },
  margin_horizontal_small: {
    marginHorizontal: 6,
  },
  horizontal: {
    flexDirection: "row",
    gap: 8,
    alignItems: "flex-start",
    overflow: "hidden",
  },
  vertical: {
    flexDirection: "column",
    gap: 14,
  },
  separate_horizontal: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  separate_vertical: {
    flexDirection: "column",
    justifyContent: "space-between",
    flex: 1,
  },
  relative: {
    position: "relative",
  },
  absolute: {
    position: "absolute",
    zIndex: 1000,
  },
  absolute_top_full: {
    position: "absolute",
    zIndex: 1000,
    top: 0,
    right: 0,
    left: 0,
  },
  absolute_bottom_full: {
    position: "absolute",
    zIndex: 1000,
    bottom: 0,
    right: 0,
    left: 0,
  },
  absolute_top_left: {
    position: "absolute",
    zIndex: 1000,
    top: 0,
    left: 0,
  },
  absolute_top_right: {
    position: "absolute",
    zIndex: 1000,
    top: 0,
    right: 0,
  },
  absolute_bottom_left: {
    position: "absolute",
    zIndex: 1000,
    bottom: 0,
    left: 0,
  },
  absolute_bottom_right: {
    position: "absolute",
    zIndex: 1000,
    bottom: 0,
    right: 0,
  },
  full_height: {
    flex: 1,
    height: "100%",
  },
  full_width: {
    flex: 1,
    flexDirection: "row",
  },
  fit_height: {
    alignItems: "flex-start",
  },
  fit_width: {
    alignSelf: "flex-start",
  },
  center: {
    alignSelf: "center",
    justifyContent: "center",
  },
  align_bottom: {
    alignItems: "flex-end",
  },
  align_top: {
    alignItems: "flex-start",
  },
  align_center: {
    alignItems: "center",
  },
  image_cover: {
    objectFit: "cover",
  },
  image_contain: {
    objectFit: "contain",
  },
  image_fill: {
    objectFit: "fill",
  },
  no_gap: {
    gap: 0,
  },
});
export const backgrounds = StyleSheet.create({
  black: {
    backgroundColor: "black",
  },
  white: {
    backgroundColor: "white",
  },
  shadow: {
    elevation: 4, // Android shadow
    shadowColor: "rgba(0,0,0,0.3)",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
});

// AUTH

// Initializations
const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
const storage = getStorage();
export const db = getFirestore(app);

export function auth_IsUserSignedIn(
  setLoading,
  navigation,
  ifLoggedIn,
  ifNotLoggedIn,
  params,
  setter
) {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (user) {
      const uid = user.uid;
      myID = uid;
      firebase_UpdateToken(myToken);
      firebase_GetMe(user.email, setter);
      setLoading(false);
      if (params !== null) {
        navigation.navigate(ifLoggedIn, params);
      } else {
        navigation.navigate(ifLoggedIn);
      }
    } else {
      setLoading(false);
      console.log("USER IS NOT LOGGED IN");
      if (params !== null) {
        navigation.navigate(ifNotLoggedIn, params);
      } else {
        navigation.navigate(ifNotLoggedIn);
      }
    }
  });

  // Unsubscribe from the auth state listener when the component unmounts
  return unsubscribe;
}
export function auth_SignIn(
  setLoading,
  email,
  password,
  navigation,
  params,
  redirect,
  setter
) {
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      const userID = user.uid;
      myID = userID;
      firebase_UpdateToken(myToken);
      firebase_GetMe(user.email, setter);
      console.log(userID);
      setLoading(false);
      if (params !== null) {
        navigation.navigate(redirect, params);
      } else {
        navigation.navigate(redirect);
      }
      // ...
    })
    .catch((error) => {
      const errorMessage = error.message;
      setLoading(false);
      Alert.alert("Invalid Login", errorMessage);
    });
}
export function auth_SignOut(setLoading, navigation, redirect) {
  signOut(auth)
    .then(() => {
      // Sign-out successful.
      setLoading(false);
      console.log("USER SIGNED OUT");
      navigation.navigate(redirect);
    })
    .catch((error) => {
      // An error happened.
      setLoading(false);
      Alert.alert("Error", "There was an issue. Check your connection.");
    });
}
export function auth_CreateUser(
  setLoading,
  email,
  password,
  args,
  navigation,
  params,
  redirect,
  userID
) {
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed up
      const user = userCredential.user;
      const uid = user.uid;
      userID(uid);
      myID = uid;
      firebase_UpdateToken(myToken);
      firebase_CreateUser(args, uid).then(() => {
        setLoading(false);
        if (params !== null) {
          navigation.navigate(redirect, params);
        } else {
          navigation.navigate(redirect);
        }
      });
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      Alert.alert("Try Again", errorMessage);
      setLoading(false);
      // ..
    });
}
export function auth_ResetPassword(email) {
  if (email !== "") {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        // Password reset email sent!
        // ..
        Alert.alert(
          "Email Sent",
          "Please check your email for a reset password link."
        );
      })
      .catch((error) => {
        const errorMessage = error.message;
        Alert.alert("Error", errorMessage);
        // ..
      });
  } else {
    Alert.alert(
      "Missing Email",
      "Please type the email that you used to create this account."
    );
  }
}
export function auth_DeleteUser() {
  const user = auth.currentUser;

  deleteUser(user)
    .then(() => {
      // User deleted.
    })
    .catch((error) => {
      // An error ocurred
      // ...
    });
}
export async function firebase_CreateUser(args, uid) {
  await setDoc(doc(db, "Users", uid), args);
}
export async function firebase_GetMe(email, setter) {
  const q = query(collection(db, "Users"), where("Email", "==", email));
  const _ = onSnapshot(q, (querySnapshot) => {
    querySnapshot.forEach((doc) => {
      const user = {
        id: doc.id,
        ...doc.data(),
      };
      me = user;
      console.log(`I am ${user.DisplayName}`);
      setter(user);
    });
  });
}
export async function firebase_GetDocument(
  setLoading,
  table,
  documentID,
  setter
) {
  const docRef = doc(db, table, documentID);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const thing = {
      id: docSnap.id,
      ...docSnap.data(),
    };
    setter(thing);
    setLoading(false);
  } else {
    // docSnap.data() will be undefined in this case
    console.log("No such document!");
    setLoading(false);
  }
}
export async function firebase_GetAllDocuments(
  setLoading,
  table,
  setter,
  docLimit,
  whereField,
  whereCondition,
  whereValue,
  paginated,
  lastDoc,
  setLastDoc
) {
  console.log("GETTING DOCS");
  const collectionRef = collection(db, table);
  let queryRef = collectionRef;

  if (docLimit > 0) {
    if (whereField !== "" && whereField !== null && whereField !== undefined) {
      queryRef = query(
        queryRef,
        where(whereField, whereCondition, whereValue),
        limit(docLimit)
      );
    } else {
      queryRef = query(queryRef, limit(docLimit));
    }
  } else {
    if (whereField !== "" && whereField !== null && whereField !== undefined) {
      queryRef = query(
        queryRef,
        where(whereField, whereCondition, whereValue),
      );
    } else {
      queryRef = query(queryRef);
    }
  }

  if (paginated && lastDoc) {
    queryRef = queryRef.startAfter(lastDoc);
  }

  const querySnapshot = await getDocs(queryRef);
  const things = [];

  querySnapshot.forEach((doc) => {
    const thing = {
      id: doc.id,
      ...doc.data(),
    };
    things.push(thing);
  });

  if (paginated && things.length > 0) {
    setLastDoc(things[things.length - 1]);
  }

  setter(things);
  setLoading(false);
}
export async function firebase_GetAllDocumentsOrdered(
  setLoading,
  table,
  setter,
  docLimit,
  order,
  orderField,
  whereField,
  whereCondition,
  whereValue,
  paginated,
  lastDoc,
  setLastDoc
) {
  console.log("GETTING DOCS");
  const collectionRef = collection(db, table);
  let queryRef = collectionRef;

  if (docLimit > 0) {
    if (whereField !== "" && whereField !== null && whereField !== undefined) {
      queryRef = query(
        queryRef,
        where(whereField, whereCondition, whereValue),
        orderBy(orderField, order),
        limit(docLimit)
      );
    } else {
      queryRef = query(queryRef, orderBy(orderField, order), limit(docLimit));
    }
  } else {
    if (whereField !== "" && whereField !== null && whereField !== undefined) {
      queryRef = query(
        queryRef,
        where(whereField, whereCondition, whereValue),
        orderBy(orderField, order)
      );
    } else {
      queryRef = query(queryRef, orderBy(orderField, order));
    }
  }

  if (paginated && lastDoc) {
    queryRef = queryRef.startAfter(lastDoc);
  }

  const querySnapshot = await getDocs(queryRef);
  const things = [];

  querySnapshot.forEach((doc) => {
    const thing = {
      id: doc.id,
      ...doc.data(),
    };
    things.push(thing);
  });

  if (paginated && things.length > 0) {
    setLastDoc(things[things.length - 1]);
  }

  setter(things);
  setLoading(false);
}
export async function firebase_GetAllDocumentsByIds(
  table,
  setter,
  docLimit,
  order,
  orderField,
  whereArray,
  paginated = false,
  lastDoc = null
) {
  console.log("GETTING DOCS");
  const collectionRef = collection(db, table);

  let baseQuery = query(collectionRef);

  if (whereArray) {
    baseQuery = query(baseQuery, where(documentId(), "in", whereArray));
  }

  baseQuery = query(baseQuery, orderBy(orderField, order));

  if (docLimit > 0) {
    baseQuery = query(baseQuery, limit(docLimit));
  }

  let finalQuery = baseQuery;

  if (paginated && lastDoc) {
    finalQuery = query(baseQuery, startAfter(lastDoc[orderField]));
  }

  const querySnapshot = await getDocs(finalQuery);
  const things = [];

  querySnapshot.forEach((doc) => {
    const thing = {
      id: doc.id,
      ...doc.data(),
    };
    things.push(thing);
  });

  setter(things);
}
export function firebase_GetAllDocumentsListener(
  setLoading,
  table,
  setter,
  docLimit,
  whereField,
  whereCondition,
  whereValue,
  paginated = false,
  lastDoc = null,
  setLastDoc,
  funcAdded,
  funcUpdated,
  funcRemoved
) {
  console.log("GETTING DOCS");
  setLoading(true);
  const collectionRef = collection(db, table);

  let baseQuery = query(collectionRef);

  if (whereField && whereCondition && whereValue) {
    baseQuery = query(baseQuery, where(whereField, whereCondition, whereValue));
  }

  if (docLimit > 0) {
    baseQuery = query(baseQuery, limit(docLimit));
  }

  let finalQuery = baseQuery;

  if (paginated && lastDoc) {
    finalQuery = query(baseQuery, startAfter(lastDoc[orderField]));
  }
  let initialSnapshotReceived = false;
  const unsubscribe = onSnapshot(finalQuery, (querySnapshot) => {
    querySnapshot.docChanges().forEach((change) => {
      if (change.type === "modified") {
        funcUpdated();
        console.log("Document modified:", change.doc.id);
      } else if (change.type === "added" && initialSnapshotReceived) {
        funcAdded();
        console.log("Document added:", change.doc.id);
      } else if (change.type === "removed") {
        funcRemoved();
        console.log("Document removed:", change.doc.id);
      }
    });
    const things = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Update lastDoc if there are new documents and setLastDoc is available
    if (things.length > 0 && setLastDoc) {
      setLastDoc(things[things.length - 1]);
    }
    if (!initialSnapshotReceived) {
      initialSnapshotReceived = true;
    }

    if (paginated) {
      setter((prev) => {
        const uniqueThings = [...prev, ...things].reduce(
          (acc, current) =>
            acc.some((thing) => thing.id === current.id)
              ? acc
              : [...acc, current],
          []
        );
        return uniqueThings;
      });
    } else {
      setter(things);
    }

    setLoading(false);
  });

  return unsubscribe;
}
export function firebase_GetAllDocumentsListenerOrdered(
  setLoading,
  table,
  setter,
  docLimit,
  order,
  orderField,
  whereField,
  whereCondition,
  whereValue,
  paginated = false,
  lastDoc = null,
  setLastDoc,
  funcAdded,
  funcUpdated,
  funcRemoved
) {
  console.log("GETTING DOCS");
  setLoading(true);
  const collectionRef = collection(db, table);

  let baseQuery = query(collectionRef);

  if (whereField && whereCondition && whereValue) {
    baseQuery = query(baseQuery, where(whereField, whereCondition, whereValue));
  }

  baseQuery = query(baseQuery, orderBy(orderField, order));

  if (docLimit > 0) {
    baseQuery = query(baseQuery, limit(docLimit));
  }

  let finalQuery = baseQuery;

  if (paginated && lastDoc) {
    finalQuery = query(baseQuery, startAfter(lastDoc[orderField]));
  }
  let initialSnapshotReceived = false;
  const unsubscribe = onSnapshot(finalQuery, (querySnapshot) => {
    querySnapshot.docChanges().forEach((change) => {
      if (change.type === "modified") {
        funcUpdated();
        console.log("Document modified:", change.doc.id);
      } else if (change.type === "added" && initialSnapshotReceived) {
        funcAdded();
        console.log("Document added:", change.doc.id);
      } else if (change.type === "removed") {
        funcRemoved();
        console.log("Document removed:", change.doc.id);
      }
    });
    const things = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Update lastDoc if there are new documents and setLastDoc is available
    if (things.length > 0 && setLastDoc) {
      setLastDoc(things[things.length - 1]);
    }
    if (!initialSnapshotReceived) {
      initialSnapshotReceived = true;
    }

    if (paginated) {
      setter((prev) => {
        const uniqueThings = [...prev, ...things].reduce(
          (acc, current) =>
            acc.some((thing) => thing.id === current.id)
              ? acc
              : [...acc, current],
          []
        );
        return uniqueThings;
      });
    } else {
      setter(things);
    }

    setLoading(false);
  });

  return unsubscribe;
}
export function firebase_GetAllDocumentsListenerByIds(
  setLoading,
  table,
  setter,
  docLimit,
  order,
  orderField,
  whereArray,
  paginated = false,
  lastDoc = null,
  setLastDoc,
  funcAdded,
  funcUpdated,
  funcRemoved
) {
  console.log("GETTING DOCS");
  const collectionRef = collection(db, table);

  let baseQuery = query(collectionRef);

  if (whereArray) {
    baseQuery = query(baseQuery, where(documentId(), "in", whereArray));
  }

  baseQuery = query(baseQuery, orderBy(orderField, order));

  if (docLimit > 0) {
    baseQuery = query(baseQuery, limit(docLimit));
  }

  let finalQuery = baseQuery;

  if (paginated && lastDoc) {
    finalQuery = query(baseQuery, startAfter(lastDoc[orderField]));
  }
  let initialSnapshotReceived = false;
  const unsubscribe = onSnapshot(finalQuery, (querySnapshot) => {
    querySnapshot.docChanges().forEach((change) => {
      if (change.type === "modified") {
        funcUpdated();
        console.log("Document modified:", change.doc.id);
      } else if (change.type === "added" && initialSnapshotReceived) {
        funcAdded();
        console.log("Document added:", change.doc.id);
      } else if (change.type === "removed") {
        funcRemoved();
        console.log("Document removed:", change.doc.id);
      }
    });
    const things = [];
    querySnapshot.forEach((doc) => {
      const thing = {
        id: doc.id,
        ...doc.data(),
      };
      things.push(thing);
    });

    // Update lastDoc if there are new documents and setLastDoc is available
    if (things.length > 0 && setLastDoc) {
      setLastDoc(things[things.length - 1]);
    }
    if (!initialSnapshotReceived) {
      initialSnapshotReceived = true;
    }
    setter((prev) => removeDuplicatesByProperty([...prev, ...things], "id"));
    setLoading(false);
  });

  return unsubscribe;
}
export function firebase_GetAllDocumentsListenerByDistance(
  setLoading,
  table,
  setter,
  docLimit,
  order,
  whereField,
  whereCondition,
  whereValue,
  paginated = false,
  lastDoc = null,
  setLastDoc,
  coordinates,
  funcAdded,
  funcUpdated,
  funcRemoved
) {
  setLoading(true);
  console.log("GETTING DOCUMENTS LISTENER");
  const collectionRef = collection(db, table);
  let baseQuery = query(collectionRef);
  const precision = 10;
  const distance = 100;

  if (whereField && whereCondition && whereValue) {
    baseQuery = query(baseQuery, where(whereField, whereCondition, whereValue));
  }
  const latDiff = kmToLat(distance);
  const lonDiff = kmToLon(distance, coordinates.latitude);

  const minGeohash = convertToPrecision10(
    ngeohash.encode(
      coordinates.latitude - latDiff,
      coordinates.longitude - lonDiff,
      precision
    )
  );
  const maxGeohash = convertToPrecision10(
    ngeohash.encode(
      coordinates.latitude + latDiff,
      coordinates.longitude + lonDiff,
      precision
    )
  );

  baseQuery = query(
    baseQuery,
    where("geohash", ">=", minGeohash),
    where("geohash", "<=", maxGeohash),
    orderBy("geohash", order)
  );

  if (docLimit > 0) {
    baseQuery = query(baseQuery, limit(docLimit));
  }

  let finalQuery = baseQuery;

  if (paginated && lastDoc) {
    const lastDocData = lastDoc;
    finalQuery = query(baseQuery, startAfter(lastDocData));
  }
  let initialSnapshotReceived = false;
  const unsubscribe = onSnapshot(finalQuery, async (querySnapshot) => {
    querySnapshot.docChanges().forEach((change) => {
      if (change.type === "modified") {
        funcUpdated();
        console.log("Document modified:", change.doc.id);
      } else if (change.type === "added" && initialSnapshotReceived) {
        funcAdded();
        console.log("Document added:", change.doc.id);
      } else if (change.type === "removed") {
        funcRemoved();
        console.log("Document removed:", change.doc.id);
      }
    });
    const things = [];
    for (const doc of querySnapshot.docs) {
      const distance = haversineDistance(
        myCoords.latitude,
        myCoords.longitude,
        doc.data().Lat,
        doc.data().Lon
      );
      const thing = {
        id: doc.id,
        ...doc.data(),
        Distance: distance.toFixed(2),
      };
      things.push(thing);
    }
    if (things.length > 0 && setLastDoc) {
      const lastDocSnapshot = querySnapshot.docs[querySnapshot.docs.length - 1];
      setLastDoc(lastDocSnapshot);
    }
    if (!initialSnapshotReceived) {
      initialSnapshotReceived = true;
    }
    things.sort((a, b) => a.Distance - b.Distance);

    setter((prev) => removeDuplicatesByProperty([...prev, ...things], "id"));
    setLoading(false);
  });

  return unsubscribe;
}
export async function firebase_CreateDocument(args, table, documentID) {
  await setDoc(doc(db, table, documentID), args);
}
export async function firebase_UpdateDocument(
  setLoading,
  table,
  documentID,
  args
) {
  const washingtonRef = doc(db, table, documentID);
  await updateDoc(washingtonRef, args);
  setLoading(false);
}
export async function firebase_DeleteDocument(setLoading, table, documentID) {
  await deleteDoc(doc(db, table, documentID));
  setLoading(false);
}
export async function firebase_UpdateToken(token, userID) {
  const washingtonRef = doc(db, "Users", userID);

  // Set the "capital" field of the city 'DC'
  await updateDoc(washingtonRef, {
    Token: token,
  });
}
export async function storage_UploadImage(
  setLoading,
  image,
  path,
  setProgress
) {
  setLoading(true);
  try {
    // Convert the data URL to a Blob
    const imageBlob = await fetch(image).then((res) => res.blob());

    // Upload the Blob to Firebase Storage
    const storageRef = ref(storage, path);
    const uploadTask = uploadBytesResumable(storageRef, imageBlob);

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Handle progress changes, if needed
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progress);
        console.log(`Upload is ${progress}% done`);
      },
      (error) => {
        // Handle errors
        console.error("Error uploading image:", error);
        setLoading(false); // Update loading state in case of an error
        Alert.alert("Error", "Please try again.");
      },
      async () => {
        // Handle successful completion
        setProgress(0);
        setLoading(false); // Update loading state
      }
    );
  } catch (error) {
    console.error("Error creating document: ", error);
    setLoading(false); // Update loading state in case of an error
  }
}
export async function storage_UploadFile(setLoading, file, path, setProgress) {
  setLoading(true);

  try {
    // Convert the file to a Blob
    const fileBlob = await fetch(file).then((res) => res.blob());

    // Upload the Blob to Firebase Storage
    const storageRef = ref(storage, path);
    const uploadTask = uploadBytesResumable(storageRef, fileBlob);

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Handle progress changes, if needed
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progress);
        console.log(`Upload is ${progress}% done`);
      },
      (error) => {
        // Handle errors
        console.error("Error uploading file:", error);
        setLoading(false); // Update loading state in case of an error
        Alert.alert("Error", "Please try again.");
      },
      async () => {
        // Handle successful completion
        setLoading(false); // Update loading state
      }
    );
  } catch (error) {
    console.error("Error uploading file: ", error);
    setLoading(false); // Update loading state in case of an error
  }
}
export async function storage_DownloadFile(setLoading, path, setter) {
  setLoading(true);
  console.log("DOWNLOADING");
  try {
    // Get the download URL for the file
    const storageRef = ref(storage, path);
    const downloadURL = await getDownloadURL(storageRef);

    // Set the file using the provided setter
    setter(downloadURL);

    // Update loading state
    setLoading(false);
  } catch (error) {
    console.error("Error downloading file:", error);
    setLoading(false); // Update loading state in case of an error
    Alert.alert("Error", "Please try again.");
  }
}
export async function storage_DownloadFiles(setLoading, path, setter) {
  setLoading(true);
  console.log("DOWNLOADING");
  console.log(path);
  try {
    // Get the download URL for the file
    const storageRef = ref(storage, path);
    const downloadURL = await getDownloadURL(storageRef);

    // Set the file using the provided setter
    console.log(downloadURL);
    setter((prev) => [...prev, downloadURL]);

    // Update loading state
    setLoading(false);
  } catch (error) {
    console.error("Error downloading file:", error);
    setLoading(false); // Update loading state in case of an error
    Alert.alert("Error", "Please try again.");
  }
}
export async function storage_DeleteImage(setLoading, path) {
  try {
    const imageRef = ref(storage, path);

    // Delete the file
    await deleteObject(imageRef);

    console.log(`Image at path ${path} deleted successfully`);
  } catch (error) {
    console.error("Error deleting image:", error.message);
  } finally {
    setLoading(false);
  }
}
