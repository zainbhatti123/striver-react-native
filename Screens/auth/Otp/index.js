import React, {useEffect, useLayoutEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Platform,
  useWindowDimensions,
  TouchableOpacity,
} from 'react-native';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import Background from '../../../shared/Background';
import Button from '../../../StyledComponents/Button';
import {theme} from '../../../theme';
import {useSelector, useDispatch} from 'react-redux';
import {
  forgetPasswordApiHandler,
  resetMessage,
} from '../../../store/features/auth/authSlice';
import {showAlert} from '../../../store/features/popup/popupSlice';
import AlertModal from '../../../components/AlertModal';

const SendOtp = ({navigation}) => {
  const {message, isLoading, forgetEmail} = useSelector(store => store.auth);
  const {height} = useWindowDimensions();
  const dispatch = useDispatch();

  // states
  const [otp, setOtp] = useState('');
  const [resendActive, setResendActive] = useState(false);
  const [time, setTime] = useState(0);
  const [disable, setDisable] = useState(false);
  const [otpSuccess, setOtpSuccess] = useState(false);

  const Timer = () => {
    let newTime = 60;
    setTime(newTime);
    setResendActive(false);
    let timerInterval = setInterval(() => {
      if (newTime > 0) {
        let finalTime = newTime--;
        setTime(finalTime);
      } else if (newTime <= 0) {
        clearInterval(timerInterval);
        setResendActive(true);
      }
    }, 1000);
  };

  const _resendOtp = async () => {
    if (resendActive) {
      setOtpSuccess(false);
      const data = {
        email: forgetEmail,
      };
      await dispatch(forgetPasswordApiHandler({data, action: 'forget'}));
      setResendActive(false);
      Timer();
    }
  };

  const _sendOtpHandler = async () => {
    setOtpSuccess(true);
    const data = {
      email: forgetEmail,
      otp,
    };
    await dispatch(forgetPasswordApiHandler({data, action: 'otp'}));
  };

  useLayoutEffect(() => {
    if (otp.length == 4) {
      setDisable(false);
    } else {
      setDisable(true);
    }
    if (!resendActive && time == 0) {
      Timer();
    }
  }, [otp, time]);

  useEffect(() => {
    if (message.type) {
      if (otpSuccess && message.type == 'success') {
        navigation.navigate('ResetPassword');
      } else {
        dispatch(
          showAlert({
            title: 'OTP Resend',
            subtitle:
              message.type == 'success'
                ? `OTP has been send to ${forgetEmail}`
                : message.text,
            type: message.type,
            button: message.type == 'error' ? 'Ok' : 'Done',
          }),
        );
      }
      dispatch(resetMessage());
    }
  }, [message]);

  return (
    <>
      <Background
        src={require('../../../assets/second-bg.png')}
        blured
        fullWidth>
        <ScrollView>
          <View style={[styles.container, {height: height - 40}]}>
            <View>
              <Text style={styles.loginText}>
                We have sent a verfication code at{' '}
                <Text style={{color: '#fff'}}>{forgetEmail}</Text>
              </Text>
              <View style={{justifyContent: 'center', flexDirection: 'row'}}>
                <OTPInputView
                  style={styles.optContainer}
                  pinCount={4}
                  autoFocusOnLoad
                  keyboardType="numeric"
                  onCodeChanged={code => {
                    setOtp(code);
                  }}
                  codeInputFieldStyle={styles.underlineStyleBase}
                  codeInputHighlightStyle={styles.underlineStyleHighLighted}
                />
              </View>
              {/* {errorMessage && <Text style={styles.error}>{errorMessage}</Text>} */}
            </View>
            <View>
              <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                <Text style={styles.resend}>Didn't receive an opt?</Text>
                <TouchableOpacity
                  style={{marginRight: 3}}
                  onPress={_resendOtp}
                  activeOpacity={resendActive ? 0.6 : 1}>
                  <Text
                    style={[
                      resendActive
                        ? styles.resendActive
                        : styles.resendDeactive,
                    ]}>
                    Resend
                  </Text>
                </TouchableOpacity>
                {!resendActive && <Text style={styles.resend}>in {time}s</Text>}
              </View>
              <Button
                mode="contained"
                primary
                labelStyle={styles.buttonLabel}
                disabled={isLoading || disable}
                loading={isLoading}
                onPress={_sendOtpHandler}>
                Continue
              </Button>
            </View>
          </View>
        </ScrollView>
      </Background>
      <AlertModal />
    </>
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
  optContainer: {
    width: '80%',
    height: 150,
  },

  underlineStyleBase: {
    width: 56,
    height: 56,
    borderWidth: 1,
    fontSize: 16,
    borderRadius: 8,
    borderColor: theme.colors.grey,
  },

  underlineStyleHighLighted: {
    borderColor: '#fff',
  },
  resend: {
    color: '#fff',
    fontSize: 13,
    textAlign: 'center',
    fontFamily: theme.fonts.regular.fontFamily,
    marginRight: 3,
  },
  resendActive: {
    textDecorationLine: 'underline',
    fontWeight: '500',
    color: '#fff',
  },
  resendDeactive: {
    color: theme.colors.grey,
    fontWeight: '500',
  },
});

export default SendOtp;
