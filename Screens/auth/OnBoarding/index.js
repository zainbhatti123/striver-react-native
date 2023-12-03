import {
  StyleSheet,
  useWindowDimensions,
  Text,
  View,
  Image,
  TouchableHighlight,
} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import Onboarding from 'react-native-onboarding-swiper';
import {OnBoardingText} from './onboarding.styles';

import LottieView from 'lottie-react-native';
import lottieCircle from '../../../lottie/circle.json';
import {theme} from '../../../theme';
import {useDispatch} from 'react-redux';
import {setOnBoarding} from '../../../store/features/auth/authSlice';
import { useAsyncStorage } from '../../../hooks/UseAsyncStorage';

const OnBoarding = ({navigation}) => {
  const {width, height} = useWindowDimensions();
  const [pageNum, setPageNum] = useState(0);
  const dispatch = useDispatch();
  const [, setOnboard] = useAsyncStorage('onboard');

  const onboardingRef = useRef(null);

  const onboardingHandler = () => {
    navigation.navigate('createAccount');
    setOnboard(true);
  };

  const autoSlide = () => {
    const wait = new Promise(resolve => setTimeout(resolve, 4000));
    wait.then(() => {
      if (pageNum < 2) {
        onboardingRef.current?.goNext(pageNum, true);
      } else {
        setPageNum(0);
      }
    }).catch((error) => {
      console.log(error)
    });
  };

  useEffect(() => {
    if (pageNum < 2) {
      autoSlide();
    }
  }, [pageNum]);

  return (
    <Onboarding
      showPagination={false}
      ref={onboardingRef}
      showNext={true}
      transitionAnimationDuration={4000}
      imageContainerStyles={{padding: 10, margin: 10}}
      pageIndexCallback={index => setPageNum(index)}
      pages={[
        {
          backgroundColor: '#000',
          title: '',
          subtitle: '',
          image: (
            <View>
              <View style={{width, height}}>
                <Image
                  style={styles.onBoardImage}
                  source={require('../../../assets/first.png')}
                />
              </View>
              <View
                style={{
                  position: 'absolute',
                  bottom: -25,
                  paddingHorizontal: 10,
                }}>
                <Image
                  source={require('../../../assets/striver.png')}
                  style={{
                    marginBottom: 8,
                    width: 200,
                    height: 48,
                    marginLeft: -5,
                  }}
                  resizeMode="contain"></Image>

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: width,
                  }}>
                  <View>
                    <Text style={styles.title1}>The</Text>
                    <OnBoardingText>alternative</OnBoardingText>
                    <OnBoardingText>to social media</OnBoardingText>
                  </View>
                  <TouchableHighlight
                    style={{marginRight: 20}}
                    onPress={onboardingHandler}>
                    <>
                      <View
                        style={{
                          width: 85,
                          height: 85,
                          justifyContent: 'center',
                        }}>
                        <LottieView source={lottieCircle} autoPlay loop />
                        <Text
                          style={{
                            color: theme.colors.primary,
                            textAlign: 'center',
                            textTransform: 'uppercase',
                          }}>
                          <Text
                            style={{
                              fontSize: 16,
                              fontFamily: theme.fonts.gBold.fontFamily,
                            }}>
                            Join
                          </Text>
                          {'\n'}
                          <Text
                            style={{
                              fontSize: 14,
                              fontWeight: '300',
                              fontFamily: theme.fonts.gThin.fontFamily,
                            }}>
                            Now
                          </Text>
                        </Text>
                      </View>
                    </>
                  </TouchableHighlight>
                </View>
              </View>
            </View>
          ),
        },
        {
          backgroundColor: '#000',
          title: '',
          subtitle: '',
          image: (
            <View>
              <View style={{width, height}}>
                <Image
                  style={[styles.onBoardImage]}
                  source={require('../../../assets/second.png')}
                />
              </View>
              <View
                style={{
                  position: 'absolute',
                  bottom: -25,
                  paddingHorizontal: 10,
                }}>
                <Image
                  source={require('../../../assets/striver.png')}
                  style={{
                    marginBottom: 8,
                    width: 200,
                    height: 48,
                    marginLeft: -5,
                  }}
                  resizeMode="contain"></Image>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: width,
                  }}>
                  <View>
                    <Text style={styles.title1}>Your activity</Text>
                    <OnBoardingText>earns you</OnBoardingText>
                    <OnBoardingText>Kudos</OnBoardingText>
                  </View>
                  <TouchableHighlight
                    style={{marginRight: 20}}
                    onPress={onboardingHandler}>
                    <>
                      <View
                        style={{
                          width: 85,
                          height: 85,
                          justifyContent: 'center',
                        }}>
                        <LottieView source={lottieCircle} autoPlay loop />
                        <Text
                          style={{
                            color: theme.colors.primary,
                            textAlign: 'center',
                            textTransform: 'uppercase',
                          }}>
                          <Text
                            style={{
                              fontSize: 16,
                              fontFamily: theme.fonts.gBold.fontFamily,
                            }}>
                            Join
                          </Text>
                          {'\n'}
                          <Text
                            style={{
                              fontSize: 14,
                              fontFamily: theme.fonts.gThin.fontFamily,
                            }}>
                            Now
                          </Text>
                        </Text>
                      </View>
                    </>
                  </TouchableHighlight>
                </View>
              </View>
            </View>
          ),
        },
        {
          backgroundColor: '#000',
          title: '',
          subtitle: '',
          image: (
            <View>
              <View style={{width, height}}>
                <Image
                  style={styles.onBoardImage}
                  source={require('../../../assets/third.png')}
                />
              </View>
              <View
                style={{
                  position: 'absolute',
                  bottom: -25,
                  paddingHorizontal: 10,
                }}>
                <Image
                  source={require('../../../assets/striver.png')}
                  style={{
                    marginBottom: 8,
                    width: 200,
                    height: 48,
                    marginLeft: -5,
                  }}
                  resizeMode="contain"></Image>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: width,
                  }}>
                  <View>
                    <Text style={styles.title1}>Setting a</Text>
                    <OnBoardingText>higher standard,</OnBoardingText>
                    <OnBoardingText>together</OnBoardingText>
                  </View>
                  <TouchableHighlight
                    style={{marginRight: 20}}
                    onPress={onboardingHandler}>
                    <>
                      <View
                        style={{
                          width: 85,
                          height: 85,
                          justifyContent: 'center',
                        }}>
                        <LottieView source={lottieCircle} autoPlay loop />
                        <Text
                          style={{
                            color: theme.colors.primary,
                            textAlign: 'center',
                            textTransform: 'uppercase',
                          }}>
                          <Text
                            style={{
                              fontSize: 16,
                              fontFamily: theme.fonts.gBold.fontFamily,
                            }}>
                            Join
                          </Text>
                          {'\n'}
                          <Text style={{fontSize: 14, fontWeight: '300'}}>
                            Now
                          </Text>
                        </Text>
                      </View>
                    </>
                  </TouchableHighlight>
                </View>
              </View>
            </View>
          ),
        },
      ]}
    />
  );
};

export default OnBoarding;

const styles = StyleSheet.create({
  onBoardImage: {
    width: '100%',
    height: '100%',
    bottom: -35,
  },
  title1: {
    color: 'white',
    textTransform: 'uppercase',
    fontSize: 20,
    marginBottom: 0,
    fontFamily: theme.fonts.gLight.fontFamily,
  },
  shadow: {
    shadowColor: '#fff',
    shadowOffset: {
      width: 10,
      height: 10,
    },
  },
});
