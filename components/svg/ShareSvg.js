import React from 'react';
import Svg, {Path} from 'react-native-svg';
/* SVGR has dropped some elements not supported by react-native-svg: title */

const ShareSvg = props => (
  <Svg
    width="100%"
    height="100%"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path
      d="M16.25 3.55534C16.25 4.61388 15.3919 5.47201 14.3333 5.47201V6.97201C16.2203 6.97201 17.75 5.44231 17.75 3.55534H16.25ZM14.3333 5.47201C13.2748 5.47201 12.4167 4.61388 12.4167 3.55534H10.9167C10.9167 5.44231 12.4464 6.97201 14.3333 6.97201V5.47201ZM12.4167 3.55534C12.4167 2.49679 13.2748 1.63867 14.3333 1.63867V0.138672C12.4464 0.138672 10.9167 1.66837 10.9167 3.55534H12.4167ZM14.3333 1.63867C15.3919 1.63867 16.25 2.49679 16.25 3.55534H17.75C17.75 1.66837 16.2203 0.138672 14.3333 0.138672V1.63867ZM6.38821 8.36641L12.2798 5.4206L11.609 4.07896L5.71739 7.02477L6.38821 8.36641ZM5.58333 8.88867C5.58333 9.94722 4.72521 10.8053 3.66667 10.8053V12.3053C5.55364 12.3053 7.08333 10.7756 7.08333 8.88867H5.58333ZM3.66667 10.8053C2.60812 10.8053 1.75 9.94722 1.75 8.88867H0.25C0.25 10.7756 1.77969 12.3053 3.66667 12.3053V10.8053ZM1.75 8.88867C1.75 7.83013 2.60812 6.97201 3.66667 6.97201V5.47201C1.77969 5.47201 0.25 7.0017 0.25 8.88867H1.75ZM3.66667 6.97201C4.72521 6.97201 5.58333 7.83013 5.58333 8.88867H7.08333C7.08333 7.0017 5.55364 5.47201 3.66667 5.47201V6.97201ZM12.2826 12.3582L6.39657 9.41512L5.72575 10.7568L11.6118 13.6998L12.2826 12.3582ZM16.25 14.222C16.25 15.2806 15.3919 16.1387 14.3333 16.1387V17.6387C16.2203 17.6387 17.75 16.109 17.75 14.222H16.25ZM14.3333 16.1387C13.2748 16.1387 12.4167 15.2806 12.4167 14.222H10.9167C10.9167 16.109 12.4464 17.6387 14.3333 17.6387V16.1387ZM12.4167 14.222C12.4167 13.1635 13.2748 12.3053 14.3333 12.3053V10.8053C12.4464 10.8053 10.9167 12.335 10.9167 14.222H12.4167ZM14.3333 12.3053C15.3919 12.3053 16.25 13.1635 16.25 14.222H17.75C17.75 12.335 16.2203 10.8053 14.3333 10.8053V12.3053Z"
      fill="white"
    />
  </Svg>
);

export default ShareSvg;
