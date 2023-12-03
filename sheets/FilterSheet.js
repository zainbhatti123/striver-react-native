import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import ActionSheet, {
  registerSheet,
  SheetManager,
} from 'react-native-actions-sheet';
import {TouchableRipple} from 'react-native-paper';
import SheetHeader from './SheetHeader';
import Button from '../StyledComponents/Button';
import {theme} from '../theme';
import TickBgSvg from '../components/svg/TickBgSvg';
import {HttpClient} from '../Api/config';
import {ALL_CHALLENGES} from '../Api/endPoints';
import {useDispatch, useSelector} from 'react-redux';
import {setFilters} from '../store/features/home/homeSlice';
import {setAllChallenges} from '../store/features/challenge/challengeSlice';

const FilterSheet = props => {
  const {activeFilters} = useSelector(store => store.home);
  const [active, setActive] = useState(activeFilters.filter);
  const [isLoading, setIsLoading] = useState(false);
  const [activeView, setActiveView] = useState(activeFilters.view);
  const dispatch = useDispatch();

  const filters = [
    {
      label: 'Trending',
      value: 'trending',
    },
    {
      label: 'Following',
      value: 'following',
    },
    {
      label: 'Inspire Me',
      value: 'inspireMe',
    },
  ];

  const radioButtons = [
    {
      id: 1,
      label: 'All Videos',
      value: 'allVideos',
      checked: false,
    },
    {
      id: 2,
      label: 'Most Viewed',
      value: 'mostViewed',
      checked: false,
    },
    {
      id: 3,
      label: 'Conversations',
      value: 'conversations',
      checked: false,
    },
    {
      id: 4,
      label: 'Challenge',
      value: 'challenge',
      checked: false,
    },
  ];

  const handleFilters = async () => {
    setIsLoading(true);
    try {
      const {data} = await HttpClient.get(
        `${ALL_CHALLENGES}?page=1&limit=10&filter=${activeFilters.filter.value}&view=${activeFilters.view}`,
      );
      SheetManager.hide(props.sheetId);
      dispatch(setAllChallenges(data.data.result));
    } catch (error) {
      console.log('err');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let data = {
      filter: active,
      view: activeView,
    };
    dispatch(setFilters(data));
  }, [active, activeView]);

  return (
    <ActionSheet
      id={props.sheetId}
      gestureEnabled={true}
      containerStyle={{backgroundColor: '1A222F'}}
      CustomHeaderComponent={<SheetHeader />}>
      <View style={styles.container}>
        <Text style={styles.title}>Set Filters</Text>
        <View style={styles.buttonParent}>
          {filters.map((item, i) => (
            <View key={i}>
              <Button
                mode="contained"
                primary
                style={[
                  styles.filterButton,
                  active.value != item.value && {backgroundColor: '#ffffff33'},
                ]}
                labelStyle={[
                  styles.labelStyle,
                  active.value != item.value && {opacity: 0.7},
                ]}
                onPress={() => setActive(item)}>
                {item.label}
              </Button>
            </View>
          ))}
        </View>
        <View style={{marginTop: 10}}>
          <Text style={styles.title}>View</Text>
          <View
            style={{
              height: 1,
              backgroundColor: '#ffffff22',
              marginVertical: 5,
            }}></View>
        </View>
        <View>
          {radioButtons.map(radio => (
            <TouchableRipple
              rippleColor="#ffffff22"
              onPress={() => setActiveView(radio.value)}
              key={radio.id}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  height: 40,
                  paddingHorizontal: 5,
                }}>
                <Text
                  style={{
                    color:
                      activeView === radio.value
                        ? theme.colors.primary
                        : '#fff',
                    opacity: 0.7,
                    fontSize: 16,
                  }}>
                  {radio.label}
                </Text>
                {activeView === radio.value && <TickBgSvg />}
              </View>
            </TouchableRipple>
          ))}
        </View>
        <Button
          mode="contained"
          primary
          style={{marginTop: 20}}
          labelStyle={{fontSize: 16}}
          loading={isLoading}
          disabled={isLoading}
          onPress={() => handleFilters()}>
          Apply
        </Button>
      </View>
    </ActionSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1A222F',
    padding: 17,
  },
  title: {
    color: '#fff',
    fontFamily: theme.fonts.medium.fontFamily,
    fontSize: 16,
  },
  buttonParent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  filterButton: {
    borderRadius: 4,
    paddingTop: 0,
  },
  labelStyle: {
    fontSize: 15,
    paddingTop: 4,
    lineHeight: 16,
    paddingBottom: 0,
  },
});

// Register your Sheet component.
registerSheet('filterSheet', FilterSheet);

export default FilterSheet;
