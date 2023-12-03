import React from 'react';
import Svg, {Path} from 'react-native-svg';
/* SVGR has dropped some elements not supported by react-native-svg: title */

const MoreSvg = props => (
  <Svg
    width={18}
    height={4}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path
      d="M16 2V4C17.1046 4 18 3.10457 18 2H16ZM16 2H14C14 3.10457 14.8954 4 16 4V2ZM16 2V0C14.8954 0 14 0.89543 14 2H16ZM16 2H18C18 0.89543 17.1046 0 16 0V2ZM9 2V4C10.1046 4 11 3.10457 11 2H9ZM9 2H7C7 3.10457 7.89543 4 9 4V2ZM9 2V0C7.89543 0 7 0.89543 7 2H9ZM9 2H11C11 0.89543 10.1046 0 9 0V2ZM2 2V4C3.10457 4 4 3.10457 4 2H2ZM2 2H0C0 3.10457 0.89543 4 2 4V2ZM2 2V0C0.89543 0 0 0.89543 0 2H2ZM2 2H4C4 0.89543 3.10457 0 2 0V2Z"
      fill="white"
    />
  </Svg>
);

export default MoreSvg;
