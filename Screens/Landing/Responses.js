import React, {useState} from 'react';
import PagerView from 'react-native-pager-view';
import {StyleSheet, TouchableOpacity, Text, View, Platform} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {HttpClient} from '../../Api/config';
import ConfirmationModal from '../../components/ConfirmationModal';
import {setConfirmationModel} from '../../store/features/popup/popupSlice';
import VideoPlayer from './videoPlayer';
import {useCallback} from 'react';
import {ArrowLeft2} from 'iconsax-react-native';
import {theme} from '../../theme';
import {useEffect} from 'react';
import {setAllChallenges} from '../../store/features/challenge/challengeSlice';
import {useIsFocused} from '@react-navigation/native';

const Responses = ({route, navigation}) => {
  const {allChallenges} = useSelector(store => store.challenge);
  const {showConfirmationModal, responseData} = useSelector(
    store => store.popup,
  );
  const [btnLoading, setBtnLoading] = useState(false);
  const [activeChallenge, setActiveChallenge] = useState(null);
  const [videos, setVideo] = useState([]);
  const [activePage, setActivePage] = useState(0);
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  useEffect(() => {
    let responseArray = route.params.challengeResponses.map(
      item => item.responseId,
    );
    dispatch(setAllChallenges(responseArray));
    setActiveChallenge(route.params);
    setVideo(responseArray);
  }, [route.params]);

  const onPageSelected = useCallback(e => {
    setActivePage(e.nativeEvent.position);
    // Test (default false)
  }, []);

  const handleAssignResponse = async () => {
    setBtnLoading(true);
    const {videoData, activeChallenge} = responseData;
    let data = {
      trophy: activeChallenge.trophyId,
      user: videoData.userId,
      challenge: activeChallenge._id,
      response: videoData._id,
    };
    try {
      const response = await HttpClient.post('trophy/assign', data);
      dispatch(setConfirmationModel(false));
      setBtnLoading(false);
    } catch (error) {
      setBtnLoading(false);
      console.log(response);
    }
  };
  return (
    <View style={{flex: 1}}>
      <View style={styles.response}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
          style={{
            paddingRight: 7,
            position: 'absolute',
            left: 0,
            paddingHorizontal: 10,
          }}>
          <ArrowLeft2 size="25" color="#ffffff" />
        </TouchableOpacity>
        <Text
          style={[
            styles.activityFilter,
            {
              backgroundColor: 'transparent',
              paddingTop: 0,
              paddingBottom: 0,
            },
          ]}>
          Responses
        </Text>
      </View>

      {isFocused && (
        <PagerView
          orientation="vertical"
          onPageSelected={onPageSelected}
          style={styles.pagerView}
          initialPage={0}>
          {videos.map((item, index) => {
            return (
              <View key={index + 1}>
                <VideoPlayer
                  data={item}
                  activeChallenge={activeChallenge}
                  isActive={activePage === index}
                  isResponse={true}
                />
              </View>
            );
          })}
        </PagerView>
      )}
      {showConfirmationModal && (
        <View style={StyleSheet.absoluteFill}>
          <ConfirmationModal
            loading={btnLoading}
            title="Assign Trophy?"
            subtitle="Are you sure you want to assign trophy to this response?"
            okButtonClick={() => handleAssignResponse()}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  pagerView: {
    flex: 1,
    backgroundColor: '#000',
  },
  response: {
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundVideo: 'transparent',
    position: 'absolute',
    zIndex: 2,
    left: 0,
    right: 0,
    top: Platform.OS == 'android' ? 20 : 50,
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
    borderRadius: Platform.OS == 'android' ? 8 : 14,
    fontSize: 16,
    fontFamily: theme.fonts.medium.fontFamily,
  },
});

export default Responses;
