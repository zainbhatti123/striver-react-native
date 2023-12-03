import React, {useState} from 'react';
import {View, Text, ScrollView, StyleSheet, Image} from 'react-native';
import {TouchableRipple} from 'react-native-paper';
import {theme} from '../../theme';

const Notifications = () => {
  const [notification, setNotification] = useState([
    {
      title: 'Jimmy Nilson followed you',
      time: '2 hours ago',
      profileMedia: [require('../../assets/user-profile-img.png')],
      media: null,
    },
    {
      title: 'Mirachel, Sujiwono and 4 other kudos your video.',
      time: '2 hours ago',
      profileMedia: [
        require('../../assets/user-profile-img.png'),
        require('../../assets/user-profile-img.png'),
      ],
      media: require('../../assets/next-response.png'),
    },
    {
      title: 'Ola Gonzales commented on your video "Killin’ chillin"',
      time: '2 hours ago',
      profileMedia: [
        require('../../assets/user-profile-img.png'),
        require('../../assets/user-profile-img.png'),
        require('../../assets/user-profile-img.png'),
      ],
      media: null,
    },
  ]);

  const _showNotification = () => {};
  return (
    <ScrollView style={styles.container}>
      <View>
        <Text style={styles.heading}>Notifications</Text>
        {notification.map((item, index) => (
          <TouchableRipple
            rippleColor="#ffffff22"
            key={index}
            onPress={() => _showNotification()}>
            <View style={styles.notification}>
              <View>
                {item.profileMedia.length <= 1 ? (
                  <Image
                    source={item.profileMedia[0]}
                    style={{height: 60, width: 60, borderRadius: 60}}
                  />
                ) : (
                  <View style={{marginTop: 15, marginRight: 10}}>
                    <Image
                      source={item.profileMedia[0]}
                      style={{height: 60, width: 60, borderRadius: 60}}
                    />
                    <Image
                      source={item.profileMedia[1]}
                      style={styles.secondImage}
                    />
                  </View>
                )}
              </View>
              <View style={{paddingHorizontal: 10, flexShrink: 1}}>
                <View>
                  <Text style={styles.notificationTitle}>{item.title}</Text>
                </View>
                <Text
                  style={[
                    styles.notificationTitle,
                    {color: '#ffffff77', marginTop: 0, fontSize: 12},
                  ]}>
                  {item.time}
                </Text>
              </View>
              {item.media && (
                <View style={{marginLeft: 'auto'}}>
                  <Image
                    source={item.media}
                    style={{
                      height: 81,
                      width: 64,
                      borderRadius: 4,
                    }}
                  />
                </View>
              )}
            </View>
          </TouchableRipple>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#202020',
    padding: 16,
    paddingTop: Platform.OS == 'android' ? 15 : 40,
  },
  heading: {
    color: '#ffffff',
    fontSize: 20,
    fontFamily: theme.fonts.medium.fontFamily,
    marginTop: 15,
  },
  notification: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 16,
    borderBottomColor: '#ffffff22',
    borderBottomWidth: 1,
    justifyContent: 'flex-start',
  },
  secondImage: {
    position: 'absolute',
    top: -20,
    right: -10,
    height: 60,
    width: 60,
    borderRadius: 60,
    zIndex: -1,
  },
  notificationTitle: {
    color: '#fff',
    fontSize: 14,
    fontFamily: theme.fonts.regular.fontFamily,
    marginTop: 10,
  },
});

export default Notifications;
