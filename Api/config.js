import {BASE_URL} from '@env';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HttpClient = axios.create({
  baseURL: BASE_URL,
});

// const getData = async () => {
//   let data = await AsyncStorage.getItem('userData');
//   if (data != null) {
//     let formatedData = JSON.parse(data);
//     return formatedData.accessToken;
//   }
// };

// Request interceptors
HttpClient.interceptors.request.use(
  async req => {
    let token = await AsyncStorage.getItem('token');

    if (token != null) {
      req.headers.Authorization = `Bearer ${JSON.parse(token)}`;
    }
    /** In dev, intercepts request and logs it into console for dev */

    // if ('ok') HttpClient.defaults.common.Authorization = `Bearer {Token}`;
    console.log('req ->>>>', req);
    return req;
  },
  error => {
    // if ('no') {
    //   console.error('✉️ ', error);
    // }
    return Promise.reject(error);
  },
);

// Response interceptors
HttpClient.interceptors.response.use(
  res => {
    if (res.status === 401) {
      console.log('You are not authorized!!');
    }
    console.log('response ---------> ', res);
    return res;
  },
  error => {
    console.log(error.response);
    if (error.response && error.response.data) {
      return Promise.reject(error.response.data, '<----------');
    }
    return Promise.reject(error.message, '<----------');
  },
);

export {HttpClient};
