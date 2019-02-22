import React from "react";
import ReactDOM from "react-dom";
import FindeAddressPresenter from "./FindAddressPresenter";

class FindAddressContainer extends React.Component<any> {
  public mapRef: any;
  public map: google.maps.Map;
  constructor(props) {
    super(props);
    this.mapRef = React.createRef();
  }

  public componentDidMount() {
    const { google } = this.props;
    const maps = google.maps;
    const mapNode = ReactDOM.findDOMNode(this.mapRef.current);
    const mapConfig: google.maps.MapOptions = {
      center: {
        lat: 37.566536,
        lng: 126.977966
      },
      disableDefaultUI: true,
      zoom: 11
    };

    this.map = new maps.Map(mapNode, mapConfig);
  }
  public render() {
    return <FindeAddressPresenter mapRef={this.mapRef} />;
  }
}
export default FindAddressContainer;
