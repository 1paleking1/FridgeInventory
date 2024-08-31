// react imports
import React, { useState, useEffect } from 'react';
import { TouchableOpacity } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

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


// firebase imports
import { db, auth } from './firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, updateDoc, arrayRemove } from "firebase/firestore";

// hooks
import { usePushNotifications } from './hooks/usePushNotifications';

// misc
import { Ionicons } from '@expo/vector-icons';

const Stack = createNativeStackNavigator();
const InsideStack = createNativeStackNavigator();

const InsideLayout = () => {

  return (
    <InsideStack.Navigator> 
      <Stack.Screen name="HomePage" component={HomePage} options={headerOptions}/>
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

  const { expoPushToken, notification } = usePushNotifications();

  const signUserOut = async() => {
    await removeToken(expoPushToken);
    auth.signOut().then(() => {
      setUser(null);
      setMenuModalOpen(false)
    
    });

  }

  const removeToken = async (token) => {
  
    if (!token) {
      return;
    }

    console.log("removing token: ", expoPushToken); 

    console.log("user uid: ", user.uid);
    const docRef = doc(db, "users", user.uid.toString());

    await updateDoc(docRef, {
      devices: arrayRemove(token)
    });

  }

  blankOptions = {
    headerShown: false,
    headerTitleAlign: 'center',
    
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
            {(user && user.emailVerified) ? (
              <Stack.Screen name="InsideLayout" component={InsideLayout} options={blankOptions}/>
            ) : (
              <>
                <Stack.Screen name="LoginPage" component={LoginPage} options={{headerTitleAlign: 'center'}} />
                <Stack.Screen name="SignUpPage" component={SignUpPage} options={{headerTitleAlign: 'center'}} />
              </>
            )}

          </Stack.Navigator>

          <SideBarModal
          modalOpen={MenuModalOpen}
          setModalOpen={setMenuModalOpen}
          email={user ? user.email : null}
          onClose={() => setMenuModalOpen(false)}
          signOut={signUserOut}
          />

          <NotificationsModal
          modalOpen={NotificationsModalOpen}
          setModalOpen={setNotificationsModalOpen}
          />

      </NavigationContainer>
  )
}


