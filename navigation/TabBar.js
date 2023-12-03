import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TouchableNativeFeedback,
  Platform,
} from 'react-native';
import {
  Home,
  SearchNormal1,
  NotificationBing,
  User,
  Add,
} from 'iconsax-react-native';
import {theme} from '../theme';
import {useNavigation} from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import lottieCircle from '../lottie/white-circle.json';
import {useDispatch} from 'react-redux';
import {resetActiveId, setTabBarHeight} from '../store/features/home/homeSlice';

const TabBar = () => {
  const [activeTab, setActiveTab] = useState('tab-1');
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const activeTabHandle = screen => {
    navigation.navigate(screen);
    if (screen == 'Profile') {
      dispatch(resetActiveId());
    }
  };

  useEffect(() => {
    let route = navigation.getState().routes[0].state;
    if (route) {
      let newActiveTab = route.index;
      if (!route.routes[route.index].params) {
        setActiveTab(`tab-${newActiveTab + 1}`);
      }
    }
  });

  return (
    <View
      style={styles.container}
      onLayout={event =>
        dispatch(setTabBarHeight(event.nativeEvent.layout.height))
      }>
      <TouchableNativeFeedback
        useForeground={true}
        background={TouchableNativeFeedback.Ripple('#fff', true, 25)}
        onPress={() => activeTabHandle('Home')}>
        <View style={styles.icons}>
          <Home
            size="28"
            color={activeTab == 'tab-1' ? theme.colors.primary : '#777777'}
          />
        </View>
      </TouchableNativeFeedback>
      <TouchableNativeFeedback
        useForeground={true}
        background={TouchableNativeFeedback.Ripple('#fff', true, 25)}
        onPress={() => activeTabHandle('Search')}>
        <View style={styles.icons}>
          <SearchNormal1
            size="28"
            color={activeTab == 'tab-2' ? theme.colors.primary : '#777777'}
          />
        </View>
      </TouchableNativeFeedback>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => activeTabHandle('CreateChallenge')}>
        <View
          style={{
            width: 60,
            height: 60,
            justifyContent: 'center',
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <LottieView
            source={lottieCircle}
            loop
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              height: 56,
              width: 56,
              zIndex: 1,
            }}
          />
          <View
            style={{
              backgroundColor: theme.colors.primary,
              height: 45,
              width: 45,
              borderRadius: 45 / 2,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Add size="45" variant="Broken" color="#fff" />
          </View>
        </View>
      </TouchableOpacity>
      <TouchableNativeFeedback
        useForeground={true}
        background={TouchableNativeFeedback.Ripple('#fff', true, 25)}
        onPress={() => activeTabHandle('Notifications')}>
        <View style={styles.icons}>
          <NotificationBing
            size="28"
            color={activeTab == 'tab-3' ? theme.colors.primary : '#777777'}
          />
        </View>
      </TouchableNativeFeedback>
      <TouchableNativeFeedback
        useForeground={true}
        background={TouchableNativeFeedback.Ripple('#fff', true, 25)}
        onPress={() => activeTabHandle('Profile')}>
        <View style={styles.icons}>
          <User
            size="28"
            color={activeTab == 'tab-4' ? theme.colors.primary : '#777777'}
            style={styles.icons}
          />
        </View>
      </TouchableNativeFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#000',
    paddingHorizontal: 8,
    paddingBottom: Platform.OS == 'ios' ? 12 : 2,
    paddingTop: 2,
  },
  icons: {
    padding: 10,
  },
});
export default TabBar;
