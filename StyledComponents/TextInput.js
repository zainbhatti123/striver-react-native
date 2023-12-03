import React, {memo} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {TextInput as Input} from 'react-native-paper';
import {theme} from '../theme';

const TextInput = ({errorText, LeftIcon, RightIcon, ...props}) => (
  <View style={styles.container}>
    <Input
      style={[styles.input, props.style ?? props.style]}
      selectionColor={theme.colors.primary}
      outlineColor="#5F5F5F"
      activeOutlineColor="#fff"
      underlineColor="#fff"
      theme={{colors: {text: '#fff', placeholder: theme.colors.grey}, roundness: 8}}
      left={LeftIcon && <Input.Icon name={() => LeftIcon} />}
      right={RightIcon && <Input.Icon name={() => RightIcon} />}
      mode="outlined"
      {...props}
    />
    {errorText ? <Text style={styles.error}>{errorText}</Text> : null}
  </View>
);

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  error: {
    fontSize: 14,
    color: theme.colors.error,
    paddingHorizontal: 4,
    paddingTop: 4,
  },
});

export default memo(TextInput);
