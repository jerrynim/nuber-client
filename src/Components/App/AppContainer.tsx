import React from "react";
import { graphql } from "react-apollo";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import theme from "../../theme";
import { ThemeProvider } from "../../typed-components";
import AppPresenter from "./AppPresenter";
import { IS_LOGGED_IN } from "./AppQueries";

/* data 는 쿼리로 부터의 데이터  */
/*data = {"variables":{},"loading":false,"networkStatus":7,"auth":{"isLoggedIn":false,"__typename":"Auth"}} */
// tslint:disable-next-line
const AppContainer = ({ data }) => (
  <React.Fragment>
    <ThemeProvider theme={theme}>
      <AppPresenter isLoggedIn={data.auth.isLoggedIn} />
    </ThemeProvider>
    <ToastContainer draggable={true} position={"bottom-center"} />
  </React.Fragment>
);
export default graphql(IS_LOGGED_IN)(AppContainer);
