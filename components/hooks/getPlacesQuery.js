import 'react-native-get-random-values'
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { GOOGLE_MAPS_APIKEY, YELP_APIKEY } from "@env";
import { v4 as uuidv4 } from "uuid";

const placeKeywords = ["park", "beach", "pond", "lake", "trail"];

function filterGoogleAPIResponse(response) {
  let filtered = [];
  const places = response.data.results;
  for (const place of places) {
    filtered.push({
      id: uuidv4(),
      name: place.name,
      location: place.geometry.location, // in lat lng form
      rating: place.rating,
      img_obj: place.photos,
      types: place.types,
    });
  }
  return filtered;
}

const fetchGoogleAPI = async ({ queryKey }) => {
  let data = {};
  const [_, lat, lng] = queryKey;
  for (const keyword of placeKeywords) {
    const googlePlacesURL = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat}%2C${lng}&rankby=distance&keyword=${keyword}&key=${GOOGLE_MAPS_APIKEY}`;
    const response = await axios.get(googlePlacesURL);
    const filtered = filterGoogleAPIResponse(response);
    data[keyword] = filtered;
  }
  return data;
};

export const UseFetchPlacesData = (lat, lng) => {
  const { isLoading, data } = useQuery(
    ["fetchPlaces", lat, lng],
    fetchGoogleAPI
  );
  return { data, isLoading };
};
