import React, {memo, useState, useEffect, useLayoutEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
  Platform,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

// Local Imports
import Background from '../../../shared/Background';
import Button from '../../../StyledComponents/Button';
import TextInput from '../../../StyledComponents/TextInput';
import DatePicker from 'react-native-date-picker';
import {theme} from '../../../theme';
import {emailValidator, passwordValidator, nameValidator} from '../../../utils';
import {
  resetErrorMessage,
  signupApiHandler,
  resetMessage,
} from '../../../store/features/auth/authSlice';
import {
  Lock1,
  Sms,
  User,
  Eye,
  EyeSlash,
  CloseSquare,
  TickSquare,
} from 'iconsax-react-native';
import {showAlert} from '../../../store/features/popup/popupSlice';
import AlertModal from '../../../components/AlertModal';

const RegisterScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const {height} = useWindowDimensions();

  const {isCreated, isLoading, message} = useSelector(state => state.auth);

  const [userName, setUserName] = useState({value: '', error: ''});
  const [email, setEmail] = useState({value: '', error: ''});
  const [password, setPassword] = useState({value: '', error: ''});
  const [showPassword, setShowPassword] = useState(false);
  const [date, setDate] = useState(new Date('2020-01-01'));
  const [dateForApi, setDateForApi] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);

  const _onSignUpPressed = async () => {
    const nameError = nameValidator(userName.value);
    const emailError = emailValidator(email.value);
    const passwordError = passwordValidator(password.value);

    if (emailError || passwordError || nameError) {
      setUserName({...userName, error: nameError});
      setEmail({...email, error: emailError});
      setPassword({...password, error: passwordError});
      return;
    }
    const user = {
      userName: userName.value,
      email: email.value,
      password: password.value,
      platform: Platform.OS,
      dob: dateForApi,
    };
    if (showCalendar) {
      await dispatch(signupApiHandler(user));
    } else {
      setShowCalendar(true);
    }
  };

  useLayoutEffect(() => {
    if (!showCalendar) {
      dispatch(resetMessage());
    }
  }, [showCalendar]);

  useEffect(() => {
    if (message.type == 'error') {
      dispatch(
        showAlert({
          type: 'error',
          title: 'Ooops',
          subtitle: message.text,
          button: 'Ok',
        }),
        setShowCalendar(false),
      );
    } else if (message.type == 'success') {
      dispatch(
        showAlert({
          type: 'success',
          title: 'Account',
          subtitle: message.text,
          onButtonPress: () => navigation.navigate('Login'),
          button: 'Done',
        }),
        setShowCalendar(false),
      );
    }
  }, [message]);

  return (
    <Background src={require('../../../assets/first-bg.png')} blured fullWidth>
      <ScrollView>
        <View style={[styles.container, {height: height - 40}]}>
          <View>
            {!showCalendar ? (
              <>
                <Text style={styles.loginText}>
                  Sign up to Striver and start creating challenges,
                  conversations and stories
                </Text>
                <View>
                  <TextInput
                    placeholder="Email"
                    returnKeyType="next"
                    value={email.value}
                    onChangeText={text => setEmail({value: text, error: ''})}
                    error={!!email.error}
                    errorText={email.error}
                    autoCapitalize="none"
                    autoCompleteType="email"
                    textContentType="emailAddress"
                    keyboardType="email-address"
                    style={styles.inputStyle}
                    dense
                    LeftIcon={<Sms size={20} color={theme.colors.grey} />}
                  />

                  <TextInput
                    placeholder="Username"
                    returnKeyType="next"
                    value={userName.value}
                    onChangeText={text => setUserName({value: text, error: ''})}
                    error={!!userName.error}
                    errorText={userName.error}
                    style={styles.inputStyle}
                    dense
                    LeftIcon={<User size={20} color={theme.colors.grey} />}
                  />

                  <TextInput
                    placeholder="Password"
                    returnKeyType="done"
                    value={password.value}
                    onChangeText={text => setPassword({value: text, error: ''})}
                    error={!!password.error}
                    errorText={password.error}
                    secureTextEntry={showPassword ? false : true}
                    style={styles.inputStyle}
                    LeftIcon={<Lock1 size={20} color={theme.colors.grey} />}
                    dense
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
                  />
                </View>
              </>
            ) : (
              <View>
                <Text style={styles.heading}>Select your date of birth</Text>
                <View>
                  <DatePicker
                    fadeToColor="#000"
                    theme="dark"
                    open={showCalendar}
                    mode="date"
                    date={date}
                    androidVariant="nativeAndroid"
                    style={{alignSelf: 'center'}}
                    onDateChange={date => {
                      setDate(date);
                      let formatedDate =
                        date.getFullYear() +
                        '-' +
                        (date.getMonth() + 1) +
                        '-' +
                        date.getDate();
                      setDateForApi(formatedDate);
                    }}
                    maximumDate={new Date()}
                  />
                </View>
              </View>
            )}
          </View>
          <View>
            <Text style={styles.terms}>
              On clicking continue , you agree to our {'\n'}
              <Text onPress={() => navigation.navigate('terms-and-conditions')}>
                <Text style={{color: '#fff', textDecorationLine: 'underline'}}>
                  {' '}
                  Terms of service
                </Text>
              </Text>
              <Text> and </Text>
              <Text onPress={() => navigation.navigate('privacy-policy')}>
                <Text style={{color: '#fff', textDecorationLine: 'underline'}}>
                  Privacy Policy
                </Text>
              </Text>
            </Text>
            <Button
              mode="contained"
              primary
              labelStyle={{
                fontSize: 20,
                fontWeight: '500',
              }}
              loading={isLoading}
              disabled={isLoading}
              onPress={_onSignUpPressed}
              style={styles.button}>
              Continue
            </Button>
          </View>
          <AlertModal />
        </View>
      </ScrollView>
    </Background>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  heading: {
    color: theme.colors.primary,
    fontSize: 20,
    fontFamily: theme.fonts.medium.fontFamily,
    marginBottom: 20,
    marginTop: Platform.OS == 'android' ? 50 : 70,
    textAlign: 'center',
  },
  loginText: {
    color: theme.colors.grey,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 40,
    marginTop: Platform.OS == 'ios' ? 50 : 30,
    fontFamily: theme.fonts.regular.fontFamily,
  },
  inputStyle: {
    backgroundColor: 'transparent',
    color: 'white',
    marginBottom: 5,
  },
  label: {
    color: theme.colors.secondary,
    fontFamily: theme.fonts.regular.fontFamily,
  },
  button: {
    marginTop: 24,
  },
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  link: {
    fontWeight: 'bold',
    color: '#fff',
    fontFamily: theme.fonts.regular.fontFamily,
  },
  terms: {
    fontSize: 12,
    color: theme.colors.grey,
    lineHeight: 25,
    textAlign: 'center',
    fontFamily: theme.fonts.regular.fontFamily,
  },
  error: {
    color: theme.colors.error,
    fontFamily: theme.fonts.regular.fontFamily,
  },
});

export default memo(RegisterScreen);
