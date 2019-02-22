import React from "react";
import { Mutation } from "react-apollo";
import { GET_PLACES } from "../../sharedQueries.queries";
import { editPlace, editPlaceVariables } from "../../types/api";
import PlacePresenter from "./PlacePresenter";
import { EDIT_PLACE } from "./PlaceQueries.queries";

interface IProps {
  fav: boolean;
  placeName: string;
  address: string;
  placeId: number;
}

class FavMutation extends Mutation<editPlace, editPlaceVariables> {}

class PlaceContainer extends React.Component<IProps> {
  public render() {
    const { placeId, fav, placeName, address } = this.props;
    return (
      <FavMutation
        mutation={EDIT_PLACE}
        variables={{
          id: placeId,
          isFav: !fav,
          name: placeName
        }}
        refetchQueries={[{ query: GET_PLACES }]}
      >
        {(editPlaceFn) => (
          <PlacePresenter
            onStarPress={editPlaceFn}
            fav={fav}
            name={name}
            address={address}
          />
        )}
      </FavMutation>
    );
  }
}

export default PlaceContainer;
