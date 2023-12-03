import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Platform,
  useWindowDimensions,
  TouchableOpacity,
} from 'react-native';
import TextInput from '../../../StyledComponents/TextInput';
import Background from '../../../shared/Background';
import Button from '../../../StyledComponents/Button';
import {theme} from '../../../theme';
import {useSelector, useDispatch} from 'react-redux';
import {Eye, EyeSlash, Lock1} from 'iconsax-react-native';
import {passwordValidator} from '../../../utils';
import {
  forgetPasswordApiHandler,
  resetMessage,
  resetWholeState,
} from '../../../store/features/auth/authSlice';
import {showAlert} from '../../../store/features/popup/popupSlice';
import AlertModal from '../../../components/AlertModal';

const ResetPassword = ({navigation}) => {
  const {isLoading, forgetEmail, message} = useSelector(store => store.auth);
  const {height} = useWindowDimensions();
  const dispatch = useDispatch();

  // states
  const [password, setPassword] = useState({value: '', error: ''});
  const [confirmPassword, setConfirmPassword] = useState({
    value: '',
    error: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const _resetAccountHandler = async () => {
    const passwordError = passwordValidator(password.value);
    if (passwordError) return setPassword({...password, error: passwordError});
    if (password.value !== confirmPassword.value) {
      setConfirmPassword({
        ...confirmPassword,
        error: 'Password doesnot match',
      });
      return;
    }
    const data = {
      email: forgetEmail,
      password: password.value,
    };
    await dispatch(forgetPasswordApiHandler({data, action: 'reset'}));
  };

  useEffect(() => {
    if (message.type) {
      dispatch(
        showAlert({
          title: 'Password Reset',
          subtitle: 'Your Password has been changed.',
          type: 'success',
          button: 'Done',
          onButtonPress: () => navigation.navigate('Login')
        }),
      );
      dispatch(resetMessage());
      dispatch(resetWholeState());
    }
  }, [message]);

  return (
    <Background src={require('../../../assets/second-bg.png')} blured fullWidth>
      <ScrollView>
        <View style={[styles.container, {height: height - 40}]}>
          <View>
            <Text style={styles.loginText}>
              Set new strong password for your account
            </Text>

            <TextInput
              placeholder="Password"
              value={password.value}
              onChangeText={text => setPassword({value: text, error: ''})}
              error={!!password.error}
              errorText={password.error}
              style={styles.inputStyle}
              dense
              secureTextEntry={showPassword ? false : true}
              LeftIcon={<Lock1 size={20} color={theme.colors.grey} />}
              RightIcon={
                !showPassword ? (
                  <TouchableOpacity
                    onPress={() => setShowPassword(true)}
                    activeOpacity={0.7}
                    style={{padding:8}}>
                    <Eye size={20} color={theme.colors.grey} />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={() => setShowPassword(false)}
                    activeOpacity={0.7}
                    style={{padding:8}}>
                    <EyeSlash size={20} color={theme.colors.grey} />
                  </TouchableOpacity>
                )
              }
            />

            <TextInput
              placeholder="Confirm Password"
              value={confirmPassword.value}
              onChangeText={text =>
                setConfirmPassword({value: text, error: ''})
              }
              error={!!confirmPassword.error}
              errorText={confirmPassword.error}
              style={styles.inputStyle}
              dense
              secureTextEntry={showConfirmPassword ? false : true}
              LeftIcon={<Lock1 size={20} color={theme.colors.grey} />}
              RightIcon={
                !showConfirmPassword ? (
                  <TouchableOpacity
                    onPress={() => setShowConfirmPassword(true)}
                    activeOpacity={0.7}>
                    <Eye size={20} color={theme.colors.grey} />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={() => setShowConfirmPassword(false)}
                    activeOpacity={0.7}>
                    <EyeSlash size={20} color={theme.colors.grey} />
                  </TouchableOpacity>
                )
              }
            />
          </View>
          <View>
            <Button
              mode="contained"
              primary
              labelStyle={styles.buttonLabel}
              disabled={isLoading}
              loading={isLoading}
              onPress={_resetAccountHandler}>
              Continue
            </Button>
          </View>
        </View>
        <AlertModal />
      </ScrollView>
    </Background>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    justifyContent: 'space-between',
  },
  inputStyle: {
    backgroundColor: 'transparent',
    color: 'white',
  },
  buttonLabel: {
    fontWeight: '500',
    fontSize: 20,
  },
  loginText: {
    color: theme.colors.grey,
    fontSize: 16,
    marginBottom: 40,
    marginTop: Platform.OS == 'ios' ? 50 : 30,
    lineHeight: 24,
    fontFamily: theme.fonts.regular.fontFamily,
  },
});

export default ResetPassword;
