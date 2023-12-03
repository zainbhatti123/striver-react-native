import React, {useState, useLayoutEffect, useCallback} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {theme} from '../../theme';
import PagerView from 'react-native-pager-view';
import VideoPlayer from './videoPlayer';
import {ALL_CHALLENGES} from '../../Api/endPoints';
import {useIsFocused} from '@react-navigation/native';
import FilterSvg from '../../components/svg/Filter';
import {HttpClient} from '../../Api/config';
import Loader from '../../components/Loader';
import {SheetManager} from 'react-native-actions-sheet';
import {setAllChallenges} from '../../store/features/challenge/challengeSlice';
import {useDispatch, useSelector} from 'react-redux';
import {ArrowLeft2} from 'iconsax-react-native';
import ConfirmationModal from '../../components/ConfirmationModal';
import {setConfirmationModel} from '../../store/features/popup/popupSlice';

const MyPager = ({navigation}) => {
  const isFocused = useIsFocused();
  const {allChallenges} = useSelector(store => store.challenge);
  const {activeFilters} = useSelector(store => store.home);
  const [activeChallenge, setActiveChallenge] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activePage, setActivePage] = useState(0);
  const dispatch = useDispatch();

  const getAllVideos = async () => {
    setLoading(true);
    try {
      const {data} = await HttpClient.get(
        `${ALL_CHALLENGES}?page=1&limit=30&filter=${activeFilters.filter.value}&view=${activeFilters.view}`,
      );
      dispatch(setAllChallenges(data.data.result));
      setLoading(false);
    } catch (error) {
      console.log('err');
    }
  };

  const onPageSelected = useCallback(e => {
    setActivePage(e.nativeEvent.position);
    // Test (default false)
  }, []);
  useLayoutEffect(() => {
    if (isFocused) {
      getAllVideos();
    } else {
      dispatch(setAllChallenges([]));
    }
  }, [isFocused]);

  return (
    <>
      <View style={styles.filters}>
        <Text style={styles.activityFilter}>{activeFilters.filter.label}</Text>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => {
            SheetManager.show('filterSheet');
          }}
          style={[
            styles.activityFilter,
            {
              marginLeft: 8,
              paddingHorizontal: 10,
              borderRadius: 10,
              paddingTop: 8,
              backgroundColor: theme.colors.primary,
            },
          ]}>
          <FilterSvg />
        </TouchableOpacity>
      </View>
      <PagerView
        orientation="vertical"
        onPageSelected={onPageSelected}
        style={styles.pagerView}
        initialPage={0}>
        {loading ? (
          <Loader hideLogo />
        ) : !!allChallenges?.length ? (
          allChallenges.map((item, index) => {
            return (
              <View key={index + 1}>
                {isFocused && (
                  <VideoPlayer
                    data={item}
                    activeChallenge={activeChallenge}
                    isActive={activePage === index}
                    isResponse={false}
                  />
                )}
              </View>
            );
          })
        ) : (
          <View
            style={[
              StyleSheet.absoluteFill,
              {
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
              },
            ]}>
            <Text style={{color: '#fff', fontSize: 20}}>No Videos Found</Text>
          </View>
        )}
      </PagerView>
    </>
  );
};

const styles = StyleSheet.create({
  pagerView: {
    flex: 1,
    backgroundColor: '#000',
  },
  filters: {
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundVideo: 'transparent',
    position: 'absolute',
    zIndex: 2,
    left: 0,
    right: 0,
    top: Platform.OS == 'android' ? 25 : 50,
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
export default MyPager;
