import React, {memo} from 'react';
import styled from 'styled-components';
import {
  ImageBackground,
  StyleSheet,
  KeyboardAvoidingView,
  useWindowDimensions,
  View,
} from 'react-native';

const Background = ({children, src, blured, fullWidth, style}) => {
  const {width} = useWindowDimensions();

  return (
    <View style={{flex: 1}}>
      <ImageBackground
        resizeMode="cover"
        style={[
          {flex: 1},
          blured && styles.blured,
          fullWidth && {width},
          style ?? style
        ]}
        source={src}>
        <KeyboardAvoidingView>
          {children}
        </KeyboardAvoidingView>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  blured: {
    backgroundColor: 'rgba(0, 0, 0, .95)',
    paddingTop: 40,
    flex: 1
  },
});

export default memo(Background);
