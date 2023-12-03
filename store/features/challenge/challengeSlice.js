import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {HttpClient} from '../../../Api/config';
import {CHALLENGE} from '../../../Api/endPoints';
import {useNavigation} from '@react-navigation/native';
const initialState = {
  isLoading: false,
  success: false,
  invalid: false,
  allChallenges: null,
};

export const postChallengesApiHandler = createAsyncThunk(
  'challenge/postChallengesApiHandler',
  async (challengeData, thunkApi) => {
    try {
      const {data} = await HttpClient.post(
        challengeData.type == 'challenge'
          ? CHALLENGE
          : 'createChallengeResponse',
        challengeData.data,
      );
      return data;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  },
);
export const likeDislikeChallenges = createAsyncThunk(
  'challenge/likeDislikeChallenges',
  async (likeDislikeChallengeData, thunkApi) => {
    try {
      const {data} = await HttpClient.post(CHALLENGE, likeDislikeChallengeData);
      // console.log(challengeData)
      return data;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  },
);
const challengeSlice = createSlice({
  name: 'challenge',
  initialState,
  reducers: {
    setSuccess: () => initialState,
    setAllChallenges: (state, {payload}) => {
      state.allChallenges = payload;
    },
  },
  extraReducers: {
    [postChallengesApiHandler.pending]: state => {
      state.isLoading = true;
    },
    [postChallengesApiHandler.fulfilled]: state => {
      state.isLoading = false;
      state.success = true;
    },
    [postChallengesApiHandler.rejected]: state => {
      state.isLoading = false;
      state.invalid = true;
    },
    [likeDislikeChallenges.pending]: state => {
      // state.isLoading = true;
    },
    [likeDislikeChallenges.fulfilled]: state => {
      // state.isLoading = false;
      // state.success = true
    },
    [likeDislikeChallenges.rejected]: state => {
      // state.isLoading = false;
      // state.invalid = true;
    },
  },
});

export const {setSuccess, setAllChallenges} = challengeSlice.actions;
export default challengeSlice.reducer;
