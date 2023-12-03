import React, {useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import {ArrowLeft2} from 'iconsax-react-native';
import {theme} from '../../../theme';
import {useSelector} from 'react-redux';

const Trophies = ({route, navigation}) => {
  const {userData: ownData} = useSelector(store => store.auth);
  // console.log(route.params);
  const {
    trophiesChallenge,
    trophiesChallengeResponse,
    trophiesConversationChallenge,
    trophiesConversationChallengeResponse,
  } = route.params.user;
  // console.log(route.params.user);
  const allTrophies = [
    ...trophiesChallenge,
    ...trophiesChallengeResponse,
    ...trophiesConversationChallenge,
    ...trophiesConversationChallengeResponse,
    ...route.params.customTrophies,
  ];
  // console.log('ALL -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=--=', allTrophies);

  // useEffect(() => {
  //   if (route.params.user._id === ownData._id) {
  //     console.log(ownData._id);
  //   }
  // }, [route.params.user]);
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
              route.params.user?._id !== ownData?._id && 'userProfile',
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
        <Text style={styles.heading}>Trophies</Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          padding: 20,
          marginTop: 10,
        }}>
        {/* <View style={styles.trophy}>
          <Image source={require('../../../assets/trophy-1.png')} />
          <Text style={styles.trophyTitle}>Penalty kick Expert</Text>
        </View>
        <View style={styles.trophy}>
          <Image source={require('../../../assets/trophy-2.png')} />
          <Text style={styles.trophyTitle}> Corner Expert</Text>
        </View> */}

        {allTrophies.map(({title, downloadHref}) => (
          <View style={styles.trophy} key={title}>
            <View style={{width: 70, height: 100}}>
              <Image
                style={{width: '100%', height: '100%'}}
                source={{uri: downloadHref}}
              />
            </View>
            <Text style={styles.trophyTitle}>{title}</Text>
          </View>
        ))}
        {/* <View style={styles.trophy}>
          <Image source={require('../../../assets/trophy-4.png')} />
          <Text style={styles.trophyTitle}> Corner Expert</Text>
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
    display: 'flex',
    flexBasis: '48%',
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 12,
    backgroundColor: '#ffffff22',
    borderRadius: 8,
    marginBottom: 15,
  },
  trophyTitle: {
    color: '#fff',
    fontFamily: theme.fonts.medium.fontFamily,
    fontSize: 14,
    marginTop: 20,
    // paddingHorizontal: 5,
    textAlign: 'center',
  },
});

export default Trophies;
