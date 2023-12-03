import React, {useEffect, useLayoutEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
  ActivityIndicator,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {theme} from '../../theme';
import {ArrowLeft2} from 'iconsax-react-native';
import TextInput from '../../StyledComponents/TextInput';
import Button from '../../StyledComponents/Button';
import {Chip, RadioButton} from 'react-native-paper';
import CrossSvg from '../../components/svg/CrossSvg';
import {useDispatch, useSelector} from 'react-redux';
import {postChallengesApiHandler} from '../../store/features/challenge/challengeSlice';
import {postFilesApiHandler} from '../../store/features/files/filesSlice';
import {valueValidator} from '../../utils';
// import RNFetchBlob from 'rn-fetch-blob';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {setSuccess} from '../../store/features/challenge/challengeSlice';
import {showAlert} from '../../store/features/popup/popupSlice';
import VideoSuccessIcon from '../../components/svg/VideoSuccessIcon';
import AlertModal from '../../components/AlertModal';
import {createThumbnail} from 'react-native-create-thumbnail';
import {RNS3} from 'react-native-aws3';

// import ReactNativeChipInput from 'react-native-chip-input';

const CreateChallengeForm = ({route, goBack, video}) => {
  const navigation = useNavigation();
  const {isLoading, success, invalid} = useSelector(state => state.challenge);
  const [postLoading, setPostLoading] = useState(false);
  const {height} = useWindowDimensions();
  const [hashtags, setHashtags] = useState([]);
  const [currentHashtag, setCurrentHashtag] = useState('');
  const [hashtagBoxActive, setHashtagBoxActive] = useState(false);
  const [title, setTitle] = useState({value: '', error: ''});
  const [description, setDescription] = useState({value: '', error: ''});
  const [trophy, setTrophy] = useState({value: '', error: ''});
  const [hashtagError, setHashtagError] = useState('');
  const dispatch = useDispatch();
  const [responseMode, setResponseMode] = useState(false);
  const [type, setType] = useState('video');

  const _setHashtag = () => {
    currentHashtag != '' && setHashtags([...hashtags, currentHashtag]);
    setCurrentHashtag('');
    setHashtagError('');
  };

  const _removeHashtags = index => {
    setHashtags([
      ...hashtags.slice(0, index),
      ...hashtags.slice(index + 1, hashtags.length),
    ]);
    setHashtagError('');
  };

  const submitChallenge = videoData => {
    let data = {
      uri: videoData.location,
      title: title.value,
      description: description.value,
      thumbNail: 'thumbNail',
      hashTag: hashtags,
      challengeType: type,
      challengeTageTo: 'tag',
      trophy: trophy.value,
    };
    dispatch(postChallengesApiHandler({data: data, type: 'challenge'}));
  };
  const submitResponseChallenge = videoData => {
    // console.log(route);
    let data = {
      challengeId: route.params.challenge._id,
      challengeResponse: {
        uri: videoData.location,
        title: title.value,
        description: description.value,
        thumbNail: 'thumbNail',
        hashTag: hashtags,
        challengeType: type,
        like: 1,
        trophy: trophy.value,
        views: 2,
      },
    };
    dispatch(postChallengesApiHandler({data: data, type: 'response'}));
  };

  const handleSubmittion = async () => {
    const checkTitle = valueValidator(title.value, 'Title');
    const checkDescription = valueValidator(description.value, 'Description');
    const checkTrophy = valueValidator(trophy.value, 'Trophy');
    if (
      checkTitle ||
      checkDescription ||
      (checkTrophy && !responseMode) ||
      !hashtags.length
    ) {
      checkTitle && setTitle({...title, error: checkTitle});
      checkDescription &&
        setDescription({...description, error: checkDescription});
      checkTrophy && setTrophy({...trophy, error: checkTrophy});
      !hashtags.length && setHashtagError('At least 1 hashtag is required');
      return;
    }
    try {
      setPostLoading(true);
      let token = await AsyncStorage.getItem('token');
      const fileName = Math.random().toString().substr(2) + '.mp4';
      const file = {
        uri: video,
        name: fileName,
        type: 'video/mp4',
      };

      const options = {
        bucket: 'strivedev',
        region: 'eu-west-2',
        accessKey: 'AKIAUNBZXHMHGPLLLLWN',
        secretKey: '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',
      };
      await RNS3.put(file, options).then(response => {
        if (response.status !== 201) {
          throw new Error('Failed to upload image to S3');
        }
        if (route.params?.challenge) {
          submitResponseChallenge(response.body.postResponse);
        } else {
          submitChallenge(response.body.postResponse);
        }
      });
    } catch (error) {
      dispatch(
        showAlert({
          title: 'Error',
          subtitle: 'Something went wrong!!',
          type: 'error',
          button: 'Ok',
        }),
      );
      setPostLoading(false);
      console.log(error, '???????????????????');
    }
  };

  useEffect(() => {
    if (route?.params) {
      setResponseMode(true);
      setTitle({...title, value: route.params.challenge.title});
      setDescription({
        ...description,
        value: route.params.challenge.description,
      });
      setHashtags(route.params.challenge.hashTag);
    } else {
      setResponseMode(false);
    }
  }, [route]);

  useEffect(() => {
    if (success) {
      dispatch(
        showAlert({
          title: `${responseMode ? 'Response' : 'Video'} Posted`,
          subtitle: `Your ${
            responseMode ? 'response' : 'video'
          } has been sent to moderation. We will let you know once it is live.`,
          type: 'success',
          Icon: (
            <View style={{height: 72, width: 72}}>
              <VideoSuccessIcon viewBox="0 0 72 72" />
            </View>
          ),
          button: 'Ok',
          onButtonPress: () => navigation.navigate('root'),
        }),
      );
      setPostLoading(false);
    }

    if (invalid) {
      dispatch(
        showAlert({
          title: 'Error',
          subtitle: 'Something went wrong',
          type: 'error',
          button: 'Ok',
        }),
      );
      setPostLoading(false);
    }
    return () => {
      dispatch(setSuccess());
    };
  }, [success, invalid]);

  return (
    <ScrollView keyboardShouldPersistTaps="handled">
      <KeyboardAwareScrollView>
        <View style={[styles.container, {minHeight: height}]}>
          <View style={styles.header}>
            <Text style={styles.heading}>
              Create {responseMode ? 'Response' : 'Challenge'}
            </Text>
            <TouchableOpacity
              style={{
                position: 'absolute',
                left: 0,
                bottom: 0,
                top: 0,
                alignItems: 'center',
                flexDirection: 'row',
              }}
              onPress={() => goBack()}>
              <ArrowLeft2 size="25" color="#ffffff" />
            </TouchableOpacity>
          </View>
          <View style={{marginTop: 20}}>
            <View style={{marginBottom: 20}}>
              <Text style={styles.label}>
                {responseMode ? 'Response' : 'Challenge'} Title
              </Text>
              <TextInput
                placeholder={`Enter ${
                  responseMode ? 'response' : 'challenge'
                } title`}
                value={title.value}
                error={!!title.error}
                errorText={title.error}
                onChangeText={val => setTitle({value: val, error: ''})}
                style={styles.input}
                outlineColor="#6A6A6A22"
              />
            </View>
            <View style={{marginBottom: 20}}>
              <Text style={styles.label}>
                Describe your {responseMode ? 'response' : 'challenge'}
              </Text>
              <TextInput
                placeholder="This video is about.. "
                value={description.value}
                error={!!description.error}
                errorText={description.error}
                onChangeText={val => setDescription({value: val, error: ''})}
                style={styles.input}
                outlineColor="#6A6A6A22"
                multiline
                numberOfLines={4}
              />
            </View>
            {!responseMode && (
              <View style={{marginBottom: 20}}>
                <Text style={styles.label}>Assigned Trophy</Text>
                <TextInput
                  placeholder="Enter your trophy name"
                  value={trophy}
                  error={!!trophy.error}
                  errorText={trophy.error}
                  onChangeText={val => setTrophy({value: val, error: ''})}
                  style={styles.input}
                  outlineColor="#6A6A6A22"
                />
              </View>
            )}
            {!responseMode && (
              <View style={{marginBottom: 20}}>
                <Text style={[styles.label, {marginBottom: 5}]}>
                  Challenge Type
                </Text>
                <View>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <RadioButton
                      value="Video Challenge"
                      color={theme.colors.primary}
                      status={type === 'video' ? 'checked' : 'unchecked'}
                      onPress={() => setType('video')}
                      uncheckedColor="#ffffff55"
                    />
                    <Text
                      onPress={() => setType('video')}
                      style={{
                        color:
                          type === 'video' ? theme.colors.primary : '#ffffff77',
                        fontFamily: theme.fonts.medium.fontFamily,
                      }}>
                      Video Challenge
                    </Text>
                  </View>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <RadioButton
                      color={theme.colors.primary}
                      value="Conversation Challenge"
                      status={type === 'conversation' ? 'checked' : 'unchecked'}
                      onPress={() => setType('conversation')}
                      uncheckedColor="#ffffff55"
                    />
                    <Text
                      onPress={() => setType('conversation')}
                      style={{
                        color:
                          type === 'conversation'
                            ? theme.colors.primary
                            : '#ffffff77',
                        fontFamily: theme.fonts.medium.fontFamily,
                      }}>
                      Conversation Challenge
                    </Text>
                  </View>
                </View>
              </View>
            )}
            <View style={{marginBottom: 20}}>
              <Text style={[styles.label, {marginBottom: 5}]}>
                Add Hashtags
              </Text>
              <View
                style={[
                  styles.hashtagBox,
                  !hashtags.length && {paddingTop: 0, paddingLeft: 0},
                  hashtagError && {
                    borderWidth: 1,
                    borderColor: theme.colors.error,
                  },
                  hashtagBoxActive && {borderWidth: 2, borderColor: '#ffffff'},
                ]}>
                <View
                  style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    flex: 0,
                  }}>
                  {hashtags.length > 0 && (
                    <>
                      {hashtags.map((item, index) => (
                        <Chip
                          key={index}
                          closeIcon={() => (
                            <TouchableOpacity
                              style={{height: 15, width: 15, marginTop: 5}}
                              onPress={() => _removeHashtags(index)}>
                              <CrossSvg viewBox="0 0 12 12" />
                            </TouchableOpacity>
                          )}
                          onClose={() => _removeHashtags(index)}
                          style={styles.chipStyle}>
                          <Text style={{color: '#ffffff', fontSize: 16}}>
                            {item}
                          </Text>
                        </Chip>
                      ))}
                    </>
                  )}
                </View>
                <View>
                  <TextInput
                    placeholder={
                      hashtags.length >= 5
                        ? "You can't add more hashtags"
                        : 'Add Hashtags'
                    }
                    style={styles.hashtagInput}
                    blurOnSubmit={false}
                    value={currentHashtag}
                    activeOutlineColor="transparent"
                    outlineColor="transparent"
                    placeholderTextColor={
                      hashtags.length >= 5 && theme.colors.grey
                    }
                    onChangeText={val => {
                      if (val.endsWith(' ')) {
                        val.trim();
                        setCurrentHashtag(val);
                        _setHashtag();
                      } else {
                        setCurrentHashtag(val);
                      }
                    }}
                    onFocus={() => setHashtagBoxActive(true)}
                    onBlur={() => setHashtagBoxActive(false)}
                    onSubmitEditing={() => currentHashtag && _setHashtag()}
                    dense
                    disabled={hashtags.length >= 5 ? true : false}
                  />
                </View>
              </View>

              <Text
                style={[
                  styles.label,
                  {fontSize: 12, marginTop: 8},
                  hashtagError && {color: theme.colors.error},
                ]}>
                {hashtagError ? hashtagError : 'You can add 5 tags maximum'}
              </Text>
            </View>
          </View>
          <View style={{marginTop: 'auto'}}>
            <Button
              mode="contained"
              primary
              style={{borderRadius: 4}}
              labelStyle={{fontSize: 16}}
              loading={isLoading || postLoading}
              disabled={isLoading || postLoading}
              onPress={handleSubmittion}>
              Post {responseMode ? 'Response' : 'Challenge'}
            </Button>
          </View>
        </View>
        <AlertModal />
      </KeyboardAwareScrollView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#202020',
    flex: 1,
    padding: 15,
    paddingTop: Platform.OS == 'android' ? 15 : 40,
    flexDirection: 'column',
  },
  heading: {
    fontFamily: theme.fonts.medium.fontFamily,
    fontSize: 20,
    color: '#fff',
  },
  header: {
    alignItems: 'center',
    borderBottomColor: '#ffffff22',
    borderBottomWidth: 1,
    paddingVertical: 10,
  },
  label: {
    color: '#ffffff77',
    fontFamily: theme.fonts.regular.fontFamily,
    fontSize: 14,
  },
  input: {
    backgroundColor: '#6A6A6A22',
  },
  hashtagBox: {
    backgroundColor: '#6A6A6A22',
    padding: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'transparent',
    flex: 1,
  },
  chipStyle: {
    backgroundColor: '#ffffff22',
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  hashtagInput: {
    backgroundColor: '#4545',
    marginLeft: 8,
  },
});

export default CreateChallengeForm;
