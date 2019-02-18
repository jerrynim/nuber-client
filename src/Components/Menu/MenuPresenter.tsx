import React from "react";
import { Link } from "react-router-dom";
import styled from "../../typed-components";
import { userProfile, userProfile_GetMyProfile } from "../../types/api";

const Container = styled.div`
  height: 100%;
`;

const Header = styled.div`
  background-color: black;
  height: 20%;
  margin-bottom: 30px;
  padding: 0 15px;
  color: white;
`;

const SLink = styled(Link)`
  font-size: 22px;
  display: block;
  margin-left: 15px;
  margin-bottom: 25px;
  font-weight: 400;
`;

const Image = styled.img`
  height: 80px;
  width: 80px;
  background-color: grey;
  border-radius: 40px;
  overflow: hidden;
`;

const Name = styled.h2`
  font-size: 22px;
  color: white;
  margin-bottom: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Rating = styled.h5`
  font-size: 18px;
  color: white;
`;

const Text = styled.span`
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  grid-gap: 10px;
  height: 100%;
  align-items: center;
`;

const ToggleDriving = styled<any>("button")`
  -webkit-appearance: none;
  background-color: ${(props) =>
    props.isDriving ? props.theme.yellowColor : props.theme.greenColor};
  width: 100%;
  color: white;
  font-size: 18px;
  border: 0;
  padding: 15px 0px;
  cursor: pointer;
`;

interface IProps {
  data?: userProfile | undefined;
  loading: boolean;
}

const MenuPresenter: React.SFC<IProps> = (data, loading) => {
  const GetMyProfile = data.data;
  if (GetMyProfile) {
    const response: userProfile_GetMyProfile = GetMyProfile.GetMyProfile;
    if (response && response.ok && response.user) {
      const user = response.user;
      return (
        <Container>
          <Header>
            <Grid>
              <Link to={"/edit-account"}>
                <Image
                  src={
                    user.profilePhoto ||
                    "https://yt3.ggpht.com/-CTwXMuZRaWw/AAAAAAAAAAI/AAAAAAAAAAA/HTJy-KJ4F2c/s88-c-k-no-mo-rj-c0xffffff/photo.jpg"
                  }
                />
              </Link>
              <Text>
                <Name>{user.fullName}</Name>
                <Rating>4.5</Rating>
              </Text>
            </Grid>
          </Header>
          <SLink to="/trips">Your Trips</SLink>
          <SLink to="/settings">Settings</SLink>
          <ToggleDriving isDriving={user.isDriving}>
            {user.isDriving ? "Stop driving" : "Start driving"}
          </ToggleDriving>
        </Container>
      );
    } else {
      return <div>can't load</div>;
    }
  } else {
    return <div>can't load</div>;
  }
};

export default MenuPresenter;
