import React from 'react';
import Svg, {Path} from 'react-native-svg';
/* SVGR has dropped some elements not supported by react-native-svg: title */

const DownloadSvg = props => (
  <Svg
    width="100%"
    height="100%"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path
      d="M15.1111 11.6667V14.3333C15.1111 15.3152 14.3152 16.1111 13.3334 16.1111H2.66669C1.68485 16.1111 0.888916 15.3152 0.888916 14.3333L0.888916 11.6667M4.44447 8.11111L8.00003 11.6667M8.00003 11.6667L11.5556 8.11111M8.00003 11.6667V1"
      stroke="white"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </Svg>
);

export default DownloadSvg;
