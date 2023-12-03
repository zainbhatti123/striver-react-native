import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MainScreen from '../Screens/Landing';
import Search from '../Screens/Search';
import Notifications from '../Screens/Notifications';
import ProfileScreen from '../Screens/Profile';

import TabBar from './TabBar';

const Tab = createBottomTabNavigator();

const TabNavigation = () => {
  return (
    <Tab.Navigator
      initialRouteName="root"
      tabBar={() => <TabBar />}
      screenOptions={{
        tabBarBackground: '#000',
      }}>
      <Tab.Screen
        name="Home"
        component={MainScreen}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name="Search"
        component={Search}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name="Notifications"
        component={Notifications}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{headerShown: false}}
      />
      
    </Tab.Navigator>
  );
};

export default TabNavigation;
