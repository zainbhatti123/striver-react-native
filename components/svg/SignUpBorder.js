import React from 'react'
import Svg, { Circle,Rect } from 'react-native-svg'
/* SVGR has dropped some elements not supported by react-native-svg: title */

const SignUpBorder = (props) => (
    <Svg
      width={86}
      height={2}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Rect width={81} height={2} rx={1} fill="#fff" />
      <Circle cx={85} cy={1} r={1} fill="#fff" />
    </Svg>
  )

export default SignUpBorder