import AsyncStorage from '@react-native-async-storage/async-storage';
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {HttpClient} from '../../../Api/config';
import {
  LOGIN,
  USER,
  FORGET_PASSWORD,
  CONFIRM_ACCOUNT,
  RESET_PASSWORD,
  SOCIAL_LOGIN,
} from '../../../Api/endPoints';

const initialState = {
  isLogged: false,
  isLoading: false,
  userData: {},
  isInvalid: false,
  isCreated: false,
  errorMessage: null,
  message: {},
  isAuthorized: false,
  forgetEmail: '',
  isOnboarded: false,
  pageLoading: false,
  loginType: '',
  isUpdated: false,
};

// login user
export const loginApiHandler = createAsyncThunk(
  'auth/loginApiHandler',
  async (userData, thunkApi) => {
    try {
      const {data} = await HttpClient.post(LOGIN, userData);
      return data;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  },
);
export const updateUserdata = createAsyncThunk(
  'auth/updateUserdata',
  async (userData, thunkApi) => {
    try {
      const {data} = await HttpClient.put(USER+"/"+userData.id, userData.body);
      return data;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  },
);
export const socialLoginApiHandler = createAsyncThunk(
  'auth/socialLoginApiHandler',
  async (userData, thunkApi) => {
    try {
      const {data} = await HttpClient.post(SOCIAL_LOGIN, userData);
      return data;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  },
);

export const forgetPasswordApiHandler = createAsyncThunk(
  'auth/forgetPasswordApiHandler',
  async (payload, thunkApi) => {
    if (payload.action == 'forget') {
      try {
        const {data} = await HttpClient.post(FORGET_PASSWORD, payload.data);
        return data;
      } catch (error) {
        return thunkApi.rejectWithValue(error);
      }
    } else if (payload.action == 'otp') {
      try {
        const {data} = await HttpClient.post(CONFIRM_ACCOUNT, payload.data);
        return data;
      } catch (error) {
        return thunkApi.rejectWithValue(error);
      }
    } else if (payload.action == 'reset') {
      try {
        const {data} = await HttpClient.post(RESET_PASSWORD, payload.data);
        return data;
      } catch (error) {
        return thunkApi.rejectWithValue(error);
      }
    }
  },
);

// Signup user
export const signupApiHandler = createAsyncThunk(
  'auth/signupApiHandler',
  async (userData, thunkApi) => {
    // thunkApi has access to whole app store state via thunkApi.getState()
    try {
      const {data} = await HttpClient.post(USER, userData);
      return data;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  },
);

const setLogout = async () => {
  try {
    await AsyncStorage.removeItem('isLogged');
    await AsyncStorage.removeItem('userData');
  } catch (error) {
    console.log(error);
  }
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLogin: (state, {payload}) => {
      state.isAuthorized = payload;
      if (payload == false) {
        state.isLogged = false;
        state.loginType = '';
        setLogout();
      }
    },
    setOnBoarding: (state, {payload}) => {
      state.isOnboarded = payload;
    },
    resetErrorMessage: state => {
      state.errorMessage = null;
    },
    resetMessage: state => {
      state.message = {};
    },
    resetWholeState: () => initialState,
    setForgetEmail: (state, {payload}) => {
      state.forgetEmail = payload;
    },
    clearForgetEmail: state => {
      state.forgetEmail = '';
    },
    setPageLoading: (state, {payload}) => {
      state.pageLoading = payload;
    },
    setUserData: (state, {payload}) => {
      state.userData = payload;
    },
    resetUpdated : (state) => {
      state.isUpdated = false;
    },
  },
  extraReducers: {
    [loginApiHandler.pending]: state => {
      state.isLoading = true;
      state.isInvalid = false;
      state.message = {};
    },
    [loginApiHandler.fulfilled]: (state, {payload}) => {
      state.isLoading = false;
      state.userData = payload.data;
      state.loginType = payload.data.loginType;
      state.isInvalid = false;
      state.isLogged = true;
    },
   
    [loginApiHandler.rejected]: (state, {payload}) => {
      state.isLoading = false;
      state.isLogged = false;
      state.isInvalid = true;
      state.message = {
        type: 'error',
        text: payload.message,
      };
    },
    [updateUserdata.pending]: (state) => {
      state.isLoading = true;
    },
    [updateUserdata.fulfilled]: (state, {payload}) => {
      state.isLoading = false;
      state.userData = payload.data;
      state.isUpdated = true;
    },
    [updateUserdata.rejected]: (state) => {
      state.isLoading = false;
    },

    // social login

    [socialLoginApiHandler.pending]: state => {
      state.isLoading = true;
      state.isInvalid = false;
      state.message = {};
    },
    [socialLoginApiHandler.fulfilled]: (state, {payload}) => {
      state.isLoading = false;
      state.userData = payload.data;
      state.isInvalid = false;
      state.isLogged = true;
    },

    [socialLoginApiHandler.rejected]: (state, {payload}) => {
      state.isLoading = false;
      state.isLogged = false;
      state.isInvalid = true;
      state.message = {
        type: 'error',
        text: payload.message,
      };
    },

    // Signup user
    [signupApiHandler.pending]: state => {
      state.isLoading = true;
      state.errorMessage = null;
      state.message = {type: '', text: ''};
    },
    [signupApiHandler.fulfilled]: (state, {payload}) => {
      state.isLoading = false;
      state.isCreated = true;
      state.message = {
        type: 'success',
        text: 'Account has been created successfully!',
      };
    },
    [signupApiHandler.rejected]: (state, {payload}) => {
      state.errorMessage = payload.message;
      state.isLoading = false;
      state.isCreated = false;
      state.message = {
        type: 'error',
        text: payload.message,
      };
    },

    [forgetPasswordApiHandler.pending]: state => {
      state.isLoading = true;
      state.errorMessage = null;
      state.isCreated = false;
      state.message = {type: '', text: ''};
    },
    [forgetPasswordApiHandler.fulfilled]: state => {
      state.isLoading = false;
      state.isCreated = true;
      state.message = {
        type: 'success',
        text: '',
      };
    },
    [forgetPasswordApiHandler.rejected]: (state, {payload}) => {
      state.isLoading = false;
      state.isCreated = false;
      state.errorMessage = payload.message;
      state.message = {
        type: 'error',
        text: payload.message,
      };
    },
  },
});

export const {
  setLogin,
  resetWholeState,
  resetErrorMessage,
  resetMessage,
  setForgetEmail,
  clearForgetEmail,
  setOnBoarding,
  setPageLoading,
  setUserData,
  resetUpdated
} = authSlice.actions;
export default authSlice.reducer;
