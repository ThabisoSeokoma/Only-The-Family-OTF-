import React, { useState,useEffect } from 'react';
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "./screens/Login";
import SignupScreen from "./screens/SignUp";
import CoachProfile from "./screens/CoachProfile";
import AddClubScreen from "./screens/AddClubScreen";
import Player_input from "./screens/Player_daily_input";
import PlayerScreen from "./screens/PlayerProfile";
import ProgressScreen from "./screens/Progress";
import DetailsScreen from "./screens/Progress";
import ForgotPassWord from "./screens/ForgotPassWord";
import ClubProfile from "./screens/ClubProfile";
import AddPlayerScreen from "./screens/AddPlayerScreen";
import scheduleDefaultNotifications from './screens/notify.js';

const AppStack = createNativeStackNavigator();

const App = () => {

  useEffect(() => {
    scheduleDefaultNotifications();
  }, []);
  
  return (
    <NavigationContainer>
      <AppStack.Navigator headerMode="none">
        <AppStack.Screen name="Login" component={LoginScreen} />
        <AppStack.Screen name="SignUp" component={SignupScreen} />
        <AppStack.Screen name="Coach" component={CoachProfile}/>
        <AppStack.Screen name="AddClub" component={AddClubScreen} />
        <AppStack.Screen name="Player_inputs" component = {Player_input} />
        <AppStack.Screen name="Player" component={PlayerScreen}/>
        <AppStack.Screen name='Progress' component={ProgressScreen}/>
        <AppStack.Screen name ="Details" component = {DetailsScreen} />
        <AppStack.Screen name ="Forgot" component = {ForgotPassWord} />
        <AppStack.Screen name="ClubProfile" component={ClubProfile}/>
        <AppStack.Screen name="AddPlayer" component={AddPlayerScreen}/>
      </AppStack.Navigator>
    </NavigationContainer>
  );
};

export default App;
