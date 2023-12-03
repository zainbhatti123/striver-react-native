import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  show: false,
  type: '',
  title: '',
  subtitle: '',
  onButtonPress: null,
  bgColor: '',
  button: '',
  Icon: '',
  showConfirmationModal: false,
  confirmationDetail: null,
  responseData: null,
};

const popupSlice = createSlice({
  name: 'popupSlice',
  initialState,
  reducers: {
    showAlert: (state, {payload}) => {
      state.show = true;
      state.title = payload.title;
      state.subtitle = payload.subtitle;
      state.bgColor = payload.bgColor;
      state.button = payload.button;
      state.type = payload.type;
      state.Icon = payload.Icon;
      state.onButtonPress = payload.onButtonPress;
    },
    hideAlert: state => {
      state.show = false;
      initialState;
    },
    setConfirmationModel: (state, {payload}) => {
      state.showConfirmationModal = payload;
    },
    setConfirmationDetail: (state, {payload}) => {
      state.confirmationDetail = payload;
    },
    setResponseData : (state, {payload}) => {
      state.responseData = payload
    }
  },
});

export const {
  showAlert,
  hideAlert,
  setConfirmationModel,
  setConfirmationDetail,
  setResponseData,
} = popupSlice.actions;
export default popupSlice.reducer;
