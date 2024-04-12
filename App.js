import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Test from "./Test";
import { useEffect } from "react";
import { Start } from "./MAIN/Start";
import { Login } from "./MAIN/Login";
import { SignUp } from "./MAIN/SignUp";
import { Menu } from "./MAIN/Menu";
import { Item } from "./MAIN/Item";
import { Cart } from "./MAIN/Cart";
import { CartReview } from "./MAIN/CartReview";
import { Orders } from "./MAIN/Orders";
import { Profile } from "./MAIN/Profile";
import { Updates } from "./MAIN/Updates";

const Stack = createNativeStackNavigator();

export default function App() {
  useEffect(() => {
    // function_NotificationsSetup();
  }, []);
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="start">
        <Stack.Screen
          name="start"
          component={Start}
          options={{
            headerShown: false,
            animation: "fade",
          }}
        />
        <Stack.Screen
          name="login"
          component={Login}
          options={{
            headerShown: false,
            animation: "fade",
          }}
        />
        <Stack.Screen
          name="signup"
          component={SignUp}
          options={{
            headerShown: false,
            gestureDirection: "horizontal",
            gestureEnabled: true,
            animation: "slide_from_right",
          }}
        />
        <Stack.Screen
          name="menu"
          component={Menu}
          options={{
            headerShown: false,
            gestureEnabled: false,
            animation: "fade",
          }}
        />
        <Stack.Screen
          name="item"
          component={Item}
          options={{
            headerShown: false,
            gestureEnabled: true,
            animation: "slide_from_right",
            gestureDirection: "horizontal",
          }}
        />
        <Stack.Screen
          name="cart"
          component={Cart}
          options={{
            headerShown: false,
            gestureEnabled: false,
            animation: "fade",
          }}
        />
        <Stack.Screen
          name="cart-review"
          component={CartReview}
          options={{
            headerShown: false,
            gestureEnabled: true,
            animation: "slide_from_right",
            gestureDirection: "horizontal",
          }}
        />
        <Stack.Screen
          name="orders"
          component={Orders}
          options={{
            headerShown: false,
            gestureEnabled: false,
            animation: "fade",
          }}
        />
        <Stack.Screen
          name="profile"
          component={Profile}
          options={{
            headerShown: false,
            gestureEnabled: false,
            animation: "fade",
          }}
        />
        <Stack.Screen
          name="updates"
          component={Updates}
          options={{
            headerShown: false,
            gestureEnabled: false,
            animation: "fade",
          }}
        />
        <Stack.Screen
          name="test"
          component={Test}
          options={{
            headerShown: false,
          }}
        />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}
