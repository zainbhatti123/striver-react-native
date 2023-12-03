import React, {useState, useRef, useEffect, memo, useMemo} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
  Platform,
} from 'react-native';
import {Play} from 'iconsax-react-native';
import Video from 'react-native-video';

const VideoPlayer = ({url, videoPlayer, viewAble}) => {
  const [videoLoading, setVideoLoading] = useState(false);
  const [paused, setPaused] = useState(false);
  const {height} = useWindowDimensions();
  const player = useRef(null);

  useEffect(() => {
    // setPaused(viewAble);
    // console.log(viewAble);
    // if(pausing){
    //   player.play();
    // } else {
    //   player.pause();
    // }
    // if (itemKey != index) {
    //   if (viewAble) {
    //     setPaused(false);
    //   } else {
    //     setPaused(true);
    //   }
    // }
    // console.log(videoPlayer);
    if (videoPlayer.key === videoPlayer.index) {
      setPaused(false);
    } else {
      setPaused(true);
    }
  }, []);

  return (
    <>
      <Video
        source={{
          uri: url,
        }}
        ref={player}
        repeat={true}
        paused={paused}
        fullscreenAutorotate={false}
        playWhenInactive={false}
        allowsExternalPlayback={false}
        playInBackground={false}
        resizeMode="contain"
        fullscreenOrientation="portrait"
        preventsDisplaySleepDuringVideoPlayback={true}
        onLoadStart={() => setVideoLoading(true)}
        onReadyForDisplay={() => setVideoLoading(false)}
        onLoad={() => {
          setVideoLoading(false);
        }}
        style={styles.backgroundVideo}
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
    </>
  );
};

const styles = StyleSheet.create({
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: '#000',
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

export default memo(VideoPlayer);
