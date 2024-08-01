import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// screen imports
import LoginPage from './screens/LoginPage';
import SignUpPage from './screens/SignUpPage';
import HomePage from './screens/HomeScreen';
import ScanPage from './screens/ScanPage';
import DeletePage from './screens/DeletePage';
import ManualPage from './screens/ManualPage';
import ViewPage from './screens/ViewPage';
import FoodTypePage from './screens/FoodTypePage';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

// firebase imports
import { auth } from './firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';


const Stack = createNativeStackNavigator();

const InsideStack = createNativeStackNavigator();


const InsideLayout = () => {
  return (
    <InsideStack.Navigator> 
      <Stack.Screen name="HomePage" component={HomePage} options={headerOptions} />
      <Stack.Screen name="ScanPage" component={ScanPage} />
      <Stack.Screen name="DeletePage" component={DeletePage} />
      <Stack.Screen name="ManualPage" component={ManualPage} />
      <Stack.Screen name="ViewPage" component={ViewPage} />
      <Stack.Screen name="FoodTypePage" component={FoodTypePage} />
    </InsideStack.Navigator>
  );
}


export default function Page() {

  const [user, setUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
  }
  , []);

  return (
    
      <NavigationContainer>
          <Stack.Navigator>
            {user ? (
              <Stack.Screen name="InsideLayout" component={InsideLayout} options={blankOptions} />
            ) : (
              <>
                <Stack.Screen name="LoginPage" component={LoginPage} />
                <Stack.Screen name="SignUpPage" component={SignUpPage} />
              </>
            )}            
          </Stack.Navigator>
      </NavigationContainer>
  )
}


blankOptions = {
  headerShown: false
};

headerOptions = {

  headerLeft: () => (
    <TouchableOpacity>
      <Ionicons name="menu" size={24} color="black" />
    </TouchableOpacity>
  ),

  // center header Title
  headerTitleAlign: 'center',

}
