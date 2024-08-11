import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';

// screen imports
import LoginPage from './screens/LoginPage';
import SignUpPage from './screens/SignUpPage';
import HomePage from './screens/HomeScreen';
import ScanPage from './screens/ScanPage';
import DeletePage from './screens/DeletePage';
import ManualPage from './screens/ManualPage';
import ViewPage from './screens/ViewPage';
import FoodTypePage from './screens/FoodTypePage';
import ShoppingListPage from './screens/ShoppingListPage';

// modal imports
import SideBarModal from './components/SideBarModal';
import NotificationsModal from './components/NotificationsModal';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

// firebase imports
import { db, auth } from './firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, setDoc, deleteDoc, doc, getDoc, updateDoc, arrayRemove } from "firebase/firestore";

// hooks
import { usePushNotifications } from './hooks/usePushNotifications';


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
      <Stack.Screen name="ShoppingListPage" component={ShoppingListPage} />

      <Stack.Screen name="ManageFridgePage" component={FoodTypePage} />
    </InsideStack.Navigator>
  );
}


export default function Page() {

  const [user, setUser] = useState(null);
  const [MenuModalOpen, setMenuModalOpen] = useState(false);
  const [NotificationsModalOpen, setNotificationsModalOpen] = useState(false);
  const [forceRender, setForceRender] = useState(false);
  
  // const [fontsLoaded] = useFonts({
  //   "Nunito Regular": require('./assets/fonts/Nunito Regular.ttf'),
  // });

  // if (!fontsLoaded) {
  //   return undefined;
  // }

  const { expoPushToken, notification } = usePushNotifications();

  const signUserOut = () => {
    auth.signOut().then(() => {
      setUser(null);
      setMenuModalOpen(false)
    
      removeToken(expoPushToken.data);
    });


  }

  const removeToken = async (token) => {
  
    const docRef = doc(db, "users", user.uid.toString());

    console.log("check this token: " + token)

    await updateDoc(docRef, {
      devices: arrayRemove(token)
    });


  }

  blankOptions = {
    headerShown: false
  }
  
  headerOptions = {
  
    headerLeft: () => (
      <TouchableOpacity onPress={() => setMenuModalOpen(true)}>
        <Ionicons name="menu" size={40} color="black" />  
      </TouchableOpacity>
    ),

    headerRight: () => (
      <TouchableOpacity onPress={() => setNotificationsModalOpen(true)}>
        <Ionicons name="notifications" size={40} color="black" />
      </TouchableOpacity>
    ),
  
    // center header Title
    headerTitleAlign: 'center',
  
  }


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
            {(user) ? (
              <Stack.Screen name="InsideLayout" component={InsideLayout} options={blankOptions}/>
            ) : (
              <>
                <Stack.Screen name="LoginPage" component={LoginPage}/>
                <Stack.Screen name="SignUpPage" component={SignUpPage}/>
              </>
            )}

          </Stack.Navigator>

          <SideBarModal
          modalOpen={MenuModalOpen}
          setModalOpen={setMenuModalOpen}
          email={user ? user.email : null}
          onClose={() => setMenuModalOpen(false)}
          signOut={signUserOut}
          toManageFridgePage={() => console.log("Manage Fridge Page")}
          />

          <NotificationsModal
          modalOpen={NotificationsModalOpen}
          setModalOpen={setNotificationsModalOpen}
          />

      </NavigationContainer>
  )
}


