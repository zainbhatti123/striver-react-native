import {View, Text} from 'react-native';
import React, {useEffect} from 'react';
import {RNS3} from 'react-native-aws3';
import {TouchableOpacity} from 'react-native-gesture-handler';

const CreateS3Challenge = ({video}) => {
  console.log(
    'CIDEO ()()()()()()()()()()()()()()()()()()()()()()()()()()()()',
    video,
  );
  const fileName = Math.random().toString().substr(2) + '.mp4';
  const file = {
    uri: video,
    name: fileName,
    type: 'video/mp4',
  };

  const options = {
    // keyPrefix: 'uploads/',
    bucket: 'strivedev',
    region: 'eu-west-2',
    accessKey: 'AKIAUNBZXHMHGPLLLLWN',
    secretKey: '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',
    // successActionStatus: 201,
    // metadata: {
    //   latitude: '123.506239', // Becomes x-amz-meta-latitude onec in S3
    //   longitude: '-23.045293',
    //   photographer: 'John Doe',
    // },
  };

  const uploadFile = () => {
    RNS3.put(file, options).then(response => {
      if (response.status !== 201)
        throw new Error('Failed to upload image to S3');
      console.log(
        'UPLOADED ()()()()()()()()()()()()()()()()()()()()()()()()()()()() UPLOADED',
        response.body,
      );
    });
  };

  useEffect(() => {
    uploadFile();
  }, []);

  return (
    <View>
      <Text>CreateS3Challenge</Text>
      {/* <TouchableOpacity>CLICK to upload</TouchableOpacity> */}
    </View>
  );
};

export default CreateS3Challenge;
