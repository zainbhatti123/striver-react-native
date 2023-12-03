import React from 'react';
import {View} from 'react-native';

const SheetHeader = () => {
  return (
    <View
      style={{
        paddingTop: 10,
        backgroundColor: '#1A222F',
        alignItems: 'center',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
      }}>
      <View
        style={{
          backgroundColor: '#ffffff22',
          height: 4,
          width: 35,
          borderRadius: 100,
        }}></View>
    </View>
  );
};

export default SheetHeader;
