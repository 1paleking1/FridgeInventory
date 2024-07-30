import React, { useState, useEffect } from 'react';

// screen imports
import HomePage from './screens/HomeScreen';
import ScanPage from './screens/ScanPage';
import DeletePage from './screens/DeletePage';
import ManualPage from './screens/ManualPage';
import ViewPage from './screens/ViewPage';
import VegetablePage from './screens/VegetablesPage';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';


const Stack = createNativeStackNavigator();


export default function Page() {

  return (
      <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="HomePage" component={HomePage} />
            <Stack.Screen name="ScanPage" component={ScanPage} />
            <Stack.Screen name="DeletePage" component={DeletePage} />
            <Stack.Screen name="ManualPage" component={ManualPage} />
            <Stack.Screen name="ViewPage" component={ViewPage} />
            <Stack.Screen name="VegetablePage" component={VegetablePage} />
          </Stack.Navigator>
      </NavigationContainer>
  )
}

