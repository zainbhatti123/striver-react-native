import React from 'react';
import Svg, {Path} from 'react-native-svg';
/* SVGR has dropped some elements not supported by react-native-svg: title */

const BigPlaySvg = props => (
  <Svg
    width={12}
    height={14}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path
      d="M0.25 13C0.25 13.4142 0.585786 13.75 1 13.75C1.41421 13.75 1.75 13.4142 1.75 13H0.25ZM1 1L1.38587 0.35688C1.15417 0.217861 0.865607 0.214221 0.630476 0.34735C0.395344 0.480479 0.25 0.729796 0.25 1L1 1ZM11 7L11.3859 7.64312C11.6118 7.50758 11.75 7.26345 11.75 7C11.75 6.73655 11.6118 6.49242 11.3859 6.35688L11 7ZM3.94746 10.3569C3.59228 10.57 3.4771 11.0307 3.69021 11.3859C3.90332 11.7411 4.36402 11.8562 4.71921 11.6431L3.94746 10.3569ZM1.75 13V1H0.25V13H1.75ZM0.614128 1.64312L10.6141 7.64312L11.3859 6.35688L1.38587 0.35688L0.614128 1.64312ZM10.6141 6.35688L3.94746 10.3569L4.71921 11.6431L11.3859 7.64312L10.6141 6.35688Z"
      fill="white"
    />
  </Svg>
);

export default BigPlaySvg;
