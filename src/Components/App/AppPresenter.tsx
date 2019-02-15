import React from "react";

interface IProps {
  isLoggedIn: boolean;
}
/*SFC= stateless Function Component */
const AppPresenter: React.SFC<IProps> = ({ isLoggedIn }) =>
  isLoggedIn ? <span>you are in</span> : <span>your are out</span>;

export default AppPresenter;
