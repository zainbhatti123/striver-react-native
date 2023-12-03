import React, {useEffect} from 'react';
import {Text, StyleSheet, View} from 'react-native';
import {Modal, Portal} from 'react-native-paper';
import Button from '../StyledComponents/Button';
import {theme} from '../theme';
import {useSelector, useDispatch} from 'react-redux';
import {hideAlert} from '../store/features/popup/popupSlice';
import { CloseSquare, TickSquare } from 'iconsax-react-native';
import {resetMessage, resetErrorMessage} from '../store/features/auth/authSlice';

const AlertModal = () => {
  const {show, type, title, subtitle, onButtonPress, button, bgColor, Icon} =
    useSelector(store => store.popup);

  const dispatch = useDispatch();

  const _butonClick = () => {
    if (onButtonPress) {
      onButtonPress();
    }
    dispatch(hideAlert());
    dispatch(resetMessage());
    dispatch(resetErrorMessage());
  };

  return (
    <Portal>
      <Modal
        visible={show}
        dismissable={false}
        contentContainerStyle={[
          styles.container,
          bgColor && {backgroundColor: bgColor},
        ]}
        onDismiss={() => setVisible(false)}>
        {Icon ? Icon : type == 'error' ? (
          <CloseSquare size={40} color={theme.colors.error} />
        ) : (
          <TickSquare color={theme.colors.primary} size={40} />
        )}
        {title && <Text style={styles.title}>{title}</Text>}
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        {button && (
          <Button
            primary
            mode="contained"
            style={[styles.button]}
            labelStyle={styles.buttonLabel}
            onPress={_butonClick}>
            {button}
          </Button>
        )}
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1A222F',
    paddingVertical: 26,
    paddingHorizontal: 15,
    margin: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontFamily: theme.fonts.medium.fontFamily,
    fontSize: 20,
    marginTop: 20,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: theme.fonts.regular.fontFamily,
    color: '#ffffff88',
    textAlign: 'center'
  },
  button: {
    width: 130,
    borderRadius: 4,
    marginTop: 20,
  },
  buttonLabel: {
    fontSize: 18,
    fontWeight: '500',
    fontFamily: theme.fonts.medium.fontFamily,
    marginVertical: 2,
  },
});

export default AlertModal;
