import React, {memo, useEffect, useState} from 'react';
import {TouchableOpacity, StyleSheet, Text, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useAsyncStorage} from '../../../hooks/UseAsyncStorage';
// local imports
import Background from '../../../shared/Background';
import SocialMedia from '../../../components/SocialMedia';
import Header from '../../../StyledComponents/Header';
import Button from '../../../StyledComponents/Button';
import TextInput from '../../../StyledComponents/TextInput';
import {theme} from '../../../theme';
import {email_OR_userName, passwordValidator} from '../../../utils';
import {
  loginApiHandler,
  setLogin,
} from '../../../store/features/auth/authSlice';
import {ScrollView, Platform} from 'react-native';
import {Eye, EyeSlash, Lock1, User} from 'iconsax-react-native';
import AlertModal from '../../../components/AlertModal';
import {showAlert} from '../../../store/features/popup/popupSlice';

const LoginScreen = ({navigation}) => {
  const {message, isLoading, isLogged, isInvalid, userData} = useSelector(
    state => state.auth,
  );

  const dispatch = useDispatch();

  // const [username, setUsername] = useState({value: '', error: ''});
  const [email, setEmail] = useState({value: '', error: ''});
  const [password, setPassword] = useState({value: '', error: ''});
  const [showPassword, setShowPassword] = useState(false);
  const [, setLoginValue] = useAsyncStorage('isLogged');
  const [, setUserData] = useAsyncStorage('userData');
  const [, setToken] = useAsyncStorage('token');

  const _onLoginPressed = async () => {
    const loginType = email_OR_userName(email.value);
    const passwordError = passwordValidator(password.value);

    if (passwordError) {
      setEmail({...email, error: loginType});
      setPassword({...password, error: passwordError});
      return;
    }

    const user = {
      [loginType == 'username' ? 'userName' : 'email']: email.value,
      password: password.value,
    };
    dispatch(loginApiHandler(user));
  };

  useEffect(() => {
    if (message && message.type == 'error') {
      dispatch(
        showAlert({
          title: 'Ooops',
          subtitle: message.text,
          type: 'error',
          button: 'Ok',
        }),
      );
    }
    if (isLogged) {
      setLoginValue(true);
      dispatch(setLogin(true));
      setUserData(userData);
      setToken(userData.accessToken);
    }
  }, [message, isLogged]);

  return (
    <Background src={require('../../../assets/second-bg.png')} blured fullWidth>
      <ScrollView keyboardShouldPersistTaps="always">
        <View style={styles.container}>
          <Text style={styles.loginText}>
            Login in your account in order to start creating challenges!
          </Text>

          <TextInput
            dense
            placeholder=" Username or Email"
            returnKeyType="next"
            value={email.value}
            onChangeText={text => setEmail({value: text, error: ''})}
            error={!!email.error}
            errorText={email.error}
            autoCapitalize="none"
            autoCompleteType="email"
            textContentType="email-address"
            keyboardType="ascii-capable"
            LeftIcon={<User size={20} color={theme.colors.grey} />}
            style={styles.inputStyle}
          />

          <TextInput
            placeholder="Password"
            returnKeyType="done"
            dense
            value={password.value}
            onChangeText={text => setPassword({value: text, error: ''})}
            error={!!password.error}
            errorText={password.error}
            secureTextEntry={showPassword ? false : true}
            LeftIcon={<Lock1 size={20} color={theme.colors.grey} />}
            RightIcon={
              !showPassword ? (
                <TouchableOpacity
                  onPress={() => setShowPassword(true)}
                  activeOpacity={0.7}
                  style={{padding: 8}}>
                  <Eye size={20} color={theme.colors.grey} />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => setShowPassword(false)}
                  activeOpacity={0.7}
                  style={{padding: 8}}>
                  <EyeSlash size={20} color={theme.colors.grey} />
                </TouchableOpacity>
              )
            }
            style={styles.inputStyle}
          />

          <View style={styles.forgotPassword}>
            <TouchableOpacity onPress={() => navigation.navigate('UserEmail')}>
              <Text style={styles.label}>Forgot password?</Text>
            </TouchableOpacity>
          </View>

          <Button
            mode="contained"
            primary
            onPress={_onLoginPressed}
            labelStyle={{
              fontSize: 18,
              fontWeight: 'normal',
              borderRadius: 13,
            }}
            disabled={isLoading}
            loading={isLoading}>
            Continue
          </Button>
          <View style={styles.row}>
            <Text style={styles.label}>Don’t have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
              <Text style={styles.link}>Create Now</Text>
            </TouchableOpacity>
          </View>

          <View
            style={[
              styles.row,
              {marginTop: 56, marginBottom: 10, alignItems: 'center'},
            ]}>
            <View style={styles.horizontalLine}></View>
            <Text
              style={{
                width: 40,
                textAlign: 'center',
                fontFamily: theme.fonts.regular.fontFamily,
                color: theme.colors.grey,
              }}>
              OR
            </Text>
            <View style={styles.horizontalLine}></View>
          </View>
          <SocialMedia />
        </View>
        <AlertModal />
      </ScrollView>
    </Background>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  inputStyle: {
    backgroundColor: 'transparent',
    color: 'white',
    fontFamily: theme.fonts.regular.fontFamily,
    marginBottom: 5,
  },
  forgotPassword: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 20,
    marginTop: 4,
    fontFamily: theme.fonts.regular.fontFamily,
  },
  loginText: {
    color: theme.colors.grey,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 40,
    marginTop: Platform.OS == 'ios' ? 50 : 30,
    fontFamily: theme.fonts.regular.fontFamily,
  },
  row: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'center',
  },
  label: {
    color: '#fff',
    fontSize: 12,
    fontFamily: theme.fonts.regular.fontFamily,
  },
  error: {
    color: theme.colors.error,
    fontFamily: theme.fonts.regular.fontFamily,
  },
  link: {
    fontWeight: '500',
    color: '#fff',
    fontSize: 12,
    fontFamily: theme.fonts.medium.fontFamily,
  },
  horizontalLine: {
    height: 1,
    backgroundColor: '#383838',
    flex: 1,
  },
});

export default memo(LoginScreen);
