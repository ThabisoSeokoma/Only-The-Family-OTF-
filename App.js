import React, { useState,useEffect } from 'react';
import { useNavigation} from '@react-navigation/native';
import { NavigationContainer } from '@react-navigation/native';
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
import PlayerInfo from "./screens/CoachPlayer"
//import scheduleDefaultNotifications from './screens/notify';
import ClubConstraints from './screens/constraints';


const AppStack = createNativeStackNavigator();

const App = () => {
  // useEffect(() => {
  //   scheduleDefaultNotifications();
  // }, []);
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
        <AppStack.Screen name="CoachPlayer" component={PlayerInfo}/>
        <AppStack.Screen name="Constraints" component={ClubConstraints}/>

      </AppStack.Navigator>
    </NavigationContainer>
  );
};

export default App;
