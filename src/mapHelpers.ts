import axios from "axios";
import { toast } from "react-toastify";
import { MAPS_KEY } from "./keys";

export const geoCode = async (address: string) => {
  const URL = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${MAPS_KEY}`;
  const { data } = await axios(URL);
  if (!data.error_message) {
    const { results } = data;
    const firstPlace = results[0];
    const {
      formatted_address,
      geometry: {
        location: { lat, lng }
      }
    } = firstPlace;
    return { formatted_address, lat, lng };
  } else {
    toast.error(data.error_message);
    return false;
  }
};
/*
  console.log(data);
{results: Array(1), status: "OK"}
results: Array(1)
0:
address_components: (8) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}]
formatted_address: "Champ de Mars, 5 Avenue Anatole France, 75007 Paris, 프랑스"
geometry: {location: {…}, location_type: "ROOFTOP", viewport: {…}}
partial_match: true
place_id: "ChIJLU7jZClu5kcR4PcOOO6p3I0"
plus_code: {compound_code: "V75V+8Q 프랑스 파리", global_code: "8FW4V75V+8Q"}
types: (3) ["establishment", "point_of_interest", "premise"]
*/
export const reverseGeoCode = async (lat: number, lng: number) => {
  const URL = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${MAPS_KEY}`;
  const { data } = await axios(URL);
  if (!data.error_message) {
    const { results } = data;
    const firstPlace = results[0];
    const address = firstPlace.formatted_address;
    return address;
  } else {
    toast.error(data.error_message);
  }
};
/*
 console.log(status, data);
 {plus_code: {…}, results: Array(7), status: "OK"}
plus_code: {compound_code: "PQHH+FQ 대한민국 경기도 파주시", global_code: "8Q98PQHH+FQ"}
results: Array(7)
0:
address_components: (6) [{…}, {…}, {…}, {…}, {…}, {…}]
formatted_address: "대한민국 경기도 파주시 상지석동 1696"
geometry: {location: {…}, location_type: "ROOFTOP", viewport: {…}}
place_id: "ChIJzcjKAx2OfDURqGgzjUPMUmI"
plus_code: {compound_code: "PQHH+GQ 대한민국 경기도 파주시", global_code: "8Q98PQHH+GQ"}
types: ["street_address"]
 */
