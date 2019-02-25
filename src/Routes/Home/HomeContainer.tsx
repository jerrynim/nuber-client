import React from "react";
import { graphql, Mutation, MutationFn, Query } from "react-apollo";
import ReactDOM from "react-dom";
import { RouteComponentProps } from "react-router";
import { toast } from "react-toastify";
import { geoCode } from "../../mapHelpers";
import { USER_PROFILE } from "../../sharedQueries.queries";
import {
  reportMovement,
  reportMovementVariables,
  requestRide,
  requestRideVariables,
  userProfile
} from "../../types/api";
import HomePresenter from "./HomePresenter";
import { REPORT_LOCATION, REQUEST_RIDE } from "./HomeQueries.queries";

interface IState {
  isMenuOpen: boolean;
  lat: number;
  lng: number;
  toAddress: string;
  toLat: number;
  toLng: number;
  distance?: string;
  duration?: string;
  price?: number;
  fromAddress: string;
}

interface IProps extends RouteComponentProps<any> {
  google: any;
  reportLocation: MutationFn;
}

class RequsetRideMutation extends Mutation<requestRide, requestRideVariables> {}

class ProfileQuery extends Query<userProfile> {}

class HomeContainer extends React.Component<IProps, IState> {
  public mapRef: any;
  public map: google.maps.Map;
  public userMarker: google.maps.Marker;
  public toMarker: google.maps.Marker;
  public directions: google.maps.DirectionsRenderer;
  public state = {
    distance: "",
    duration: "",
    fromAddress: "",
    isMenuOpen: false,
    lat: 0,
    lng: 0,
    price: 0,
    toAddress: "",
    toLat: 0,
    toLng: 0
  };
  constructor(props) {
    super(props);
    this.mapRef = React.createRef();
  }
  public componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      this.handleGeoSucces,
      this.handleGeoError
    );
  }

  public handleGeoSucces: PositionCallback = (position: Position) => {
    const {
      coords: { latitude, longitude }
    } = position;
    this.setState({
      lat: latitude,
      lng: longitude
    });
    this.loadMap(latitude, longitude);
  };
  public handleGeoError: PositionErrorCallback = () => {
    console.log("No location");
  };
  public loadMap = (lat, lng) => {
    const { google } = this.props;
    const maps = google.maps;
    const mapNode = ReactDOM.findDOMNode(this.mapRef.current);
    const mapConfig: google.maps.MapOptions = {
      center: {
        lat,
        lng
      },
      disableDefaultUI: true,
      minZoom: 8,
      zoom: 13
    };
    this.map = new maps.Map(mapNode, mapConfig);
    const userMarkerOptions: google.maps.MarkerOptions = {
      icon: {
        path: maps.SymbolPath.CIRCLE,
        scale: 7
      },
      position: {
        lat,
        lng
      }
    };
    this.userMarker = new maps.Marker(userMarkerOptions);
    this.userMarker.setMap(this.map);
    const watchOptions: PositionOptions = {
      enableHighAccuracy: true
    };
    navigator.geolocation.watchPosition(
      this.handleGeoWatchSuccess,
      this.handleGeoWatchError,
      watchOptions
    );
  };
  public handleGeoWatchSuccess = (position: Position) => {
    const { reportLocation } = this.props;
    const {
      coords: { latitude, longitude }
    } = position;
    this.userMarker.setPosition({ lat: latitude, lng: longitude });
    this.map.panTo({ lat: latitude, lng: longitude });
    /*Mutaion 실행 HOC의 */
    reportLocation({
      variables: {
        lat: parseFloat(latitude.toFixed(10)),
        lng: parseFloat(longitude.toFixed(10))
      }
    });
  };
  public handleGeoWatchError = () => {
    console.log("Error watching you");
  };

  public render() {
    const {
      isMenuOpen,
      toAddress,
      price,
      distance,
      fromAddress,
      lat,
      lng,
      toLat,
      toLng,
      duration
    } = this.state;
    return (
      <ProfileQuery query={USER_PROFILE}>
        {({ data, loading }) => (
          <RequsetRideMutation
            mutation={REQUEST_RIDE}
            variables={{
              distance,
              dropOffAddress: toAddress,
              dropOffLat: toLat,
              dropOffLng: toLng,
              duration: duration || "",
              pickUpAddress: fromAddress,
              pickUpLat: lat,
              pickUpLng: lng,
              price
            }}
          >
            {(requestRideFn) => (
              <HomePresenter
                isMenuOpen={isMenuOpen}
                toggleMenu={this.toggleMenu}
                mapRef={this.mapRef}
                loading={loading}
                toAddress={toAddress}
                price={price}
                onInputChange={this.onInputChange}
                onAddressSubmit={this.onAddressSubmit}
                requestRideFn={requestRideFn}
              />
            )}
          </RequsetRideMutation>
        )}
      </ProfileQuery>
    );
  }

  public toggleMenu = () => {
    this.setState((state) => {
      return {
        isMenuOpen: !state.isMenuOpen
      };
    });
  };

  public onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value }
    } = event;
    this.setState({
      [name]: value
    } as any);
  };

  public onAddressSubmit = async () => {
    const { toAddress } = this.state;
    const { google } = this.props;
    const maps = google.maps;
    const result = await geoCode(toAddress);
    if (result !== false) {
      const { lat, lng, formatted_address: formatedAddress } = result;
      this.setState({
        toAddress: formatedAddress,
        toLat: lat,
        toLng: lng
      });
      if (this.toMarker) {
        this.toMarker.setMap(null);
      }
      const toMarkerOptions: google.maps.MarkerOptions = {
        position: {
          lat,
          lng
        }
      };
      this.toMarker = new maps.Marker(toMarkerOptions);
      this.toMarker.setMap(this.map);
      const bounds = new maps.LatLngBounds();
      bounds.extend({ lat, lng });
      /*목적지 확장 */
      bounds.extend({ lat: this.state.lat, lng: this.state.lng });
      /*유저의 위치 확장 */
      this.map.fitBounds(bounds);
      this.setState(
        {
          toAddress: formatedAddress,
          toLat: lat,
          toLng: lng
        },
        this.createPath
      );
    }
  };

  public createPath = () => {
    const { toLat, toLng, lat, lng } = this.state;
    if (this.directions) {
      this.directions.setMap(null);
    }
    const renderOptions: google.maps.DirectionsRendererOptions = {
      polylineOptions: {
        strokeColor: "#000"
      },
      suppressMarkers: true
    };
    this.directions = new google.maps.DirectionsRenderer(renderOptions);
    const directionService: google.maps.DirectionsService = new google.maps.DirectionsService();
    const to = new google.maps.LatLng(toLat, toLng);
    const from = new google.maps.LatLng(lat, lng);
    const directionsOptions: google.maps.DirectionsRequest = {
      destination: to,
      origin: from,
      travelMode: google.maps.TravelMode.TRANSIT
    };
    directionService.route(directionsOptions, this.handleRouteRequest);
  };

  public handleRouteRequest = (
    result: google.maps.DirectionsResult,
    status: google.maps.DirectionsStatus
  ) => {
    if (status === google.maps.DirectionsStatus.OK) {
      const { routes } = result;
      const {
        distance: { text: distance },
        duration: { text: duration }
      } = routes[0].legs[0];
      this.setState(
        {
          distance,
          duration
        },
        this.setPrice
      );
      this.directions.setDirections(result);
      this.directions.setMap(this.map);
    } else {
      toast.error("Therie is no route");
    }

    /*
        OK 
        {geocoded_waypoints: Array(2), routes: Array(1), status: "OK", request: {…}}
        geocoded_waypoints: (2) [{…}, {…}]
        request: {destination: {…}, origin: {…}, travelMode: "TRANSIT"}
        routes: Array(1)
        0:
        bounds: _.R {ma: od, ga: kd}
        copyrights: "Map data ©2019 SK telecom"
        legs: Array(1)
        0:
        arrival_time: {text: "10:03pm", time_zone: "Asia/Seoul", value: Sun Feb 24 2019 22:03:08 GMT+0900 (한국 표준시)}
        departure_time: {text: "9:18pm", time_zone: "Asia/Seoul", value: Sun Feb 24 2019 21:18:00 GMT+0900 (한국 표준시)}
        distance: {text: "14.1 km", value: 14070}
        duration: {text: "45 mins", value: 2708}
        end_address: "90, Pilun-dong, Jongno-gu, 서울특별시 South Korea"
        end_location: _.Q {lat: ƒ, lng: ƒ}
        start_address: "629-2 Gongneung-dong, Nowon-gu, Seoul, South Korea"
      */
  };

  public setPrice = () => {
    const { distance } = this.state;
    if (distance) {
      this.setState({
        price: Number(
          Number(parseFloat(distance.replace(",", "")) * 3).toFixed(2)
        )
      });
    }
  };
}

export default graphql<any, reportMovement, reportMovementVariables>(
  REPORT_LOCATION,
  {
    name: "reportLocation"
  }
)(HomeContainer);
