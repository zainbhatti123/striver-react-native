import styled from 'styled-components';
import {theme} from '../../../theme';

export const OnBoardingText = styled.Text`
  ${props =>
    props.fontSize
      ? `
font-size: ${props.fontSize};
margin-bottom: 10px;
`
      : `
font-size: 22px;
margin-bottom: 0px;
`}
  color: #fff;
  text-transform: uppercase;
  line-height: 24px;
  font-family: ${theme.fonts.gLight.fontFamily};
  position: relative;
`;
