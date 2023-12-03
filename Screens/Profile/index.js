import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import React, {useState, useCallback, useEffect} from 'react';
import SettingSvg from '../../components/svg/SettingSvg';
import TrophySvg from '../../components/svg/Trophy';
import UserAddSvg from '../../components/svg/UseraddSvg';
import Button from '../../StyledComponents/Button';
import {theme} from '../../theme';
import StarSvg from '../../components/svg/StarSvg';
import LikeSvg from '../../components/svg/LikeSvg';
import VideoSvg from '../../components/svg/VideoSvg';
import CrossSvg from '../../components/svg/CrossSvg';
import VideosTabView from '../../components/TabView';
import {ScrollView} from 'react-native-gesture-handler';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {HttpClient} from '../../Api/config';
import Loader from '../../components/Loader';
import {setActiveProfileId} from '../../store/features/home/homeSlice';
import VideoPlayer from '../../Screens/Landing/videoPlayer';
import PagerView from 'react-native-pager-view';
import dummyImage from '../../assets/dummy-user-image.png';
import {ArrowLeft2} from 'iconsax-react-native';
import ConfirmationModal from '../../components/ConfirmationModal';
import {setConfirmationModel} from '../../store/features/popup/popupSlice';

const SuggestionItems = ({item, index, removeItem}) => {
  const handleFllow = async id => {
    try {
      const response = await HttpClient.post('profile/follow', {
        follow: id,
      });
      if (response) {
        removeItem(item);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.suggestionItem} key={index}>
      <Image
        source={
          item.item.profileImage
            ? {
                uri: item.item.profileImage,
              }
            : dummyImage
        }
        style={{height: 60, width: 60, borderRadius: 60}}
      />
      <Text
        style={{
          color: '#fff',
          fontFamily: theme.fonts.medium.fontFamily,
          fontSize: 14,
          marginTop: 4,
        }}>
        {item.item.firstName} {item.item.lastName}
      </Text>
      <Button
        mode="contained"
        style={{
          backgroundColor: '#fff',
          paddingHorizontal: 20,
          marginTop: 16,
          marginBottom: 0,
          borderRadius: 4,
        }}
        labelStyle={{
          color: '#202020',
          paddingBottom: 0,
          fontSize: 13,
          paddingTop: 0,
          lineHeight: 18,
          marginVertical: 5,
        }}
        onPress={() => handleFllow(item._id)}>
        Follow
      </Button>
      <View
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          opacity: 0.5,
        }}>
        <TouchableOpacity
          style={{padding: 10}}
          onPress={() => removeItem(item)}>
          <View style={{height: 12, width: 12}}>
            <CrossSvg viewBox="0 0 12 12" />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const ProfileScreen = () => {
  const [suggestionAccount, setSuggestionAccout] = useState(false);
  const [suggestions, setSuggestion] = useState([]);
  const [moments, setMoments] = useState([]);
  const navigation = useNavigation();
  const {activeProfileId} = useSelector(store => store.home);
  const {userData} = useSelector(store => store.auth);
  const [profileData, setProfileData] = useState(userData);
  const [ownProfile, setOwnProfile] = useState(true);
  const [profileLoading, setProfileLoading] = useState(true);
  const [activeTabTitle, setActiveTabTitle] = useState('');
  const [activeVideos, setActiveVideos] = useState([]);
  const [activePage, setActivePage] = useState(0);
  const [btnLoading, setBtnLoading] = useState(false);
  const [profileCompleted, setProfileCompleted] = useState(false);
  const focus = useIsFocused();
  const dispatch = useDispatch();
  const {showConfirmationModal, confirmationDetail} = useSelector(
    store => store.popup,
  );
  const getprofileByProfileId = useCallback(async () => {
    try {
      setProfileLoading(true);
      const response = await HttpClient.get(
        `profile/${activeProfileId ? activeProfileId : userData._id}`,
      );
      // console.log(response);
      setProfileData(response.data.data);
      setSuggestion(response.data.data.suggestedUsers);
      setMoments(response.data.data.moments);
      // console.log(response.data.data.moments);
      setProfileLoading(false);
    } catch (error) {
      console.log(error);
    }
  });
  const handleokButtonClick = useCallback(async () => {
    try {
      setBtnLoading(true);
      let response;
      if (confirmationDetail.type == 'video') {
        response = await HttpClient.delete(
          `challenge/${confirmationDetail.id}`,
        );
        setProfileData({
          ...profileData,
          challenges: profileData.challenges.filter(
            item => item._id != confirmationDetail.id,
          ),
          moments: profileData.challenges.filter(
            item => item._id != confirmationDetail.id,
          ),
        });
        dispatch(setConfirmationModel(false));
      } else {
        response = await HttpClient.delete(
          `deleteChallengeResponseById/${confirmationDetail.id}`,
        );
        setProfileData({
          ...profileData,
          challengeResponse: profileData.challengeResponse.filter(
            item => item._id != confirmationDetail.id,
          ),
          moments: profileData.challenges.filter(
            item => item._id != confirmationDetail.id,
          ),
        });
        dispatch(setConfirmationModel(false));
      }
    } catch (error) {
      console.log(error);
    } finally {
      setBtnLoading(false);
    }
  });
  const handleRemove = item => {
    setSuggestion(suggestions.filter(suggest => suggest._id !== item.item._id));
  };
  const onPageSelected = useCallback(e => {
    setActivePage(e.nativeEvent.position);
  }, []);

  const handleFollowing = async () => {
    let route = profileData.isFollowing ? 'unfollow' : 'follow';
    const response = await HttpClient.post(`profile/${route}`, {
      follow: profileData.user._id,
    });
    if (route == 'follow') {
      setProfileData({...profileData, isFollowing: true});
    } else {
      setProfileData({...profileData, isFollowing: false});
    }
  };

  const setVideos = (videos, type, index) => {
    setActiveVideos(videos);
    setActiveTabTitle(type);
    setActivePage(index);
  };

  // Story Videos
  useEffect(() => {
    if (activeProfileId && activeProfileId !== userData._id) {
      setOwnProfile(false);
    } else {
      setOwnProfile(true);
    }
    if (focus) {
      getprofileByProfileId();
    }
  }, [focus, activeProfileId]);

  // useEffect(() => {
  //   console.log(activeTabTitle);
  // }, [activeTabTitle])
  if (profileLoading) {
    return (
      <View style={StyleSheet.absoluteFill}>
        <Loader bgColor="#202020" hideLogo />
      </View>
    );
  }
  const RenderItem = ({item, moments, setVideos}) => {
    return (
      <View style={[styles.storyVideoStyle, {borderColor: item.item.color}]}>
        <View>
          <Image
            source={{uri: item.item.thumbNail}}
            style={{width: '100%', height: '100%', borderRadius: 50}}
          />
          <TouchableOpacity
            activeOpacity={0.6}
            style={styles.storyOverlay}
            onPress={() => setVideos(moments, 'Moments', item.index)}>
            {item.item.type == 'feature' && <StarSvg />}
            {item.item.type == 'like' && <LikeSvg />}
            {item.item.type == 'response' && <VideoSvg />}
          </TouchableOpacity>
        </View>
        <View style={[styles.storyPoints, {backgroundColor: item.item.color}]}>
          <Text
            style={{
              fontFamily: theme.fonts.bold.fontFamily,
              fontSize: 10,
              color: '#000',
              lineHeight: 13,
            }}>
            {item.item.count}
          </Text>
        </View>
      </View>
    );
  };
  return (
    <>
      <ScrollView style={{backgroundColor: '#202020'}}>
        <View style={styles.container}>
          {ownProfile && (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                paddingBottom: 20,
              }}></View>
          )}
          <View style={[styles.userDetail, !ownProfile && {marginTop: 20}]}>
            <View style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
              <Image
                style={styles.profileImage}
                source={{uri: profileData.user.profileImage}}
              />
              <View style={{marginLeft: 9}}>
                <View>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={[styles.name, {flexShrink: 1, width: 120}]}>
                    {profileData.user.firstName && profileData.user.lastName ? (
                      <Text>{`${profileData.user.firstName} ${profileData.user.lastName}`}</Text>
                    ) : (
                      <Text style={{color: '#ffffff66'}}>Jhon Doe</Text>
                    )}
                  </Text>
                </View>
                <Text style={styles.userName}>
                  (@{profileData.user.userName})
                </Text>
              </View>
            </View>
            <View style={{flex: 0}}>
              {ownProfile ? (
                <Button
                  primary
                  mode="contained"
                  style={styles.button}
                  labelStyle={styles.buttonLabel}
                  onPress={() => navigation.navigate('EditProfile')}>
                  {profileData.user.isProfileComplete ? 'Edit' : 'Complete'}{' '}
                  Profile
                </Button>
              ) : (
                <Button
                  mode="contained"
                  style={[
                    styles.followBtn,
                    profileData.isFollowing && {
                      backgroundColor: 'transparent',
                      borderColor: theme.colors.primary,
                      borderWidth: 1,
                      shadowColor: 'transparent',
                    },
                  ]}
                  labelStyle={[
                    styles.followButtonLabel,
                    profileData.isFollowing && {
                      color: theme.colors.primary,
                      lineHeight: 13,
                    },
                  ]}
                  onPress={() => handleFollowing()}>
                  {profileData.isFollowing ? 'Following' : 'Follow'}
                </Button>
              )}
            </View>
          </View>
          <View>
            <Text style={styles.description}>{profileData.userBio}</Text>
          </View>
          <View style={styles.about}>
            <TouchableOpacity
              onPress={() =>
                !!profileData.trophiesCount &&
                navigation.navigate('Trophies', profileData)
              }
              activeOpacity={0.7}
              style={[styles.aboutChild, {marginRight: 8}]}>
              <TrophySvg />
              <Text style={[styles.aboutText, {marginLeft: 6}]}>
                {profileData.trophiesCount}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('Level', profileData)}
              activeOpacity={0.7}
              style={[styles.aboutChild, {marginRight: 8}]}>
              <Text style={styles.aboutText}>
                Level {profileData.user.level}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setSuggestionAccout(!suggestionAccount)}
              activeOpacity={0.6}>
              <View
                style={[
                  styles.aboutChild,
                  {
                    paddingHorizontal: 10,
                    backgroundColor: suggestionAccount
                      ? theme.colors.primary
                      : '#6BB8FF11',
                  },
                ]}>
                <UserAddSvg
                  fill={suggestionAccount ? '#ffffff' : theme.colors.primary}
                />
              </View>
            </TouchableOpacity>
          </View>
          {suggestionAccount && (
            <View style={styles.suggestions}>
              <Text
                style={{
                  color: '#fff',
                  fontFamily: theme.fonts.medium.fontFamily,
                }}>
                Suggested Accounts
              </Text>
              {suggestions.length ? (
                <FlatList
                  data={suggestions}
                  renderItem={(item, index) => (
                    <SuggestionItems
                      item={item}
                      index={index}
                      removeItem={handleRemove}
                    />
                  )}
                  keyExtractor={item => item.id}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                />
              ) : (
                <Text
                  style={{
                    color: theme.colors.primary,
                    paddingVertical: 30,
                    fontFamily: theme.fonts.medium.fontFamily,
                    textAlign: 'center',
                  }}>
                  No Suggestions
                </Text>
              )}
            </View>
          )}
          <View style={styles.widgets}>
            <View style={styles.childWidget}>
              <Text style={styles.widgetTitle}>Followers</Text>
              <Text style={styles.widgetDetail}>
                {profileData.followersCount}
              </Text>
              <View style={styles.absoluteLine} />
            </View>
            <View style={styles.childWidget}>
              <Text style={styles.widgetTitle}>Responses</Text>
              <Text style={styles.widgetDetail}>
                {profileData.challengeResponseCount}
              </Text>
              <View style={styles.absoluteLine} />
            </View>
            <View style={styles.childWidget}>
              <Text style={styles.widgetTitle}>Sentiment</Text>
              <Text style={styles.widgetDetail}>99%</Text>
            </View>
          </View>
          <View style={styles.storyVideos}>
            {moments.length > 0 && (
              <FlatList
                data={moments}
                renderItem={(item, index) => (
                  <RenderItem
                    item={item}
                    moments={moments}
                    setVideos={setVideos}
                  />
                )}
                showsHorizontalScrollIndicator={false}
                horizontal
                keyExtractor={item => item.id}
                contentContainerStyle={{paddingBottom: 10}}
              />
            )}
          </View>
          <View>
            <VideosTabView
              responseData={profileData}
              ownProfile={ownProfile}
              setVideos={setVideos}
            />
          </View>
          <ConfirmationModal
            title="Delete Video?"
            loading={btnLoading}
            subtitle="Are you sure you want to delete this video?"
            okButtonClick={() => handleokButtonClick()}
          />
        </View>
      </ScrollView>
      {activeVideos.length > 0 && (
        <View style={StyleSheet.absoluteFill}>
          <View
            style={{
              justifyContent: 'center',
              flexDirection: 'row',
              backgroundVideo: 'transparent',
              position: 'absolute',
              zIndex: 2,
              left: 0,
              right: 0,
              top: Platform.OS == 'android' ? 25 : 50,
            }}>
            <TouchableOpacity
              activeOpacity={0.7}
              style={{
                paddingRight: 7,
                position: 'absolute',
                left: 0,
                paddingHorizontal: 10,
              }}
              onPress={() => {
                setActiveVideos([]);
                setActiveTabTitle('');
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
              {activeTabTitle}
            </Text>
          </View>

          {activeVideos.length > 0 && (
            <PagerView
              orientation="vertical"
              onPageSelected={onPageSelected}
              style={[styles.pagerView]}
              initialPage={activePage}>
              {activeVideos.map((item, index) => {
                return (
                  <View key={index}>
                    <VideoPlayer
                      data={item}
                      isActive={activePage === index}
                      isResponse={activeTabTitle == 'Responses' ? true : false}
                    />
                  </View>
                );
              })}
            </PagerView>
          )}
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    paddingTop: Platform.OS == 'android' ? 15 : 40,
    paddingBottom: 0,
    flex: 1,
  },
  pagerView: {
    flex: 1,
    backgroundColor: '#000',
  },
  profileImage: {
    height: 50,
    width: 50,
    borderRadius: 50,
  },
  setting: {
    backgroundColor: '#ffffff11',
    padding: 9,
    borderRadius: 50,
  },
  userDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 15,
  },
  name: {
    fontFamily: theme.fonts.medium.fontFamily,
    color: '#fff',
    fontSize: 15,
    textTransform: 'capitalize',
  },
  userName: {
    fontFamily: theme.fonts.light.fontFamily,
    color: '#fff',
    fontSize: 11,
  },
  button: {
    backgroundColor: '#ffffff11',
    borderRadius: 4,
    color: '#fff',
    height: 36,
  },
  buttonLabel: {
    fontFamily: theme.fonts.regular.fontFamily,
    paddingTop: 0,
    lineHeight: 22,
    fontSize: 12,
  },
  description: {
    color: '#ffffff',
    fontSize: 12,
    fontFamily: theme.fonts.regular.fontFamily,
    lineHeight: 20,
  },
  about: {
    flexDirection: 'row',
    marginVertical: 15,
  },
  aboutChild: {
    backgroundColor: '#6BB8FF11',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    paddingVertical: 8,
    flexDirection: 'row',
    borderRadius: 4,
  },
  aboutText: {
    color: theme.colors.primary,
    fontSize: 16,
    fontFamily: theme.fonts.medium.fontFamily,
    lineHeight: 20,
    paddingTop: 4,
  },
  widgets: {
    flexDirection: 'row',
    borderRadius: 8,
    backgroundColor: '#6A6A6A22',
  },
  childWidget: {
    flex: 1,
    alignItems: 'center',
    marginVertical: 8,
  },
  widgetTitle: {
    fontFamily: theme.fonts.regular.fontFamily,
    color: '#ffffff88',
    marginTop: 4,
    marginBottom: 2,
    fontSize: 12,
  },
  widgetDetail: {
    color: '#ffffff',
    fontFamily: theme.fonts.medium.fontFamily,
    fontSize: 12,
  },
  absoluteLine: {
    position: 'absolute',
    right: 0,
    height: 24,
    width: 1,
    backgroundColor: '#ffffff11',
    top: 12,
  },
  storyVideos: {
    paddingVertical: 15,
  },
  storyVideoStyle: {
    height: 80,
    width: 80,
    borderRadius: 80,
    borderWidth: 2,
    marginHorizontal: 6,
    padding: 6,
  },
  storyOverlay: {
    backgroundColor: '#00000055',
    position: 'absolute',
    borderRadius: 80,
    top: 0,
    height: 63.5,
    right: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  storyPoints: {
    position: 'absolute',
    bottom: -10,
    left: 27,
    borderRadius: 40,
    height: 20,
    width: 21,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
    zIndex: 2,
  },
  suggestions: {
    marginVertical: 10,
  },
  suggestionItem: {
    backgroundColor: '#6A6A6A22',
    paddingHorizontal: 10,
    paddingVertical: 13,
    marginHorizontal: 3.5,
    alignItems: 'center',
    borderRadius: 4,
    marginTop: 10,
  },
  followBtn: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 10,
    borderRadius: 4,
    height: 36,
  },
  followButtonLabel: {
    color: '#202020',
    paddingVertical: 0,
    lineHeight: 14.5,
    fontSize: 16,
  },
  activityFilter: {
    textShadowColor: '#00000066',
    textShadowOffset: {width: 0, height: 2},
    textShadowRadius: 4,
    color: '#fff',
    borderRadius: Platform.OS == 'android' ? 8 : 14,
    fontSize: 16,
    fontFamily: theme.fonts.medium.fontFamily,
  },
});

export default ProfileScreen;
