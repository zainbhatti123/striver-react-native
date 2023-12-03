import React, {useCallback, useEffect, useState} from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import ActionSheet, {registerSheet} from 'react-native-actions-sheet';
import Button from '../StyledComponents/Button';
import {theme} from '../theme';
import Trophy from '../components/svg/Trophy';
import SheetHeader from './SheetHeader';
import {HttpClient} from '../Api/config';
import {useSelector, useDispatch} from 'react-redux';
import {setAllChallenges} from '../store/features/challenge/challengeSlice';

const SeeMoreSheet = props => {
  const [userData, setUserData] = useState(null);
  const {allChallenges} = useSelector(store => store.challenge);
  const {userData: ownData} = useSelector(store => store.auth);
  // console.log(ownData);
  const [type, setType] = useState('');
  const dispatch = useDispatch();
  const followUnFollowUser = useCallback(async () => {
    try {
      let route = userData.isFollowing ? 'unfollow' : 'follow';
      const response = await HttpClient.post(`profile/${route}`, {
        follow: userData.userId._id,
      });
      // console.log(response);

      let updatedChallenge = allChallenges.map(challenge => {
        if (challenge.userId?._id === userData.userId?._id) {
          let newChallenge;
          if (route == 'follow') {
            newChallenge = {...challenge, isFollowing: true};
          } else {
            newChallenge = {...challenge, isFollowing: false};
          }
          if (userData._id === newChallenge._id) {
            setUserData(newChallenge);
          }
          return newChallenge;
        } else {
          return challenge;
        }
      });
      dispatch(setAllChallenges(updatedChallenge));
    } catch (error) {
      console.log(error);
    }
  });

  // useEffect(() => {
  //   if(userData?.userId._id === ownData._id){
  //     console.log(ownData._id);
  //   }
  // }, [userData]);

  return (
    <ActionSheet
      id={props.sheetId}
      gestureEnabled={true}
      containerStyle={{backgroundColor: '#1A222F'}}
      CustomHeaderComponent={<SheetHeader />}
      onBeforeShow={data => {
        setUserData(data.data);
        setType(data.type);
      }}>
      <View style={styles.container}>
        <View style={[styles.row, {justifyContent: 'space-between'}]}>
          <View style={styles.row}>
            <Image
              source={{uri: userData?.userId.profileImage}}
              style={{height: 35, width: 35, borderRadius: 35}}
            />
            <Text style={styles.userName}>
              {userData?.userId.firstName} {userData?.userId.lastName}
            </Text>
          </View>
          {userData?.userId._id !== ownData?._id && (
            <View>
              <Button
                mode="contained"
                primary
                style={styles.followBtn}
                onPress={() => followUnFollowUser()}
                labelStyle={{lineHeight: 5, paddingTop: 11.5, fontSize: 15}}>
                {userData?.isFollowing ? 'UnFollow' : 'Follow'}
              </Button>
            </View>
          )}
        </View>
        <View style={{marginTop: 10}}>
          <Text style={styles.title}>{userData?.title}</Text>
        </View>
        <View style={{marginVertical: 10}}>
          <Text style={styles.details}>{userData?.description}</Text>
        </View>
        <View style={styles.row}>
          {userData?.hashTag.map((hashtag, index) => (
            <Text style={{color: '#ffffff77', marginRight: 3}} key={index}>
              #{hashtag}
            </Text>
          ))}
        </View>
        <View
          style={{
            height: 1,
            backgroundColor: '#ffffff22',
            marginVertical: 20,
          }}></View>
        {type == 'challenge' && (
          <View>
            <Text style={[styles.userName, {marginBottom: 13}]}>
              Assigned Trophy
            </Text>
            <View style={[styles.row, {marginBottom: 8}]}>
              <View
                style={{
                  padding: 10,
                  backgroundColor: '#ffffff22',
                  borderRadius: 4,
                }}>
                <Trophy />
              </View>
              <Text style={styles.trophy}>{userData?.trophy}</Text>
            </View>
          </View>
        )}
      </View>
    </ActionSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 17,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    fontFamily: theme.fonts.regular.fontFamily,
    color: '#fff',
    fontSize: 16,
    marginLeft: 8,
  },
  followBtn: {
    backgroundColor: 'transparent',
    shadowColor: 'transparent',
    shadowOpacity: 0,
    shadowOffset: 0,
    borderColor: '#ffffff',
    borderWidth: 1,
    paddingHorizontal: 4,
    borderRadius: 4,
    height: 32,
  },
  title: {
    color: '#fff',
    fontFamily: theme.fonts.medium.fontFamily,
    fontSize: 14,
  },
  details: {
    color: '#ffffff77',
    fontSize: 13,
    fontFamily: theme.fonts.regular.fontFamily,
  },
  trophy: {
    fontSize: 14,
    color: '#ffffff',
    fontFamily: theme.fonts.regular.fontFamily,
    marginLeft: 8,
    paddingTop: 3,
    textTransform: 'capitalize',
  },
});

registerSheet('seeMoreSheet', SeeMoreSheet);

export default SeeMoreSheet;
