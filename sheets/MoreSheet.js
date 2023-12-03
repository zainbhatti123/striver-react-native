import React, {useCallback, useEffect, useState} from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import ActionSheet, {registerSheet} from 'react-native-actions-sheet';
import Clipboard from '@react-native-community/clipboard';
import {theme} from '../theme';
import SheetHeader from './SheetHeader';
import DownloadSvg from '../components/svg/DownloadSvg';
import CopyIconSvg from '../components/svg/CopyiconSvg';
import ShareSvg from '../components/svg/ShareSvg';
import Share from 'react-native-share';
import {HttpClient} from '../Api/config';
import RNFS from 'react-native-fs';

const MoreSheets = props => {
  const [userData, setUserData] = useState({});
  const [isActiveChallenge, setActiveChallenge] = useState(null);
  const shareVideoOnsocialMedia = useCallback(() => {
    // console.log(userData);
    const shareOptions = {
      // hard coded path
      message: userData?.shortUri
        ? userData?.shortUri
        : 'https://www.striver.com',
      // title:'this is title of video',
      // url: 'https://strivedev.s3.amazonaws.com/1662579218576-08821004906001906.mp4',
      // type: 'video/mp4',
    };
    Share.open(shareOptions)
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        err && console.log(err);
      });
  });
  // console.log("userDatauserDatauserDatauserDatauserDatauserData", userData)

  const downloadVideo = ({uri, _id}) => {
    console.log('userDatauserDatauserDatauserDatauserDatauserData', uri);
    RNFS.downloadFile({
      fromUrl: uri,
      toFile: `${RNFS.ExternalDirectoryPath}/striver-${Math.random().toString(36).substr(2)}.mp4`,
    })
      .promise.then(r => {
        console.log(
          r,
          '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!   DOWNLOAD COMPLETE , r, !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!',
        );
      })
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <ActionSheet
      id={props.sheetId}
      gestureEnabled={true}
      containerStyle={{backgroundColor: '#1A222F'}}
      onBeforeShow={({data}) => {
        setUserData(data);
        console.log('DATADATADTATDATDATDATDTADTADTADTADTATD', data);
      }}
      CustomHeaderComponent={<SheetHeader />}>
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => downloadVideo(userData)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
          }}
          activeOpacity={0.7}>
          <View style={styles.widget}>
            <View style={{height: 18, width: 17}}>
              <DownloadSvg viewBox="0 0 16 17" />
            </View>
          </View>
          <Text style={styles.text}>Download</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity
          style={{flexDirection: 'row', alignItems: 'center', flex: 1}}
          onPress={() =>
            Clipboard.setString(
              userData?.shortUri
                ? userData?.shortUri
                : 'https://www.striver.com',
            )
          }
          activeOpacity={0.7}>
          <View style={styles.widget}>
            <View style={{height: 18, width: 18}}>
              <CopyIconSvg viewBox="0 0 18 18" />
            </View>
          </View>
          <Text style={styles.text}>Copy Link</Text>
        </TouchableOpacity> */}
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
          }}
          activeOpacity={0.7}
          onPress={() => shareVideoOnsocialMedia()}>
          <View style={styles.widget}>
            <View style={{height: 18, width: 18}}>
              <ShareSvg viewBox="0 0 18 18" />
            </View>
          </View>
          <Text style={styles.text}>Share</Text>
        </TouchableOpacity>
      </View>
    </ActionSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    paddingVertical: 25,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  widget: {
    backgroundColor: '#ffffff22',
    borderRadius: 30,
    padding: 8,
  },
  text: {
    color: '#fff',
    fontSize: 13,
    fontFamily: theme.fonts.regular.fontFamily,
    marginLeft: 8,
  },
});

registerSheet('MoreSheet', MoreSheets);
export default MoreSheets;
