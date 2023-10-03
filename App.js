import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "./screens/Login";
import SignupScreen from "./screens/SignUp";
import CoachProfile from "./screens/CoachProfile";
import AddClubScreen from "./screens/AddClubScreen";
import Player_input from "./screens/Player_daily_input";
import CircleRatingScale from "./screens/PlayerProfile";

const AppStack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <AppStack.Navigator headerMode="none">
        <AppStack.Screen name="Login" component={LoginScreen} />
        <AppStack.Screen name="SignUp" component={SignupScreen} />
        <AppStack.Screen name="Coach" component={CoachProfile}/>
        <AppStack.Screen name ="Player_inputs" component = {Player_input} />
        <AppStack.Screen name ="Player" component = {CircleRatingScale} />
      </AppStack.Navigator>
    </NavigationContainer>
  );
};

export default App;
