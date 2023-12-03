import {useIsFocused} from '@react-navigation/native';
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import {
  View,
  Text,
  Button,
  SafeAreaView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
  useWindowDimensions,
  Platform,
} from 'react-native';
import {
  VESDK,
  VideoEditorModal,
  Configuration,
} from 'react-native-videoeditorsdk';
import {Camera, useCameraDevices} from 'react-native-vision-camera';
import {theme} from '../../theme';
import {launchImageLibrary} from 'react-native-image-picker';
import {ArrowLeft2, CloseSquare, Pause, Play} from 'iconsax-react-native';
import CreateChallengeForm from './CreateChallengeForm';
import CreateS3Challenge from './CreateS3Challenge';

const CreateChallenge = ({route, navigation}) => {
  const [hasPermission, setHasPermission] = useState(true);
  const isFocused = useIsFocused();
  const [cameraRotation, setCameraRotation] = useState('back');
  const [rotation, setRotation] = useState('0deg');
  const [flash, setFlash] = useState('off');
  const [recording, setRecording] = useState(false);
  const [pause, setPause] = useState(false);
  const [time, setTime] = useState(0);
  const [videoUrl, setVideoUrl] = useState('');

  const devices = useCameraDevices();
  const device = devices[cameraRotation];
  let camera = useRef(null);
  const {width} = useWindowDimensions();

  const handleRecording = async () => {
    setRecording(true);
    setPause(false);
    camera.current.startRecording({
      onRecordingFinished: video => {
        VESDK.openEditor(video.path).then(res => {
          if (res) {
            setVideoUrl(res.video);
          }
        });
      },
      onRecordingError: error => console.error('VIDEO ERR', error),
    });
    camera.current.getAvailableVideoCodecs('mp4');
  };

  const stopRecording = async () => {
    setRecording(false);
    await camera.current.stopRecording();
    setPause(false);
  };

  const _handleCameraRotation = () => {
    setCameraRotation(cameraRotation == 'back' ? 'front' : 'back');
  };

  const _pickVideoFromGallery = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'video',
      });
      if (result.assets.length) {
        VESDK.openEditor(result.assets[0].uri)
          .then(res => {
            if (res) {
              console.log(res);
              setVideoUrl(res.video);
              // setVideoUrl(result.assets[0]);
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const _handleRecordingPause = async () => {
    setPause(!pause);
    if (pause) {
      await camera.current.resumeRecording();
    } else {
      await camera.current.pauseRecording();
    }
    // pauseTimer();
  };

  const goBack = () => {
    setVideoUrl('');
  };

  const checkPermission = async () => {
    const status = await Camera.requestCameraPermission();
    const micStatus = await Camera.requestMicrophonePermission();

    // const cam = await Camera.getAvailableCameraDevices();

    status !== 'authorized' || micStatus !== 'authorized'
      ? setHasPermission(false)
      : setHasPermission(true);
  };

  useEffect(() => {
    checkPermission();
  }, []);

  const handletimer = () => {
    var countdown = setInterval(() => {
      if (!recording) {
        clearInterval(countdown);
        setTime(0);
        return;
      }

      if (pause === true) {
        clearInterval(countdown);
        return;
      }

      setTime(sec => sec + 1);
    }, 1000);
    return () => {
      clearInterval(countdown);
    };
  };
  useEffect(handletimer, [recording, pause]);

  if (!hasPermission) {
    return (
      // Camera screen back button padding
      <View style={[styles.container, { paddingTop: Platform.OS === 'ios' ? 50 : 20}]}>
        <TouchableOpacity
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            alignItems: 'center',
            flexDirection: 'row',
          }}
          onPress={() => navigation.goBack()}>
          <View
            style={{
              marginTop: Platform.OS == 'android' ? 20 : 50,
              paddingHorizontal: 10,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <ArrowLeft2 size="20" color="#ffffff" />
            <Text style={styles.backStyle}>Back</Text>
          </View>
        </TouchableOpacity>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <CloseSquare size={40} color={theme.colors.error} />
          <Text
            style={{
              color: '#fff',
              fontSize: 16,
              fontFamily: theme.fonts.medium.fontFamily,
              paddingVertical: 10,
            }}>
            You denied the camera permissions
          </Text>
          <TouchableOpacity onPress={() => checkPermission()}>
            <View>
              <Text
                style={{
                  color: theme.colors.primary,
                  fontSize: 15,
                  fontFamily: theme.fonts.medium.fontFamily,
                }}>
                Try Again
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      {!videoUrl ? (
        <>
          {device != null && hasPermission && (
            <>
              <Camera
                ref={camera}
                style={StyleSheet.absoluteFill}
                device={device}
                torch={flash}
                video={true}
                isActive={isFocused}
                audio={true}
                enableZoomGesture={true}
                // zoom={true}
              />
              {!recording && (
                <TouchableOpacity
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: Platform.OS == 'android' ? 0 : 50,
                    alignItems: 'center',
                    flexDirection: 'row',
                  }}
                  onPress={() => navigation.goBack()}>
                  <View
                    style={{
                      paddingVertical: 20,
                      paddingHorizontal: 10,
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <ArrowLeft2 size="20" color="#ffffff" />
                    <Text style={styles.backStyle}>Back</Text>
                  </View>
                </TouchableOpacity>
              )}
              {recording && (
                <View style={styles.timer}>
                  <View style={styles.timerBox}>
                    <View
                      style={{
                        backgroundColor: 'red',
                        height: 9,
                        width: 9,
                        borderRadius: 10,
                        marginTop: 1.5,
                      }}></View>
                    <Text style={{color: '#ffffff', marginLeft: 5}}>
                      {new Date(time * 1000).toISOString().substr(14, 5)}
                    </Text>
                  </View>
                </View>
              )}
              <View style={styles.actions}>
                <View
                  style={{width: (width - 64) / 3, alignItems: 'flex-start'}}>
                  {!recording && (
                    <TouchableOpacity onPress={() => _pickVideoFromGallery()}>
                      <Image
                        source={require('../../assets/gallery-image.png')}
                        style={{height: 40, width: 40}}
                      />
                      <Text style={styles.gallery}>Gallery</Text>
                    </TouchableOpacity>
                  )}
                </View>
                <View style={{width: (width - 64) / 3, alignItems: 'center'}}>
                  <TouchableOpacity
                    onPress={() =>
                      recording ? stopRecording() : handleRecording()
                    }>
                    <Image
                      source={
                        recording
                          ? require('../../assets/video-stop-button.png')
                          : require('../../assets/video-start-button.png')
                      }
                      style={{height: 54, width: 54}}
                    />
                  </TouchableOpacity>
                </View>
                {!recording ? (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      width: (width - 64) / 3,
                      justifyContent: 'flex-end',
                    }}>
                    <TouchableOpacity
                      style={styles.cameraWidget}
                      onPress={() => setFlash(flash == 'on' ? 'off' : 'on')}>
                      <Image
                        source={
                          flash == 'on'
                            ? require('../../assets/flash-slash-on.png')
                            : require('../../assets/flash-slash-off.png')
                        }
                        style={{height: 24, width: 24}}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.cameraWidget, {marginLeft: 15}]}
                      onPress={() => _handleCameraRotation()}>
                      <Animated.Image
                        source={require('../../assets/level.png')}
                        style={{
                          height: 22,
                          width: 22,
                          transform: [{rotate: rotation}],
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      width: (width - 64) / 3,
                    }}>
                    <TouchableOpacity
                      style={styles.cameraWidget}
                      onPress={() => _handleRecordingPause()}>
                      {!pause ? (
                        <Pause size="24" color="#ffffff" />
                      ) : (
                        <Play size="24" color="#ffffff" />
                      )}
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </>
          )}
        </>
      ) : (
        <CreateChallengeForm video={videoUrl} goBack={goBack} route={route} />
        // <CreateS3Challenge video={videoUrl}/>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#202020',
  },
  preview: {
    flex: 1,
  },
  actions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#202020',
    padding: 22,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  gallery: {
    color: '#ffffff',
    fontFamily: theme.fonts.regular.fontFamily,
    fontSize: 10,
    marginTop: 4,
    textAlign: 'center',
  },
  cameraWidget: {
    padding: 6,
    backgroundColor: '#ffffff22',
    borderRadius: 10,
  },
  timer: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    paddingTop: Platform.OS == 'android' ? 20 : 40,
    justifyContent: 'center',
  },
  timerBox: {
    backgroundColor: '#ffffff22',
    borderRadius: 4,
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
    alignSelf: 'center',
  },
  backStyle: {
    textShadowColor: '#00000066',
    textShadowOffset: {width: 0, height: 2},
    textShadowRadius: 4,
    color: '#fff',
  },
});

export default CreateChallenge;
