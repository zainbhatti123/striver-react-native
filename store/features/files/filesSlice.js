import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {HttpClient} from '../../../Api/config';
import {UPLOAD_VIDEO} from '../../../Api/endPoints';

const initialState = {
  isLoading: false,
  fileVideo: '',
};

export const postFilesApiHandler = createAsyncThunk(
  'files/postFilesApiHandler',
  async (userData, thunkApi) => {
    try {
      console.log(userData);
      const {data} = await HttpClient.post(UPLOAD_VIDEO, userData
        , {
        headers: {
          'Content-Type': 'multipart/form-data', 
        },
      }
      );
      return data;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  },
);

const filesSlice = createSlice({
  name: 'files',
  initialState,
  reducers: {},
  extraReducers: {
    [postFilesApiHandler.pending]: state => {
      state.isLoading = true;
    },
    [postFilesApiHandler.fulfilled]: (state, {payload}) => {
      state.isLoading = false;
      console.log(payload);
    },
    [postFilesApiHandler.rejected]: state => {
      state.isLoading = false;
    },
  },
});

export const {} = filesSlice.actions;
export default filesSlice.reducer;
