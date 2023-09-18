import React from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator} from '@react-navigation/native';

import LoginScreen from "./screens/Login";
import SignupScreen from "./screens/SignUp";

const AppStack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <AppStack.Navigator headerMode = 'none'>
        <AppStack.Screen name="Login" component={LoginScreen} />
        <AppStack.Screen name="SignUp" component={SignupScreen} />
      </AppStack.Navigator>
    </NavigationContainer>
  );
}

export default App;