import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Platform,
  useWindowDimensions,
} from 'react-native';
import TextInput from '../../../StyledComponents/TextInput';
import Background from '../../../shared/Background';
import Button from '../../../StyledComponents/Button';
import {theme} from '../../../theme';
import {useSelector, useDispatch} from 'react-redux';
import {Sms} from 'iconsax-react-native';
import {emailValidator} from '../../../utils';
import {
  forgetPasswordApiHandler,
  setForgetEmail,
  resetWholeState,
} from '../../../store/features/auth/authSlice';

const UserEmail = ({navigation}) => {
  const {errorMessage, isLoading, isCreated} = useSelector(store => store.auth);
  const dispatch = useDispatch();
  const {height} = useWindowDimensions();

  // states
  const [email, setEmail] = useState({value: '', error: ''});

  const _EmailVerifier = async () => {
    const emailError = emailValidator(email.value);

    if (emailError) {
      setEmail({...email, error: emailError});
    } else {
      const data = {
        email: email.value,
      };
      await dispatch(forgetPasswordApiHandler({data, action: 'forget'}));
    }
  };

  useEffect(() => {
    if (isCreated && !errorMessage) {
      navigation.navigate('SendOtp');
      dispatch(resetWholeState());
      dispatch(setForgetEmail(email.value));
    }
  }, [errorMessage, isCreated]);

  return (
    <Background src={require('../../../assets/second-bg.png')} blured fullWidth>
      <ScrollView>
        <View style={[styles.container, {height: height - 40}]}>
          <View>
            <Text style={styles.loginText}>
              Forget Password? Enter your registred email to get verification
              code
            </Text>

            <TextInput
              placeholder="Email"
              returnKeyType="next"
              value={email.value}
              onChangeText={text => setEmail({value: text, error: ''})}
              error={!!email.error || errorMessage}
              errorText={email.error || errorMessage}
              autoCapitalize="none"
              autoCompleteType="email"
              textContentType="emailAddress"
              keyboardType="email-address"
              dense
              LeftIcon={<Sms size={20} color={theme.colors.grey} />}
              style={styles.inputStyle}
              leftIcon="envelope"
            />
          </View>
          <View>
            <Button
              mode="contained"
              primary
              labelStyle={styles.buttonLabel}
              disabled={isLoading}
              loading={isLoading}
              onPress={_EmailVerifier}>
              Continue
            </Button>
          </View>
        </View>
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

export default UserEmail;
