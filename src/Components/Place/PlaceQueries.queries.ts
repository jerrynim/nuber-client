import { gql } from "apollo-boost";

export const EDIT_PLACE = gql`
  mutation editPlace($id: Int!, $name: String, $isFav: Boolean) {
    EditPlace(id: $id, name: $name, isFav: $isFav) {
      ok
      error
    }
  }
`;
