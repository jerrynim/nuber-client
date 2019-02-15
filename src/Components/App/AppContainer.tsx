import React from "react";
import { graphql } from "react-apollo";
import { IS_LOGGED_IN } from "./AppQueries";

/* data 는 쿼리로 부터의 데이터 */
const AppContainer = ({ data }) => <div>{JSON.stringify(data)}</div>;

export default graphql(IS_LOGGED_IN)(AppContainer);
