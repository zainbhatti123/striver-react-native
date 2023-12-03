import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  Animated,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import convertToProxyURL from 'react-native-video-cache';
import Video from 'react-native-video';
import {theme} from '../../theme';
import Activities from './Activity';
import PlaySvg from '../../components/svg/PlaySvg';
import {SheetManager} from 'react-native-actions-sheet';
import {useIsFocused} from '@react-navigation/native';
import {Play} from 'iconsax-react-native';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {setActiveProfileId} from '../../store/features/home/homeSlice';

export default function VideoItem({
  data,
  isActive,
  isResponse,
  activeChallenge,
}) {
  const [videoLoading, setVideoLoading] = useState(false);
  const [paused, setPaused] = useState(false);
  const [statusBarHeight, setStatusBarHeight] = useState(0);
  const {uri} = data;
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {userData: ownData} = useSelector(store => store.auth);

  console.log(data);

  useEffect(() => {
    if (isActive) {
      setPaused(false);
    }
  }, [isActive]);

  useEffect(() => {
    if (!isFocused) {
      setPaused(true);
    }
    
  }, [isFocused]);

  useEffect(() => {
    setStatusBarHeight(StatusBar.currentHeight || 0);
  }, [statusBarHeight]);

  const handleUserProfile = () => {
    dispatch(setActiveProfileId(data.userId._id));
    if (data.userId?._id !== ownData?._id) {
      navigation.navigate('Profile', 'userProfile');
    } else {
      navigation.navigate('Profile');
    }
  };

  return (
    <View style={[styles.container]}>
      <Video
        source={{
          uri: convertToProxyURL(uri),
          headers: {
            Range: 'bytes=0-2',
          },
        }}
        bufferConfig={{
          minBufferMs: 1,
          maxBufferMs: 10,
          bufferForPlaybackMs: 1,
          bufferForPlaybackAfterRebufferMs: 0.5,
        }}
        style={styles.video}
        resizeMode="cover"
        fullscreenOrientation="portrait"
        paused={!isActive || !isFocused || paused}
        onLoadStart={() => setVideoLoading(true)}
        onReadyForDisplay={() => setVideoLoading(false)}
        onLoad={() => {
          setVideoLoading(false);
        }}
        repeat
        automaticallyWaitsToMinimizeStalling={false}
      />
      {videoLoading && (
        <View style={styles.videoLoading}>
          <Text style={{color: '#fff', fontSize: 20}}>Loading</Text>
        </View>
      )}
      {!videoLoading && !paused && (
        <View style={[styles.overlay, {backgroundColor: 'transparent'}]}>
          <TouchableOpacity
            activeOpacity={1}
            style={styles.overlay}
            onPress={() => setPaused(true)}
          />
        </View>
      )}
      {paused && (
        <View style={[styles.overlay]}>
          <TouchableOpacity
            activeOpacity={1}
            style={styles.overlay}
            onPress={() => setPaused(false)}>
            <Play size="50" color="#fff" variant="Broken" />
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.activityParent}>
        <Activities
          videoData={data}
          isResponse={isResponse}
          activeChallenge={activeChallenge}
        />
      </View>

      <View style={styles.profileParent}>
        <View style={{flex: 1}}>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => handleUserProfile()}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image
                source={{uri: data.userId?.profileImage}}
                style={{width: 35, height: 35, borderRadius: 35}}></Image>
              <Text style={styles.userName}>
                {data.userId?.firstName} {data.userId?.lastName}
              </Text>
            </View>
          </TouchableOpacity>
          <Text style={styles.title}>{data.title}</Text>
          <TouchableOpacity activeOpacity={1} style={{flexDirection: 'row'}}>
            <Text style={[styles.details, {maxWidth: '70%'}]} numberOfLines={1}>
              {data.description}{' '}
            </Text>
            <TouchableOpacity
              onPress={() =>
                SheetManager.show('seeMoreSheet', {
                  data: data,
                  type: isResponse ? 'response' : 'challenge',
                })
              }>
              <Text style={[styles.details, {textDecorationLine: 'underline'}]}>
                See more
              </Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </View>
        {!isResponse && (
          <>
            {data.challengeResponses.length !== 0 && (
              <View style={{flexGrow: 0, flexShrink: 1}}>
                <Text
                  style={{
                    textAlign: 'center',
                    color: '#fff',
                    fontSize: 14,
                    fontFamily: theme.fonts.medium.fontFamily,
                  }}>
                  Responses
                </Text>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => navigation.navigate('Responses', data)}>
                  <Image
                    source={{
                      uri: data.challengeResponses[0].responseId.thumbNail,
                    }}
                    style={styles.response}></Image>
                  <View style={styles.overlay}>
                    <View style={{height: 24, width: 24}}>
                      <PlaySvg viewBox="0 0 24 24" />
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            )}
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    backgroundColor: '#000000',
  },
  video: {
    // ...StyleSheet.absoluteFill,
    width: '100%',
    height: '100%',
  },
  activityParent: {
    justifyContent: 'flex-end',
    flexDirection: 'row',
    alignItems: 'flex-end',
    // marginBottom: 20,
    width: 80,
    marginTop: 'auto',
  },
  profileParent: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingBottom: 10,
    alignItems: 'center',
  },
  userName: {
    color: '#fff',
    fontFamily: theme.fonts.medium.fontFamily,
    fontSize: 14,
    marginLeft: 8,
  },
  title: {
    fontSize: 14,
    fontFamily: theme.fonts.bold.fontFamily,
    color: '#fff',
    marginTop: 8,
  },
  details: {
    fontSize: 11,
    fontFamily: theme.fonts.medium.fontFamily,
    color: '#fff',
  },
  response: {
    height: 110,
    width: 100,
    resizeMode: 'contain',
    borderRadius: 8,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00000025',
  },
  filters: {
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundVideo: 'transparent',
    position: 'absolute',
    zIndex: 2,
    left: 0,
    right: 0,
    top: Platform.OS == 'android' ? 25 : 40,
  },
  activityFilter: {
    backgroundColor: '#ffffff33',
    paddingTop: 6,
    paddingBottom: 4,
    paddingHorizontal: 16,
    textShadowColor: '#00000066',
    textShadowOffset: {width: 0, height: 2},
    textShadowRadius: 4,
    color: '#fff',
    borderRadius: 8,
    fontSize: 16,
    fontFamily: theme.fonts.medium.fontFamily,
  },
  videoLoading: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    flexDirection: 'row',
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
