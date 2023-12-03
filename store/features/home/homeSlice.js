import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {HttpClient} from '../../../Api/config';

const initialState = {
  tabBarHeight: '',
  activeProfileId: null,
  activeFilters: {
    filter: {
      label: 'Trending',
      value: 'trending',
    },
    view: 'allVideos',
  },
};

export const likeApiHandler = createAsyncThunk(
  'home/likeApiHandler',
  async (userData, thunkApi) => {
    try {
      // console.log(userData);
      // const {data} = await HttpClient.post(UPLOAD_VIDEO, userData);
      // return data;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  },
);

const homeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {
    setTabBarHeight: (state, {payload}) => {
      state.tabBarHeight = payload;
    },
    setActiveProfileId: (state, {payload}) => {
      state.activeProfileId = payload;
    },
    resetActiveId: state => {
      state.activeProfileId = null;
    },
    setFilters: (state, {payload}) => {
      state.activeFilters = payload;
    },
  },
  extraReducers: {
    [likeApiHandler.fulfilled]: ({payload}) => {
      console.log(payload);
    },
  },
});

export const {setTabBarHeight, setActiveProfileId, resetActiveId, setFilters} =
  homeSlice.actions;
export default homeSlice.reducer;
