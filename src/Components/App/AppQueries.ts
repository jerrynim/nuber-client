import { gql } from "apollo-boost";
/* @client로 API에 보내지않고 캐쉬에 보낸다 */
export const IS_LOGGED_IN = gql`
  {
    auth {
      isLoggedIn @client
    }
  }
`;
