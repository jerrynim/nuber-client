import React from "react";
import { Mutation, Query } from "react-apollo";
import { LOG_USER_OUT } from "../../sharedQueries.local";
import { GET_PLACES, USER_PROFILE } from "../../sharedQueries.queries";
import { getPlaces, userProfile } from "../../types/api";
import SettingsPresenter from "./SettingsPresenter";

class MiniProfileQuery extends Query<userProfile> {}

class PlacesQuery extends Query<getPlaces> {}
class SettingsContainer extends React.Component {
  public render() {
    return (
      <PlacesQuery query={GET_PLACES}>
        {({ data: placesData, loading: placesLoading }) => (
          <Mutation mutation={LOG_USER_OUT}>
            {(logUserOut) => (
              <MiniProfileQuery query={USER_PROFILE}>
                {({ data, loading: userDataLoading }) => (
                  <SettingsPresenter
                    userDataLoading={userDataLoading}
                    placesLoading={placesLoading}
                    userData={data}
                    placesData={placesData}
                    logUserOut={logUserOut}
                  />
                )}
              </MiniProfileQuery>
            )}
          </Mutation>
        )}
      </PlacesQuery>
    );
  }
}

export default SettingsContainer;
