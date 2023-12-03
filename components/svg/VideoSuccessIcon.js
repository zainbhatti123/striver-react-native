import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';
/* SVGR has dropped some elements not supported by react-native-svg: title */

const VideoSuccessIcon = props => (
    <Svg
        width="100%"
        height="100%"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}>
        <Circle opacity="0.1" cx="36" cy="36" r="36" fill="#6BB8FF" />
        <Path
            d="M21.9556 20.9583H25.8723M23.914 19V22.9167M36.6431 19L35.664 22.9167M49.3723 20.9583H53.289M51.3306 19V22.9167M43.4973 28.7917L41.539 30.75M49.3723 36.625L53.289 35.6458M49.3723 48.375H53.289M51.3306 46.4167V50.3333M41.539 43.5144L28.7746 30.75L20.1775 49.5108C20.0111 49.8751 19.9601 50.2815 20.0312 50.6755C20.1023 51.0696 20.2922 51.4325 20.5753 51.7156C20.8584 51.9988 21.2214 52.1886 21.6154 52.2597C22.0095 52.3308 22.4158 52.2798 22.7801 52.1135L41.539 43.5164V43.5144Z" stroke="#6BB8FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
        />
    </Svg>
);

export default VideoSuccessIcon;
