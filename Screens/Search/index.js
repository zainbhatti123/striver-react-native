import React, {useEffect, useState, memo, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
  Image,
  Platform,
} from 'react-native';
import TextInput from '../../StyledComponents/TextInput';
import {ArrowLeft2, BackSquare, SearchNormal1} from 'iconsax-react-native';
import {theme} from '../../theme';
import CrossSvg from '../../components/svg/CrossSvg';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import PlaySvg from '../../components/svg/PlaySvg';
import Button from '../../StyledComponents/Button';
import {HttpClient} from '../../Api/config';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {useAsyncStorage} from '../../hooks/UseAsyncStorage';
import Loader from '../../components/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch, useSelector} from 'react-redux';
import {setActiveProfileId} from '../../store/features/home/homeSlice';
import PagerView from 'react-native-pager-view';
import VideoPlayer from '../../Screens/Landing/videoPlayer';

const Search = () => {
  const focus = useIsFocused();
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearch, setRecentSearch] = useState([]);
  const [activeVideos, setActiveVideos] = useState([]);
  const [activeTabTitle, setActiveTabTitle] = useState('');
  const [activePage, setActivePage] = useState(0);
  const [, setRecentAsyncSearch] = useAsyncStorage('recentAsyncSearch');
  const [isSearch, setIsSearch] = useState(false);
  const [routes] = useState([
    {key: 'first', title: 'Challenges'},
    {key: 'second', title: 'Accounts'},
  ]);
  const {width, height} = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [challenges, setChallenges] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [challengeHeight, setChallengeHeight] = useState(0);
  const [accountHeight, setAccountHeight] = useState(0);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const {userData: ownData} = useSelector(store => store.auth);

  const setVideos = () => {
    setActiveVideos(challenges);
    setActiveTabTitle('Search');
  };
  const onPageSelected = useCallback(e => {
    setActivePage(e.nativeEvent.position);
  }, []);

  const handleSearchApi = useCallback(async searchText => {
    try {
      setIsLoading(true);
      const response = await HttpClient.get(
        `searchChallenge/${searchText ? searchText : search}`,
      );
      setChallenges(response.data.data.challenge);
      setAccounts(response.data.data.account);
      setIsSearch(true);
      if (!searchText) {
        setRecentAsyncSearch([...recentSearch, search]);
        setRecentSearch([...recentSearch, search]);
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  });

  const handleFollowing = async item => {
    let route = item.isFollowing ? 'unfollow' : 'follow';
    const response = await HttpClient.post(`profile/${route}`, {
      follow: item._id,
    });
    let updatedAcoount = accounts.map(user => {
      if (user._id === item._id) {
        let newAccount;
        if (route == 'follow') {
          newAccount = {...user, isFollowing: true};
        } else {
          newAccount = {...user, isFollowing: false};
        }
        return newAccount;
      } else {
        return user;
      }
    });
    setAccounts(updatedAcoount);
  };
  const handleUserProfile = id => {
    dispatch(setActiveProfileId(id));
    navigation.navigate('Profile');
  };
  const checkSearch = useCallback(async () => {
    let searchArr = await AsyncStorage.getItem('recentAsyncSearch');
    if (searchArr !== null) {
      let newArray = JSON.parse(searchArr);
      setRecentSearch(newArray);
    }
  });

  const clearRecentSearches = () => {
    setRecentAsyncSearch([]);
    setRecentSearch([]);
  };

  const recentSearchApiHandle = async item => {
    handleSearchApi(item);
    setSearch(item);
  };

  const backToSearch = () => {
    setIsSearch(false);
    setSearch('');
  };

  useEffect(() => {
    if (!focus) {
      setIsSearch(false);
    } else {
      checkSearch();
    }
  }, [focus]);

  const Accounts = () => (
    <View
      onLayout={event =>
        setAccountHeight(event.nativeEvent.layout.height + 80)
      }>
      {!accounts.length ? (
        <Text style={styles.noData}>No Users Found</Text>
      ) : (
        accounts.map((item, index) => (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: 16,
              borderBottomColor: '#ffffff22',
              borderBottomWidth: 1,
            }}
            key={index}>
            <TouchableOpacity
              onPress={() => handleUserProfile(item._id)}
              style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image
                source={{
                  uri: item.profileImage
                    ? item.profileImage
                    : 'https://www.kindpng.com/picc/m/252-2524695_dummy-profile-image-jpg-hd-png-download.png',
                }}
                style={{height: 70, width: 70, borderRadius: 70}}
              />
              <View style={{marginLeft: 13}}>
                <Text style={styles.accountName}>
                  {item.firstName + ' ' + item.lastName}
                </Text>
                <Text
                  style={[
                    styles.accountName,
                    {fontSize: 12, fontFamily: theme.fonts.regular.fontFamily},
                  ]}>
                  ({item.userName})
                </Text>
              </View>
            </TouchableOpacity>
            {item._id !== ownData?._id && (
              <View style={{marginLeft: 'auto'}}>
                <Button
                  mode="contained"
                  style={styles.followBtn}
                  labelStyle={styles.followBtnText}
                  onPress={() => handleFollowing(item)}>
                  {item.isFollowing ? 'unfollow' : 'Follow'}
                </Button>
              </View>
            )}
          </View>
        ))
      )}
    </View>
  );

  const Challenges = ({setVideos}) => {
    return (
      <View
        onLayout={event =>
          setChallengeHeight(event.nativeEvent.layout.height + 80)
        }>
        {!challenges.length ? (
          <Text style={styles.noData}>No Challenges Found</Text>
        ) : (
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              marginTop: 20,
              justifyContent: 'space-between',
            }}>
            {challenges.map((item, index) => (
              <TouchableOpacity
                activeOpacity={0.5}
                key={index}
                onPress={() => setVideos()}>
                <View
                  style={{
                    width: width / 2 - 23,
                    height: 200,
                    marginBottom: 15,
                  }}>
                  <View>
                    <Image
                      source={{uri: item.thumbNail}}
                      style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: 8,
                        borderColor: 'green',
                        borderWidth: 1,
                      }}
                    />
                    <View style={styles.overlay}>
                      <View style={{height: 35, width: 35}}>
                        <PlaySvg viewBox="0 0 24 24" />
                      </View>
                    </View>
                    <View
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        padding: 8,
                      }}>
                      <Text
                        style={{
                          color: '#fff',
                          fontSize: 12,
                          fontFamily: theme.fonts.regular.fontFamily,
                        }}>
                        {item.title}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    );
  };

  const renderTabBar = props => (
    <TabBar
      {...props}
      indicatorStyle={{backgroundColor: '#fff'}}
      style={{backgroundColor: 'transparent'}}
      pressColor="transparent"
    />
  );

  const renderScene = SceneMap({
    first: () => <Challenges setVideos={setVideos} />,
    second: Accounts,
  });

  return (
    <>
      <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
        <View style={isSearch && {flexDirection: 'row', alignItems: 'center'}}>
          {isSearch && (
            <TouchableOpacity
              activeOpacity={0.7}
              style={{paddingRight: 7}}
              onPress={() => backToSearch()}>
              <ArrowLeft2 size="25" color="#ffffff" />
            </TouchableOpacity>
          )}

          <TextInput
            style={[styles.input, isSearch && {width: width - 62}]}
            outlineColor="#6A6A6A22"
            onChangeText={val => setSearch(val)}
            value={search}
            placeholder="Search"
            onSubmitEditing={() => handleSearchApi()}
            returnKeyType="search"
            clearButtonMode="while-editing"
            LeftIcon={<SearchNormal1 size="20" color="#ffffff" />}
            RightIcon={
              search && (
                <TouchableOpacity
                  onPress={() => setSearch('')}
                  style={{padding: 9}}>
                  <View style={{height: 17, width: 17}}>
                    <CrossSvg viewBox="0 0 12 12" />
                  </View>
                </TouchableOpacity>
              )
            }
          />
        </View>
        {isLoading ? (
          <View style={{height: height - 200}}>
            <Loader hideLogo bgColor="#202020" />
          </View>
        ) : (
          <>
            {!isSearch ? (
              <>
                {recentSearch.length ? (
                  <>
                    <View style={styles.row}>
                      <Text style={styles.recent}>Recent</Text>
                      <TouchableOpacity onPress={() => clearRecentSearches()}>
                        <Text style={styles.clearAll}>Clear all</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={{marginTop: 15}}>
                      {recentSearch?.map((item, index) => (
                        <View key={index}>
                          <TouchableOpacity
                            style={styles.recentSearchTab}
                            onPress={() => recentSearchApiHandle(item)}>
                            <Text
                              style={{
                                color: '#fff',
                                fontFamily: theme.fonts.regular.fontFamily,
                                fontSize: 14,
                              }}>
                              {item}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      ))}
                    </View>
                  </>
                ) : (
                  <>
                    <Text
                      style={{
                        color: '#fff',
                        fontSize: 15,
                        fontFamily: theme.fonts.medium.fontFamily,
                        textAlign: 'center',
                        marginTop: 20,
                      }}>
                      No Recent Searches Found
                    </Text>
                  </>
                )}
              </>
            ) : (
              <View style={{marginTop: 20}}>
                <TabView
                  navigationState={{index, routes}}
                  renderTabBar={renderTabBar}
                  renderScene={renderScene}
                  onIndexChange={setIndex}
                  initialLayout={{width}}
                  keyboardDismissMode="on-drag"
                  lazy={true}
                  renderLazyPlaceholder={() => (
                    <Text style={{color: '#fff'}}>Loader</Text>
                  )}
                  lazyPreloadDistance={100}
                  style={{
                    height:
                      index == 0
                        ? challengeHeight
                        : index == 1
                        ? accountHeight
                        : height - 150,
                  }}
                />
              </View>
            )}
          </>
        )}
      </ScrollView>
      {activeVideos.length > 0 && (
        <View style={StyleSheet.absoluteFill}>
          <View
            style={{
              justifyContent: 'center',
              flexDirection: 'row',
              backgroundVideo: 'transparent',
              position: 'absolute',
              zIndex: 10,
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

          <PagerView
            orientation="vertical"
            onPageSelected={onPageSelected}
            style={[styles.pagerView]}
            initialPage={0}>
            {activeVideos.map((item, index) => {
              return (
                <View key={index + 1}>
                  <VideoPlayer
                    data={item}
                    isActive={activePage === index}
                    isResponse={false}
                  />
                </View>
              );
            })}
          </PagerView>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#202020',
    padding: 15,
    paddingTop: Platform.OS == 'android' ? 15 : 40,
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
  pagerView: {
    flex: 1,
    backgroundColor: '#000',
  },
  input: {
    backgroundColor: '#6A6A6A22',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginTop: 20,
  },
  recent: {
    color: '#fff',
    fontFamily: theme.fonts.medium.fontFamily,
    fontSize: 16,
  },
  clearAll: {
    color: theme.colors.primary,
    fontFamily: theme.fonts.regular.fontFamily,
  },
  recentSearchTab: {
    backgroundColor: '#6A6A6A22',
    paddingVertical: 8,
    paddingHorizontal: 10,
    paddingTop: 10,
    marginBottom: 14,
    borderRadius: 4,
  },
  overlay: {
    position: 'absolute',
    right: 0,
    left: 0,
    bottom: 0,
    top: 0,
    backgroundColor: '#00000055',
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  accountName: {
    color: '#ffffff',
    fontFamily: theme.fonts.medium.fontFamily,
    fontSize: 15,
  },
  followBtn: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 5,
    paddingTop: 0,
    borderRadius: 4,
    height: 33,
  },
  followBtnText: {
    color: '#202020',
    fontFamily: theme.fonts.medium.fontFamily,
    lineHeight: 12.5,
  },
  noData: {
    color: '#fff',
    fontFamily: theme.fonts.medium.fontFamily,
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default memo(Search);
