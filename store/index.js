import {configureStore} from '@reduxjs/toolkit';
import authSlice from './features/auth/authSlice';
import popupSlice from './features/popup/popupSlice';
import filesSlice from './features/files/filesSlice';
import challengeSlice from './features/challenge/challengeSlice';
import homeSlice from './features/home/homeSlice';

export const store = configureStore({
  reducer: {
    home: homeSlice,
    auth: authSlice,
    popup: popupSlice,
    files: filesSlice,
    challenge: challengeSlice
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
