import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  useWindowDimensions,
} from 'react-native';
import Clipboard from '@react-native-community/clipboard';
import {ArrowLeft2, Edit2, ArrowRight2} from 'iconsax-react-native';
import {theme} from '../../theme';
import TextInput from '../../StyledComponents/TextInput';
import {useNavigation} from '@react-navigation/native';
import {TouchableRipple} from 'react-native-paper';
import CopyiconSvg from '../../components/svg/CopyiconSvg';
import Button from '../../StyledComponents/Button';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {
  resetUpdated,
  setLogin,
  updateUserdata,
} from '../../store/features/auth/authSlice';
import {RNS3} from 'react-native-aws3';
import {useDispatch, useSelector} from 'react-redux';
import {launchImageLibrary} from 'react-native-image-picker';
import {valueValidator} from '../../utils';
import Interest from './Interest';
import DatePicker from 'react-native-date-picker';
import {useAsyncStorage} from '../../hooks/UseAsyncStorage';
import Loader from '../../components/Loader';
import {showAlert} from '../../store/features/popup/popupSlice';
import AlertModal from '../../components/AlertModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {HttpClient} from '../../Api/config';

const EditProfile = () => {
  const {userData, isUpdated, isLoading} = useSelector(store => store.auth);
  const {height} = useWindowDimensions();
  const navigation = useNavigation();
  const [firstName, setFirstName] = useState({
    value: userData.firstName,
    error: '',
  });
  const [lastName, setLastName] = useState({
    value: userData.lastName,
    error: '',
  });
  // console.log(userData);
  const [bio, setBio] = useState({value: userData.userBio, error: ''});
  const [image, setImage] = useState(userData.profileImage);
  const [imageChanged, setImageChanged] = useState(false);
  const [email, setEmail] = useState(userData.email);
  const [username, setUsername] = useState(userData.userName);
  const [dob, setDob] = useState({
    value: new Date(userData.dob ? userData.dob.split('T')[0] : '2020-01-01'),
    error: '',
  });
  const [dobForApi, setDobForApi] = useState(
    userData.dob ? userData.dob.split('T')[0] : '2020-01-01',
  );
  const [profileLink, setProfileLink] = useState(userData.userProfileLink);
  const [interests, setInterests] = useState(userData.interest);
  const [activeInput, setActiveInput] = useState('');
  const [showInterest, setShowInterest] = useState(false);
  const [apiLoading, setApiLoading] = useState(false);
  const [, setUserData] = useAsyncStorage('userData');
  const dispatch = useDispatch();

  const updateHandle = profile => {
    let profileData = {
      id: userData._id,
      body: {
        firstName: firstName.value,
        lastName: lastName.value,
        email: email,
        dob: dobForApi,
        profileImage: profile ? profile : image,
        userBio: bio.value,
        interest: interests,
      },
    };
    dispatch(updateUserdata(profileData));
    setApiLoading(false);
  };

  const uploadUser = async () => {
    const checkFirstName = valueValidator(firstName.value, 'First Name');
    const checkLastName = valueValidator(lastName.value, 'Last Name');
    const checkBio = valueValidator(bio.value, 'Bio');
    const checkDob = valueValidator(dob.value, 'Date of birth');

    if (checkFirstName || checkLastName || checkBio || checkDob) {
      checkFirstName && setFirstName({...firstName, error: checkFirstName});
      checkLastName && setLastName({...lastName, error: checkLastName});
      checkBio && setBio({...bio, error: checkBio});
      checkDob && setDob({...dob, error: checkDob});
      return;
    }
    setApiLoading(true);
    const fileName = Math.random().toString().substr(2) + '.png';
    const token = await AsyncStorage.getItem('token');

    const file = {
      uri: image,
      name: fileName,
      type: 'image/png',
    };

    const options = {
      bucket: 'strivedev',
      region: 'eu-west-2',
      accessKey: 'AKIAUNBZXHMHGPLLLLWN',
      secretKey: '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',
    };

    if (imageChanged) {
      let s3Image = '';
      await RNS3.put(file, options).then(response => {
        if (response.status !== 201) {
          throw new Error('Failed to upload image to S3');
        }
        s3Image = response.body.postResponse.location;
      });
      setImage(s3Image);
      updateHandle(s3Image);
      //     'POST',
      //     'https://striver-api.herokuapp.com/uploadProfileImage',
      //     {
      //       'Content-Type': 'multipart/form-data',
      //       Authorization: `Bearer ${JSON.parse(token)}`,
      //     },
      //     [
      //       {
      //         name: 'image',
      //         filename: fileName,
      //         type: 'image/jpg',
      //         data: RNFetchBlob.wrap(image),
      //       },
      //     ],
      //   )
      //     .then(response => response.json())
      //     .then(data => {
      //       // setImage(data.data.downloadHref);
      //       // console.log(data.data);
      //       updateHandle(data.data.downloadHref);
      //     })
      //     .catch(err => {
      //       console.log(err, '========================err');
      //     });

      // } else {
      //   updateHandle();
    } else {
      updateHandle();
    }
  };
  const selectUserImage = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
      });
      if (result.assets.length) {
        setImage(result.assets[0].uri);
        setImageChanged(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const backToMain = () => {
    setShowInterest(false);
  };
  const handleLogout = useCallback(async () => {
    try {
      const {loginType} = userData;
      console.log(loginType, 'logout ==========1');
      if (loginType == 'google') {
        await GoogleSignin.revokeAccess();
        await GoogleSignin.signOut();
      }
      if (loginType == 'facebook') {
        console.log(loginType, 'logoutType ==========2');
      }
      dispatch(setLogin(false));
    } catch (error) {
      console.log(error);
    }
  });

  const receiveInteresets = data => {
    setInterests(data);
  };

  useEffect(() => {
    if (isUpdated) {
      setUserData(userData);
      dispatch(resetUpdated());
      dispatch(
        showAlert({
          type: 'success',
          title: 'Profile Update',
          subtitle: 'Your profile has been updated successfully!',
          button: 'Ok',
        }),
      );
    }
  }, [isUpdated]);

  return (
    <ScrollView
      style={{backgroundColor: '#202020'}}
      keyboardShouldPersistTaps="handled">
      {isLoading || apiLoading ? (
        <View style={{flex: 1, height}}>
          <Loader bgColor="#202020" hideLogo />
        </View>
      ) : (
        <View style={styles.container}>
          {!showInterest && (
            <>
              <View style={styles.header}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('Profile')}>
                  <ArrowLeft2 size="25" color="#ffffff" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => uploadUser()}>
                  <Text style={styles.save}>Save</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.profilePic}>
                <View style={{width: 120}}>
                  <Image
                    source={{
                      uri: image,
                    }}
                    style={{height: 120, width: 120, borderRadius: 120}}
                  />
                  <TouchableOpacity
                    style={styles.editIcon}
                    onPress={() => {
                      selectUserImage();
                    }}>
                    <Edit2 size="20" color="#ffffff" />
                  </TouchableOpacity>
                </View>
              </View>
              <View>
                <Text style={styles.formHeading}>Personal Info</Text>
                <View style={{marginTop: 15}}>
                  <Text style={styles.label}>First Name</Text>
                  <TextInput
                    style={[
                      styles.input,
                      activeInput == 'firstName' && {
                        backgroundColor: 'transparent',
                      },
                    ]}
                    returnKeyType="next"
                    // onSubmitEditing={() => alert('testing')}
                    error={!!firstName.error}
                    errorText={firstName.error}
                    value={firstName.value}
                    outlineColor="#6A6A6A22"
                    onChangeText={name =>
                      setFirstName({value: name, error: ''})
                    }
                    onFocus={() => setActiveInput('firstName')}
                    onBlur={() => setActiveInput('')}
                    dense
                  />
                </View>
                <View style={{marginTop: 15}}>
                  <Text style={styles.label}>Last Name</Text>
                  <TextInput
                    style={[
                      styles.input,
                      activeInput == 'lastName' && {
                        backgroundColor: 'transparent',
                      },
                    ]}
                    returnKeyType="next"
                    // onSubmitEditing={() => alert('testing')}
                    error={!!lastName.error}
                    errorText={lastName.error}
                    value={lastName.value}
                    outlineColor="#6A6A6A22"
                    onChangeText={name => setLastName({value: name, error: ''})}
                    onFocus={() => setActiveInput('lastName')}
                    onBlur={() => setActiveInput('')}
                    dense
                  />
                </View>
                <View style={{marginTop: 15}}>
                  <Text style={styles.label}>Your Bio</Text>
                  <TextInput
                    style={[
                      styles.input,
                      activeInput == 'bio' && {backgroundColor: 'transparent'},
                    ]}
                    outlineColor="#6A6A6A22"
                    value={bio.value}
                    error={!!bio.error}
                    errorText={bio.error}
                    onChangeText={bio => setBio({value: bio, error: ''})}
                    multiline
                    dense
                    numberOfLines={4}
                    onFocus={() => setActiveInput('bio')}
                    onBlur={() => setActiveInput('')}
                  />
                </View>
                <View style={{marginTop: 15}}>
                  <Text style={styles.label}>Your Email</Text>
                  <TextInput
                    style={[
                      styles.input,
                      activeInput == 'email' && {
                        backgroundColor: 'transparent',
                      },
                    ]}
                    value={email}
                    outlineColor="#6A6A6A22"
                    disabled
                    onChangeText={value => setEmail(value)}
                    dense
                    onFocus={() => setActiveInput('email')}
                    onBlur={() => setActiveInput('')}
                  />
                </View>
                <View style={{marginTop: 15}}>
                  <Text style={styles.label}>Username</Text>
                  <TextInput
                    style={[styles.input]}
                    value={username}
                    outlineColor="#6A6A6A22"
                    onChangeText={value => setUsername(value)}
                    dense
                    disabled
                  />
                </View>
                <View style={{marginTop: 15}}>
                  <Text style={styles.label}>Date Of Birth</Text>
                  {/* <TextInput
                  style={[
                    styles.input,
                    activeInput == 'dob' && {backgroundColor: 'transparent'},
                  ]}
                  error={!!dob.error}
                  errorText={dob.error}
                  value={dob.value}
                  outlineColor="#6A6A6A22"
                  disabled
                  dense
                  onFocus={() => setActiveInput('dob')}
                  onBlur={() => setActiveInput('')}
                /> */}
                  <DatePicker
                    fadeToColor="#000"
                    theme="dark"
                    mode="date"
                    date={dob.value}
                    androidVariant="nativeAndroid"
                    style={{alignSelf: 'center'}}
                    onDateChange={date => {
                      setDob({value: date, error: ''});
                      let formatedDate =
                        date.getFullYear() +
                        '-' +
                        (date.getMonth() + 1) +
                        '-' +
                        date.getDate();
                      setDobForApi(formatedDate);
                    }}
                    maximumDate={new Date()}
                  />
                </View>
              </View>
              <View style={{marginTop: 10}}>
                <Text style={styles.formHeading}>Account Info</Text>
                {/* {userData.loginType === 'local' && (
                  <TouchableRipple
                    rippleColor="#ffffff22"
                    onPress={() => console.log('Pressed')}
                    style={{marginTop: 20}}>
                    <View style={styles.changePassword}>
                      <Text
                        style={[
                          styles.save,
                          {fontFamily: theme.fonts.regular.fontFamily},
                        ]}>
                        Change Password
                      </Text>
                      <ArrowRight2 size="25" color="#ffffff" />
                    </View>
                  </TouchableRipple>
                )} */}
                <View style={{marginTop: 15}}>
                  <Text style={styles.label}>Profile Link</Text>
                  <TextInput
                    style={styles.input}
                    value={profileLink}
                    outlineColor="#6A6A6A22"
                    onChangeText={value => setProfileLink(value)}
                    disabled
                    dense
                    RightIcon={
                      <TouchableOpacity
                        onPress={() => Clipboard.setString(profileLink)}>
                        <View style={{height: 22, width: 22}}>
                          <CopyiconSvg viewBox="0 0 18 18" />
                        </View>
                      </TouchableOpacity>
                    }
                  />
                </View>
                <TouchableRipple
                  rippleColor="#ffffff22"
                  onPress={() => setShowInterest(true)}
                  style={{marginTop: 10}}>
                  <View
                    style={{
                      borderBottomColor: '#ffffff22',
                      borderBottomWidth: 1,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingVertical: 10,
                    }}>
                    <Text
                      style={[
                        styles.save,
                        {fontFamily: theme.fonts.regular.fontFamily},
                      ]}>
                      Interests
                    </Text>
                    <ArrowRight2 size="25" color="#ffffff" />
                  </View>
                </TouchableRipple>
                <View
                  style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    marginTop: 20,
                  }}>
                  {interests.length ? (
                    interests.map((item, index) => (
                      <View
                        style={[
                          styles.changePassword,
                          {marginRight: 10, marginBottom: 10},
                        ]}
                        key={index}>
                        <Text
                          style={{
                            color: '#fff',
                            fontSize: 13,
                            fontFamily: theme.fonts.regular.fontFamily,
                          }}>
                          {item}
                        </Text>
                      </View>
                    ))
                  ) : (
                    <Text style={{color: theme.colors.grey, marginBottom: 10}}>
                      No interests selected
                    </Text>
                  )}
                </View>
                <Button
                  style={{backgroundColor: '#ffffff'}}
                  labelStyle={{color: '#000000', textTransform: 'uppercase'}}
                  mode="contained"
                  onPress={() => handleLogout()}>
                  LOG OUT
                </Button>
              </View>
            </>
          )}
          {showInterest && (
            <Interest
              back={backToMain}
              sendData={receiveInteresets}
              alreadySelected={interests}
            />
          )}
        </View>
      )}
      <AlertModal />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    paddingTop: Platform.OS == 'android' ? 25 : 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  save: {
    color: '#fff',
    fontFamily: theme.fonts.medium.fontFamily,
    fontSize: 16,
  },
  profilePic: {
    marginVertical: 20,
    alignItems: 'center',
  },
  editIcon: {
    position: 'absolute',
    backgroundColor: theme.colors.primary,
    padding: 10,
    borderRadius: 50,
    bottom: -10,
    right: 10,
  },
  formHeading: {
    fontSize: 16,
    fontFamily: theme.fonts.medium.fontFamily,
    color: '#ffffff',
    paddingBottom: 5,
    borderBottomColor: '#ffffff22',
    borderBottomWidth: 1,
    marginTop: 10,
  },
  label: {
    color: '#ffffff77',
    fontSize: 14,
    fontFamily: theme.fonts.regular.fontFamily,
  },
  input: {
    backgroundColor: '#6A6A6A22',
    paddingVertical: 3,
  },
  changePassword: {
    paddingTop: 13,
    paddingBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: '#6A6A6A22',
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default EditProfile;
