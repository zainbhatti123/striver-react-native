import React, {useEffect, useState} from 'react';
import {
  Image,
  View,
  useWindowDimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import SignUpBorder from '../../../components/svg/SignUpBorder';

import SocialMedia from '../../../components/SocialMedia';
import Background from '../../../shared/Background';
import Button from '../../../StyledComponents/Button';
import {theme} from '../../../theme';
import {useSelector, useDispatch} from 'react-redux';
import {setLogin} from '../../../store/features/auth/authSlice';
import {useAsyncStorage} from '../../../hooks/UseAsyncStorage';

const CreateAccont = ({navigation}) => {
  const {height} = useWindowDimensions();
  const {isLoading, isLogged, userData} = useSelector(store => store.auth);
  const [, setLoginValue] = useAsyncStorage('isLogged');
  const [, setUserData] = useAsyncStorage('userData');
  const [, setToken] = useAsyncStorage('token');
  const dispatch = useDispatch();

  useEffect(() => {
    if (isLogged) {
      setLoginValue(true);
      dispatch(setLogin(true));
      setUserData(userData);
      setToken(userData.accessToken)
    }
  }, [isLogged]);

  return (
    <Background src={require('../../../assets/first.png')} style={{height}}>
      <ScrollView>
        <View
          style={{
            flex: 1,
            height,
            justifyContent: 'flex-end',
            padding: 15,
            paddingBottom: Platform.OS == 'ios' ? 30 : 15,
          }}>
          <View style={{flexDirection: 'row'}}>
            <View style={{marginBottom: 12}}>
              <Text style={styles.signUp}>Sign Up</Text>
              <SignUpBorder />
            </View>
          </View>
          <Text
            style={{
              color: '#fff',
              fontSize: 12,
              marginBottom: 7,
              fontFamily: theme.fonts.regular.fontFamily,
            }}>
            With one of the following options
          </Text>
          <SocialMedia />

          <Button
            mode="contained"
            primary
            style={styles.button}
            labelStyle={styles.button.label}
            onPress={() => navigation.navigate('Signup')}
            loading={isLoading}
            disabled={isLoading}>
            Create Account
          </Button>

          <View style={styles.row}>
            <Text style={styles.label}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.link}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </Background>
  );
};

const styles = StyleSheet.create({
  onBoardImage: {
    width: '100%',
    height: '100%',
  },
  signUp: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '500',
    borderBottomColor: '#fff',
    fontFamily: theme.fonts.regular.fontFamily,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  button: {
    marginTop: 20,
    label: {
      fontSize: 20,
      textTransform: 'capitalize',
      letterSpacing: 0,
      fontWeight: '500',
    },
  },

  label: {
    color: '#fff',
    fontFamily: theme.fonts.regular.fontFamily,
  },
  link: {
    color: '#fff',
    fontFamily: theme.fonts.medium.fontFamily,
  },
});

export default CreateAccont;
