import { GoogleApiWrapper } from "google-maps-react";
import { MAPS_KEY } from "../../keys";
import FindAdressContainer from "./FindAddressContainer";
export default GoogleApiWrapper({
  apiKey: MAPS_KEY
})(FindAdressContainer);
