
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {
  Text,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Set from './components/Set';
import Remove from './components/Remove';
import LandingScreen from './components/LandingScreen';

const Stack = createStackNavigator();
const Tabs = createMaterialTopTabNavigator();

const TabsContainer = () => {
  return(
    <>
      <Tabs.Navigator
      initialRouteName="Set"
      tabBarOptions={{
        activeTintColor: '#0c1714',
      }}
      swipeEnabled={false}
      backBehavior="none"
      lazy={true}
      tabBar={() => {}}
      >
        <Tabs.Screen
        name="Set"
        component={Set}
        />
        <Tabs.Screen
        name="Remove"
        component={Remove}
        />
      </Tabs.Navigator>
    </>
  );
}

const App: () => React$Node = () => {
  console.disableYellowBox = true;
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator
        initialRouteName="Landing"
        >
          <Stack.Screen
          name="Landing"
          component={LandingScreen}
          options={{
            headerShown: false,
          }}
          />
          <Stack.Screen
          name="Settings"
          component={TabsContainer}
          options={{
            headerTitle: () => {
              return(
                <Text style={{
                  fontWeight: 'bold',
                  color: '#ffffff',
                  fontSize: 20,
                }}>TIME CONTROLS</Text>
              )
            },
            headerStyle: {
              backgroundColor: '#0c1714',
            },
            headerTintColor: '#ffffff',
            headerTitleAlign: 'center',
          }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

export default App;
