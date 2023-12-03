import React, {useEffect, useState} from 'react';
import {TabView, SceneMap} from 'react-native-tab-view';
import {
  View,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Text,
  Image,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import {theme} from '../theme';
import BigPlaySvg from './svg/BigPlaySvg';
import VideoSvg from './svg/VideoSvg';
import StarSvg from './svg/StarSvg';
import PlaySvg from './svg/PlaySvg';
import {Divider, Menu} from 'react-native-paper';
import {More, Trash} from 'iconsax-react-native';
import {useDispatch} from 'react-redux';
import {
  setConfirmationModel,
  setConfirmationDetail,
} from '../store/features/popup/popupSlice';

const VideosTabView = ({responseData, setVideos, ownProfile}) => {
  const {width, height} = useWindowDimensions();
  const [tab1Height, setTab1Height] = useState(null);
  const [tab2Height, setTab2Height] = useState(null);
  const [tab3Height, setTab3Height] = useState(null);
  const dispatch = useDispatch();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {key: 'content', title: 'Content', icon: 'play'},
    {key: 'responses', title: 'Responses', icon: 'video'},
    {key: 'featured', title: 'Featured', icon: 'star'},
  ]);

  const Loader = () => {
    return (
      <View>
        <Text style={{color: '#fff', fontSize: 30}}>Loader</Text>
      </View>
    );
  };

  const MoreOptions = ({videoID, type}) => {
    const [visible, setVisible] = useState(false);
    const setMutation = () => {
      dispatch(setConfirmationDetail({id: videoID, type}));
      dispatch(setConfirmationModel(true));
    };
    return (
      <View
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          flexDirection: 'row',
          justifyContent: 'center',
        }}>
        <Menu
          visible={visible}
          contentStyle={{
            paddingVertical: 0,
            paddingHorizontal: 0,
            margin: 0,
            minHeight: 0,
            minWidth: 0,
            // maxWidth: 90,
          }}
          anchor={
            <TouchableOpacity
              onPress={() => setVisible(true)}
              style={{padding: 5}}>
              <More size="18" color="#ffffff" style={styles.moreDots} />
            </TouchableOpacity>
          }
          onDismiss={() => setVisible(false)}>
          <Menu.Item
            onPress={() => setMutation()}
            style={{backgroundColor: theme.colors.primary, borderRadius: 4}}
            title={
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Trash size="20" color="#fff" variant="Outline" />
                <Text
                  style={{
                    height: 35,
                    marginLeft: 10,
                    marginTop: 14,
                    fontSize: 14,
                    color: '#fff',
                    fontFamily: theme.fonts.regular.fontFamily,
                  }}>
                  Delete
                </Text>
              </View>
            }
          />
        </Menu>
      </View>
    );
  };

  const ContentVideos = () => {
    const videos = responseData.challenges;

    return (
      <View
        style={styles.videosContainer}
        onLayout={event =>
          setTab1Height(event.nativeEvent.layout.height + 100)
        }>
        {!!videos.length ? (
          videos.map((video, index) => (
            <TouchableOpacity
              activeOpacity={0.7}
              key={index}
              style={{marginBottom: 6}}
              onPress={() => setVideos(videos, 'Content', index)}>
              <Image
                source={{uri: video.thumbNail}}
                style={{
                  height: 137,
                  width: (width - 50) / 3,
                  marginHorizontal: 3,
                  borderRadius: 8,
                }}></Image>
              <View style={styles.overlay}>
                <View style={{height: 24, width: 24}}>
                  <PlaySvg viewBox="0 0 24 24" />
                </View>
              </View>
              {ownProfile && <MoreOptions videoID={video._id} type="video" />}
            </TouchableOpacity>
          ))
        ) : (
          <View
            style={{
              flexDirection: 'row',
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                color: '#fff',
                paddingVertical: 30,
                fontFamily: theme.fonts.medium.fontFamily,
              }}>
              No Content Videos
            </Text>
          </View>
        )}
      </View>
    );
  };
  const ResponseVideos = () => {
    const videos = responseData.challengeResponse;
    return (
      <View
        style={styles.videosContainer}
        onLayout={event =>
          setTab2Height(event.nativeEvent.layout.height + 100)
        }>
        {!!videos.length ? (
          videos.map((video, index) => (
            <TouchableOpacity
              activeOpacity={0.7}
              key={index}
              style={{marginBottom: 6}}
              onPress={() => setVideos(videos, 'Responses', index)}>
              <Image
                source={{uri: video.thumbNail}}
                style={{
                  height: 137,
                  width: (width - 50) / 3,
                  marginHorizontal: 3,
                  borderRadius: 8,
                }}></Image>
              <View style={styles.overlay}>
                <View style={{height: 24, width: 24}}>
                  <PlaySvg viewBox="0 0 24 24" />
                </View>
              </View>
              {ownProfile && (
                <MoreOptions videoID={video._id} type="response" />
              )}
            </TouchableOpacity>
          ))
        ) : (
          <View
            style={{
              flexDirection: 'row',
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                color: '#fff',
                paddingVertical: 30,
                fontFamily: theme.fonts.medium.fontFamily,
              }}>
              No Response Videos
            </Text>
          </View>
        )}
      </View>
    );
  };
  const FeaturedVideos = () => {
    const videos = responseData.featuresChallenges;
    return (
      <View
        style={styles.videosContainer}
        onLayout={event =>
          setTab3Height(event.nativeEvent.layout.height + 100)
        }>
        {!!videos.length ? (
          videos.map((video, index) => (
            <TouchableOpacity
              activeOpacity={0.7}
              key={index}
              style={{marginBottom: 6}}
              onPress={() => setVideos(videos, 'Featured', index)}>
              <Image
                source={{uri: video.thumbNail}}
                style={{
                  height: 137,
                  width: (width - 50) / 3,
                  marginHorizontal: 3,
                  borderRadius: 8,
                }}></Image>
              <View style={styles.overlay}>
                <View style={{height: 24, width: 24}}>
                  <PlaySvg viewBox="0 0 24 24" />
                </View>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View
            style={{
              flexDirection: 'row',
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                color: '#fff',
                paddingVertical: 30,
                fontFamily: theme.fonts.medium.fontFamily,
              }}>
              No Feature Videos
            </Text>
          </View>
        )}
      </View>
    );
  };

  const renderScene = SceneMap({
    content: ContentVideos,
    responses: ResponseVideos,
    featured: FeaturedVideos,
  });

  const TabBar = props => {
    return (
      <View style={styles.widgets}>
        {props.navigationState.routes.map((route, i) => {
          return (
            <TouchableWithoutFeedback onPress={() => setIndex(i)} key={i}>
              <View
                style={[styles.childWidget, {opacity: i === index ? 1 : 0.5}]}>
                <Text
                  style={[styles.widgetTitle, {marginTop: 7, marginBottom: 7}]}>
                  {route.icon == 'play' && <BigPlaySvg />}
                  {route.icon == 'video' && <VideoSvg />}
                  {route.icon == 'star' && <StarSvg />}
                </Text>
                <Text style={styles.widgetDetail}>{route.title}</Text>
                <View style={styles.absoluteLine} />
              </View>
            </TouchableWithoutFeedback>
          );
        })}
      </View>
    );
  };

  return (
    <View
      style={{
        height:
          index === 0 ? tab1Height : index === 1 ? tab2Height : tab3Height,
        flex: 1,
      }}>
      <TabView
        navigationState={{index, routes}}
        renderScene={renderScene}
        renderLazyPlaceholder={() => <Loader />}
        lazy={true}
        renderTabBar={TabBar}
        onIndexChange={setIndex}
        initialLayout={{width}}
      />
    </View>
  );
};

const styles = StyleSheet.create({
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
  videosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 15,
  },
  moreDots: {
    transform: [{rotate: '90deg'}],
  },
});

export default VideosTabView;
