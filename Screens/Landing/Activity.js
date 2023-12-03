import {Like1, More, Star1} from 'iconsax-react-native';
import React, {useCallback, useState} from 'react';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import {theme} from '../../theme';
import LikeSvg from '../../components/svg/LikeSvg';
import CommentSvg from '../../components/svg/CommentSvg';
import StarSvg from '../../components/svg/StarSvg';
import MoreSvg from '../../components/svg/MoreSvg';
import VideoSvg from '../../components/svg/VideoSvg';
import {SheetManager} from 'react-native-actions-sheet';
import {useNavigation} from '@react-navigation/native';
import {HttpClient} from '../../Api/config';
import TrophySvg from '../../components/svg/Trophy';
import {useSelector, useDispatch} from 'react-redux';
import {
  setConfirmationModel,
  setResponseData,
} from '../../store/features/popup/popupSlice';
import ConfirmationModal from '../../components/ConfirmationModal';
import {useEffect} from 'react';

const Activities = ({videoData, isResponse, activeChallenge}) => {
  const [kudos, setKudos] = useState(videoData.isLiked);
  const [kudosForApi, setKudosForApi] = useState(videoData.isLiked);
  const [feature, setFeature] = useState(videoData.isFeatured);
  const [featureForApi, setFeatureForApi] = useState(videoData.isFeatured);
  const [isAssignedTrophy, setIsAssignedTrophy] = useState(false);
  const {userData} = useSelector(state => state.auth);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const handleLike = useCallback(async () => {
    setKudos(!kudos);
    try {
      let response;
      if (kudosForApi) {
        response = await HttpClient.put(`unLikeChallenge/${videoData._id}`);
      } else {
        response = await HttpClient.put(`likeChallenge/${videoData._id}`);
      }
      setKudosForApi(!kudosForApi);
      // console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  });

  useEffect(() => {
    if (isResponse && activeChallenge?.challengeResponses.length) {
      let getChallenge = activeChallenge?.challengeResponses.find(
        item => item.responseId._id === videoData._id,
      );
      setIsAssignedTrophy(getChallenge?.isAssignTrophy);
    }
  }, [videoData]);

  const handleFeature = useCallback(async () => {
    setFeature(!feature);
    try {
      let response;
      if (featureForApi) {
        response = await HttpClient.put(`unFeatureChallenge/${videoData._id}`);
      } else {
        response = await HttpClient.put(`featureChallenge/${videoData._id}`);
      }
      setFeatureForApi(!featureForApi);
      // console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  });

  return (
    <View style={[styles.container, isResponse && {paddingBottom: 60}]}>
      <View style={styles.list}>
        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.activity}
          onPress={() => handleLike()}>
          <View style={[styles.widget, kudos && {backgroundColor: '#80ED99'}]}>
            <LikeSvg isLike={kudos} />
          </View>
          <Text style={styles.label}>Kudos</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.activity}
          onPress={() => SheetManager.show('commentSheet', {data: videoData})}>
          <View style={styles.widget}>
            <CommentSvg />
          </View>
          <Text style={styles.label}>Comment</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.activity}
          onPress={() => handleFeature()}>
          <View
            style={[styles.widget, feature && {backgroundColor: '#FFE900'}]}>
            <StarSvg isFeatured={feature} />
          </View>
          <Text style={styles.label}>Feature</Text>
        </TouchableOpacity>
        {isResponse && activeChallenge?.userId._id === userData._id && (
          <TouchableOpacity
            activeOpacity={0.5}
            style={styles.activity}
            onPress={() => {
              setIsAssignedTrophy(true);
              dispatch(setConfirmationModel(true));
              dispatch(setResponseData({videoData, activeChallenge}));
            }}>
            <View
              style={[
                styles.widget,
                isAssignedTrophy && {backgroundColor: '#ffffff'},
              ]}>
              <TrophySvg />
            </View>
            <Text style={styles.label}>Assign</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.activity}
          onPress={() => SheetManager.show('MoreSheet', {data: videoData})}>
          <View style={styles.widget}>
            <MoreSvg />
          </View>
          <Text style={styles.label}>More</Text>
        </TouchableOpacity>
        {!isResponse && (
          <TouchableOpacity
            activeOpacity={0.5}
            style={styles.activity}
            onPress={() =>
              navigation.navigate('CreateChallenge', {challenge: videoData})
            }>
            <View
              style={[styles.widget, {backgroundColor: theme.colors.primary}]}>
              <VideoSvg />
            </View>
            <Text style={styles.label}>Respond</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    flexDirection: 'row',
    width: 80,
  },
  list: {
    flexDirection: 'column',
  },
  widget: {
    height: 36,
    width: 36,
    borderRadius: 10,
    backgroundColor: '#ffffff44',
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 10,
    marginTop: 3,
    color: '#fff',
    textShadowColor: '#00000066',
    textShadowOffset: {width: 0, height: 3},
    textShadowRadius: 4,
    fontFamily: theme.fonts.regular.fontFamily,
  },
  activity: {
    alignItems: 'center',
    flexDirection: 'column',
    marginVertical: 7.5,
  },
});

export default Activities;
