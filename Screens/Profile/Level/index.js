import React, {useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {ArrowLeft2} from 'iconsax-react-native';
import {theme} from '../../../theme';
import {ProgressBar, Divider} from 'react-native-paper';
import { useSelector } from 'react-redux';

const LevelScreen = ({route, navigation}) => {
  const {user} = route.params;
  const {userData: ownData} = useSelector(store => store.auth);
  return (
    <ScrollView style={styles.container}>
      <View
        style={{
          alignItems: 'center',
          paddingTop: Platform.OS === 'ios' ? 50 : 20,
        }}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() =>
            navigation.navigate(
              'Profile',
              user._id !== ownData?._id && 'userProfile',
            )
          }
          style={{
            paddingRight: 7,
            position: 'absolute',
            left: 0,
            paddingTop: Platform.OS === 'ios' ? 50 : 25,
            paddingHorizontal: 10,
          }}>
          <ArrowLeft2 size="25" color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.heading}>Level</Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          padding: 20,
          marginTop: 10,
        }}>
        <View style={styles.trophy}>
          <View
            style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
            <Image
              style={{width: 100, height: 80}}
              source={require('../../../assets/level-img.png')}
            />
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text style={styles.level}> Level {user.level}</Text>
            <Text style={styles.points}> {user.points} points</Text>
          </View>
          <View>
            <ProgressBar
              progress={0.7}
              color={theme.colors.primary}
              style={{
                height: 15,
                borderRadius: 50,
                backgroundColor: 'white',
              }}
            />
            {!!user.pointsRange && (
              <>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={styles.totalPoints}>
                    {' '}
                    {user.pointsRange.min} points
                  </Text>
                  <Text style={styles.totalPoints}>
                    {' '}
                    {user.pointsRange.max} points
                  </Text>
                </View>
                <Text style={styles.earnUpTo}>{user.pointsRange.message}</Text>
              </>
            )}
          </View>
        </View>
      </View>
      <View>
        <Text style={[styles.level, {marginBottom: 10, paddingHorizontal: 15}]}>
          {' '}
          How you can earn points?
        </Text>
        <View>
          <Text style={styles.suggestion}>
            {' '}
            Completing your profile will give you 05 points
          </Text>
        </View>
        <View>
          <Text style={styles.suggestion}>
            {' '}
            Creating a response will give 05 points
          </Text>
        </View>
        <View>
          <Text style={styles.suggestion}>
            {' '}
            Creator will get 10 points per response
          </Text>
        </View>
        <View>
          <Text style={styles.suggestion}>
            Your featured content will get you 20 points each
          </Text>
        </View>
        {/* <View>
          <Text style={styles.suggestion}>
            Upload a new video will give 20 points
          </Text>
        </View>
        <View>
          <Text style={styles.suggestion}>
            {' '}
            Give kudos to vidoes will give you 10 points
          </Text>
        </View> */}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#202020',
  },
  heading: {
    color: '#fff',
    borderRadius: Platform.OS == 'android' ? 8 : 14,
    fontSize: 20,
    fontFamily: theme.fonts.bold.fontFamily,
  },
  trophy: {
    width: '100%',
    paddingTop: 24,
    paddingBottom: 12,
    paddingHorizontal: 18,
    backgroundColor: '#1A222F',
    borderRadius: 8,
    marginBottom: 15,
  },
  level: {
    color: '#fff',
    fontFamily: theme.fonts.medium.fontFamily,
    fontSize: 15,
    marginTop: 20,
  },
  points: {
    color: '#fff',
    fontFamily: theme.fonts.bold.fontFamily,
    fontSize: 16,
    marginTop: 20,
  },
  totalPoints: {
    color: '#fff',
    fontFamily: theme.fonts.medium.fontFamily,
    fontSize: 12,
    marginTop: 10,
  },
  earnUpTo: {
    color: '#ffffff77',
    fontFamily: theme.fonts.medium.fontFamily,
    fontSize: 10,
    marginTop: 10,
  },
  suggestion: {
    color: '#fff',
    fontFamily: theme.fonts.medium.fontFamily,
    fontSize: 12,
    paddingVertical: 10,
    borderBottomColor: '#ffffff22',
    marginTop: 4,
    borderBottomWidth: 1,
    paddingHorizontal: 15,
  },
});

export default LevelScreen;
