import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Modal, Portal, Provider} from 'react-native-paper';
import Button from '../StyledComponents/Button';
import {theme} from '../theme';
import {useSelector, useDispatch} from 'react-redux';
import {setConfirmationModel} from '../store/features/popup/popupSlice';
const ConfirmationModal = ({title, subtitle, okButtonClick, loading}) => {
  // const [show, setShow] = useState(modelShow);
  const {showConfirmationModal} = useSelector(store => store.popup);
  const dispatch = useDispatch();
  return (
    <Provider>
      <Portal>
        <Modal
          visible={showConfirmationModal}
          dismissable={false}
          contentContainerStyle={[styles.container]}
          onDismiss={() => setVisible(false)}>
          {title && <Text style={styles.title}>{title}</Text>}
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              marginTop: 15,
            }}>
            <Button
              primary
              mode="contained"
              style={[
                styles.button,
                {
                  backgroundColor: 'transparent',
                  shadowOffset: 0,
                  shadowColor: 'transparent',
                  marginRight: 10,
                },
              ]}
              labelStyle={styles.buttonLabel}
              onPress={() => dispatch(setConfirmationModel(false))}>
              Cancel
            </Button>
            <Button
              primary
              mode="contained"
              style={[styles.button]}
              labelStyle={styles.buttonLabel}
              loading={loading}
              disabled={loading}
              noLoadingText
              onPress={() => okButtonClick()}>
              Yes
            </Button>
          </View>
        </Modal>
      </Portal>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1A222F',
    paddingVertical: 10,
    paddingHorizontal: 15,
    margin: 20,
    borderRadius: 8,
  },
  title: {
    color: '#fff',
    fontFamily: theme.fonts.medium.fontFamily,
    fontSize: 16,
    marginTop: 20,
  },
  subtitle: {
    fontSize: 13,
    marginTop: 3,
    fontFamily: theme.fonts.regular.fontFamily,
    color: '#ffffff88',
  },
  button: {
    width: 100,
    borderRadius: 4,
    marginTop: 20,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '500',
    fontFamily: theme.fonts.medium.fontFamily,
    marginVertical: 2,
  },
});

export default ConfirmationModal;
