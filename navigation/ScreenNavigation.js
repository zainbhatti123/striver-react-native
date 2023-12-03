import React, {useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useSelector, useDispatch} from 'react-redux';
import {Platform, Image, View, StyleSheet} from 'react-native';
import LoginScreen from '../Screens/auth/Login';
import SignUpScreen from '../Screens/auth/Signup';
import UserEmail from '../Screens/auth/UserEmail';
import SendOtp from '../Screens/auth/Otp';
import ResetPassword from '../Screens/auth/ResetPassword';
import OnBoarding from '../Screens/auth/OnBoarding';
import createAccount from '../Screens/auth/CreateAccount';
import EditProfile from '../Screens/EditProfile';
import TabNavigation from './TabNavigation';
import Loader from '../components/Loader';
import {
  setLogin,
  setOnBoarding,
  setPageLoading,
  setUserData,
} from '../store/features/auth/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CreateChallenge from '../Screens/CreateChallenge';
import Trophies from '../Screens/Profile/Trophy';
import LevelScreen from '../Screens/Profile/Level';
import VideoPlayer from '../components/VideoPlayer';
import Responses from '../Screens/Landing/Responses';

const Stack = createNativeStackNavigator();

function ScreenNavigation() {
  const {isAuthorized, pageLoading, isOnboarded} = useSelector(
    store => store.auth,
  );
  const dispatch = useDispatch();

  const checkLocalStorge = () => {
    checkLogin();
    checkOnboard();
    checkUserData();
  };

  const checkUserData = async () => {
    try {
      let data = await AsyncStorage.getItem('userData');
      if (data !== null) {
        dispatch(setUserData(JSON.parse(data)));
      } else {
        dispatch(setUserData(data));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkLogin = async () => {
    try {
      dispatch(setPageLoading(true));
      return await AsyncStorage.getItem('isLogged');
    } catch (error) {
      console.log(error);
    }
  };

  const checkOnboard = async () => {
    try {
      let onbaord = await AsyncStorage.getItem('onboard');
      if (onbaord !== null) {
        dispatch(setOnBoarding(true));
      } else {
        dispatch(setOnBoarding(false));
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (pageLoading) {
      checkLogin().then(val => {
        let value = JSON.parse(val);
        dispatch(setPageLoading(false));
        if (value && value == true) {
          dispatch(setLogin(true));
        } else {
          dispatch(setLogin(false));
        }
      });
    }
  });

  return (
    <NavigationContainer onReady={checkLocalStorge}>
      <Stack.Navigator initialRouteName="Home">
        {pageLoading ? (
          <Stack.Screen
            name="Loader"
            component={Loader}
            options={{
              headerShown: false,
            }}
          />
        ) : (
          <>
            {isAuthorized ? (
              <>
                <Stack.Screen
                  name="root"
                  component={TabNavigation}
                  options={{headerShown: false}}
                />
                <Stack.Screen
                  name="CreateChallenge"
                  component={CreateChallenge}
                  options={{headerShown: false}}
                />
                <Stack.Screen
                  name="EditProfile"
                  component={EditProfile}
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="Trophies"
                  component={Trophies}
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="Level"
                  component={LevelScreen}
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="VideoPlayer"
                  component={VideoPlayer}
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="Responses"
                  component={Responses}
                  options={{
                    headerShown: false,
                  }}
                />
              </>
            ) : (
              <>
                {!isOnboarded && (
                  <Stack.Screen
                    name="onboarding"
                    component={OnBoarding}
                    options={{
                      headerShown: false,
                    }}
                  />
                )}
                <Stack.Screen
                  name="createAccount"
                  component={createAccount}
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="Login"
                  component={LoginScreen}
                  options={{
                    headerTitle: () => (
                      <View>
                        <Image
                          source={require('../assets/small-logo.png')}></Image>
                      </View>
                    ),
                    headerTransparent: true,
                    headerTintColor: '#fff',
                    headerTitleAlign: 'center',
                    headerStyle: {
                      marginTop: 40,
                    },
                    headerShadowVisible: false,
                  }}
                />
                <Stack.Screen
                  name="Signup"
                  component={SignUpScreen}
                  options={{
                    headerTitle: () => (
                      <View style={{}}>
                        <Image
                          source={require('../assets/small-logo.png')}></Image>
                      </View>
                    ),
                    headerTransparent: true,
                    headerTintColor: '#fff',
                    headerTitleAlign: 'center',
                    headerStyle: styles.header,
                    headerShadowVisible: false,
                  }}
                />
                <Stack.Screen
                  name="UserEmail"
                  component={UserEmail}
                  options={{
                    headerTitle: () => (
                      <View style={{}}>
                        <Image
                          source={require('../assets/small-logo.png')}></Image>
                      </View>
                    ),
                    headerTransparent: true,
                    headerTintColor: '#fff',
                    headerTitleAlign: 'center',
                    headerStyle: styles.header,
                    headerShadowVisible: false,
                  }}
                />
                <Stack.Screen
                  name="SendOtp"
                  component={SendOtp}
                  options={{
                    headerTitle: () => (
                      <View style={{}}>
                        <Image
                          source={require('../assets/small-logo.png')}></Image>
                      </View>
                    ),
                    headerTransparent: true,
                    headerTintColor: '#fff',
                    headerTitleAlign: 'center',
                    headerStyle: styles.header,
                    headerShadowVisible: false,
                    headerBackTitle: 'Back',
                  }}
                />
                <Stack.Screen
                  name="ResetPassword"
                  component={ResetPassword}
                  options={{
                    headerTitle: () => (
                      <View style={{}}>
                        <Image
                          source={require('../assets/small-logo.png')}></Image>
                      </View>
                    ),
                    headerTransparent: true,
                    headerTintColor: '#fff',
                    headerTitleAlign: 'center',
                    headerStyle: styles.header,
                    headerShadowVisible: false,
                    headerBackTitle: 'OTP',
                  }}
                />
              </>
            )}
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    borderBottomWidth: 1,
    borderBottomColor: '#343434',
  },
});

export default ScreenNavigation;
