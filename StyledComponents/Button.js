import React, {memo} from 'react';
import {ActivityIndicator, Platform, StyleSheet} from 'react-native';
import {Button as PaperButton} from 'react-native-paper';
import {theme} from '../theme';

const Button = ({
  mode,
  style,
  children,
  labelStyle,
  primary,
  noLoadingText,
  ...props
}) => (
  <PaperButton
    style={[
      styles.button,
      mode === 'outlined' && {backgroundColor: theme.colors.surface},
      primary && {backgroundColor: theme.colors.primary},
      props.disabled && {backgroundColor: '#0B1219'},
      style,
    ]}
    labelStyle={[
      styles.text,
      labelStyle ?? labelStyle,
      primary && {color: '#fff'},
      props.disabled && {color: '#FFFFFF66'},
    ]}
    mode={mode}
    {...props}>
    {props.loading ? `${!noLoadingText ? 'Please wait...' : ''}` : children}
  </PaperButton>
);

const styles = StyleSheet.create({
  button: {
    width: '100%',
    marginVertical: 10,
    borderRadius: 8,
  },
  text: {
    paddingBottom: Platform.OS == 'android' ? 0 : 4,
    textTransform: 'capitalize',
    paddingTop: Platform.OS == 'android' ? 5 : 4,
    letterSpacing: 0,
    fontFamily: theme.fonts.medium.fontFamily,
  },
});

export default memo(Button);
