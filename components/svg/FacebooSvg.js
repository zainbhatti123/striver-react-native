import React from 'react'
import Svg, { Path } from 'react-native-svg'
/* SVGR has dropped some elements not supported by react-native-svg: title */

const FacebookSvg = (props) => (
    <Svg
      width={12}
      height={24}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M7.434 23.863V12.056h3.307l.438-4.156H7.434l.005-2.08c0-1.083.103-1.664 1.65-1.664h2.067V0H7.848C3.875 0 2.477 2.016 2.477 5.406v2.495H0v4.156h2.477v11.638a15.161 15.161 0 0 0 4.957.168Z"
        fill="#fff"
      />
    </Svg>
  )

export default FacebookSvg