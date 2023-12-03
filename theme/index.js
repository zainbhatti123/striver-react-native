import {configureFonts, DefaultTheme} from 'react-native-paper';

const fontConfig = {
  ios: {
    regular: {
      fontFamily: 'Poppins-Regular',
      fontWeight: 'normal',
    },
    medium: {
      fontFamily: 'Poppins-Medium',
      fontWeight: 'normal',
    },
    light: {
      fontFamily: 'Poppins-Light',
      fontWeight: 'normal',
    },
    thin: {
      fontFamily: 'Poppins-Thin',
      fontWeight: 'normal',
    },
    bold: {
      fontFamily: 'Poppins-Bold',
      fontWeight: 'normal'
    },
    gThin: {
      fontFamily: 'VVE-Giallo-Thin',
    },
    gLight: {
      fontFamily: 'VVE-Giallo-Light'
    },
    gBold: {
      fontFamily: 'VVE-Giallo-Bold'
    },
    lineBold: {
      fontFamily: 'VisiaPro-BoldOutline'
    },
    lineRegular: {
      fontFamily: 'VisiaPro-RegularOutline'
    },
  },
  android: {
    regular: {
      fontFamily: 'Poppins-Regular',
      fontWeight: 'normal',
    },
    medium: {
      fontFamily: 'Poppins-Medium',
      fontWeight: 'normal',
    },
    light: {
      fontFamily: 'Poppins-Light',
      fontWeight: 'normal',
    },
    thin: {
      fontFamily: 'Poppins-Thin',
      fontWeight: 'normal',
    },
    bold: {
      fontFamily: 'Poppins-Bold',
      fontWeight: 'normal'
    },
    gThin: {
      fontFamily: 'VVE-Giallo-Thin',
    },
    gLight: {
      fontFamily: 'VVE-Giallo-Light',
    },
    gBold: {
      fontFamily: 'VVE-Giallo-Bold'
    },
    lineBold: {
      fontFamily: 'VisiaPro-BoldOutline'
    },
    lineRegular: {
      fontFamily: 'VisiaPro-RegularOutline'
    },
  },
};

export const theme = {
  ...DefaultTheme,
  fonts: configureFonts(fontConfig),
  colors: {
    ...DefaultTheme.colors,
    primary: '#6BB8FF',
    secondary: '#414757',
    error: '#f13a59',
    grey: '#9E9E9E',
    white: '#FFFFFF',
  },
};
