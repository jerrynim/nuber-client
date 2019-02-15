import reset from "styled-reset";
import { createGlobalStyle } from "./typed-components";
import Typography from "./typography";
// tslint:disable-next-line
const GlobalStyle = createGlobalStyle`
  ${reset};
  ${Typography};
  * {
      box-sizing: border-box;
  }
  body{
  }
  a{ 
      color:inherit;
      text-decoration:none;
  }
  input,
  button{
      &:focus,
      &:active{outline:none}
  }
`;
export default GlobalStyle;
