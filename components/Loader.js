import React from 'react';
import {View, Image, StyleSheet} from 'react-native';
import {ActivityIndicator} from 'react-native-paper';
import {theme} from '../theme';

const Loader = ({hideLogo, bgColor}) => {
  return (
    <View style={[styles.container, bgColor && {backgroundColor: bgColor}]}>
      <View>
        <ActivityIndicator color={theme.colors.primary} size={70} />
        {!hideLogo && (
          <Image
            source={require('../assets/striver.png')}
            style={{
              marginTop: 30,
              width: 200,
              resizeMode: 'contain',
              height: 50,
            }}></Image>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
});

export default Loader;
