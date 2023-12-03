import React from 'react';
import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {LoginManager, AccessToken} from 'react-native-fbsdk-next';
import {useDispatch, useSelector} from 'react-redux';
import {showAlert} from '../store/features/popup/popupSlice';
import AlertModal from './AlertModal';

import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
} from 'react-native';
import {Google, Facebook, Apple} from 'iconsax-react-native';
import {
  socialLoginApiHandler,
  setLogin,
} from '../store/features/auth/authSlice';
import {theme} from '../theme';
import {useAsyncStorage} from '../hooks/UseAsyncStorage';
import Svg, {Path} from 'react-native-svg';
import {useEffect} from 'react';
import FacebookSvg from '../components/svg/FacebooSvg';
const SocialMedia = () => {
  const dispatch = useDispatch();
  const [, setLoginValue] = useAsyncStorage('isLogged');

  const {message, isLoading, isLogged, isInvalid} = useSelector(
    state => state.auth,
  );
  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '398685993459-mbv7t4l9cj4r5e085g2jvauic4glc978.apps.googleusercontent.com',
      offlineAccess: true,
      iosClientId:
        '398685993459-etmpvtgpk202nlrtv1u29hqnbk932ln0.apps.googleusercontent.com',
    });
  }, []);

  const loginWithFacebook = async () => {
    // Attempt login with permissions

    // Create a Firebase credential with the AccessToken

    // Sign-in the user with the credential
    try {
      const result = await LoginManager.logInWithPermissions([
        'public_profile',
        'email',
      ]);

      if (result.isCancelled) {
        throw 'User cancelled the login process';
      }
      // Once signed in, get the users AccesToken
      const data = await AccessToken.getCurrentAccessToken();

      if (!data) {
        throw 'Something went wrong obtaining access token';
      }
      const facebookCredential = auth.FacebookAuthProvider.credential(
        data.accessToken,
      );
      const {user} = await auth().signInWithCredential(facebookCredential);
      const userData = {
        firstName: user.displayName.split(' ')[0],
        lastName: user.displayName.split(' ')[1],
        email: user.email,
        dob: '',
        loginType: 'facebook',
        profileImage: user.photoURL,
        platform: Platform.OS,
      };
      dispatch(socialLoginApiHandler(userData));
    } catch (error) {
      showCustomAlert('Error while login with facebook!');
    }
  };
  const googleSignInMethod = async () => {
    console.log('method working');
    try {
      await GoogleSignin.hasPlayServices();
      const {user} = await GoogleSignin.signIn();
      const userData = {
        firstName: user.givenName,
        lastName: user.familyName,
        email: user.email,
        dob: '',
        profileImage: user.photo,
        loginType: 'google',
        platform: Platform.OS,
      };
      dispatch(socialLoginApiHandler(userData));
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
        console.log(error);
       } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
        console.log(error);
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
        showCustomAlert('Play service Not AvailAble');

      } else {
        // some other error happened
        showCustomAlert('Error while login with google!');
      }
    }
    return
    // Get the users ID token

    // Sign-in the user with the credential
    try {
      const {idToken} = await GoogleSignin.signIn();
      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      const {user} = await auth().signInWithCredential(googleCredential);
      // console.log(user)
      
    } catch (error) {
      console.log(error);
      showCustomAlert('Error while login with google!');
    }
  };
  const showCustomAlert = mess => {
    dispatch(
      showAlert({
        title: 'Ooops',
        subtitle: mess,
        type: 'error',
        button: 'Ok',
      }),
    );
  };
  useEffect(() => {
    if (message && message.type == 'error') {
      showCustomAlert(message.text);
    }
    if (isLogged) {
      setLoginValue(true);
      dispatch(setLogin(true));
    }
  }, [message, isLogged]);
  return (
    <View style={styles.row}>
      <TouchableOpacity
        style={styles.social}
        activeOpacity={0.4}
        onPress={() => googleSignInMethod()}>
        {/* <Image source={require('../assets/google.png')}></Image> */}
        <Google size={25} variant="Bold" color={theme.colors.white} />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.social, {marginLeft: 20}]}
        activeOpacity={0.4}
        onPress={() => loginWithFacebook()}>
        <FacebookSvg />
      </TouchableOpacity>
      {/* <TouchableOpacity style={styles.social} activeOpacity={0.4}>
        <Image source={require('../assets/apple.png')}></Image>
        <Apple size={25} variant="Bold" color={theme.colors.white} />
      </TouchableOpacity> */}
      <AlertModal />
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'center',
  },
  social: {
    backgroundColor: '#1A222F',
    borderRadius: 8,
    flex: 1,
    paddingTop: 8,
    paddingBottom: 5,
    alignItems: 'center',
  },
});

export default SocialMedia;
