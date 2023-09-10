import 'react-native-get-random-values'
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { YELP_APIKEY } from "@env";
import { v4 as uuidv4 } from "uuid";

const foodKeywords = ["cafe", "lunch", "fastfood", "sandwich"];

function filterYelpAPIResponse(response) {
  let filtered = [];
  const businesses = response.data.businesses;
  for (const business of businesses) {
    filtered.push({
      id: uuidv4(),
      name: business.name,
      location: {
        lat: business.coordinates.latitude,
        lng: business.coordinates.longitude,
      },
      distance: business.distance,
      address: business.location,
      price: business.price,
      rating: business.rating,
      img_url: business.image_url,
      phone_number: business.display_phone,
      categories: business.categories,
    });
  }
  return filtered;
}

const fetchYelpAPI = async ({ queryKey }) => {
  let data = {};
  const [_, lat, lng] = queryKey;
  const yelpURL = "https://api.yelp.com/v3/businesses/search?";
  for (const keyword of foodKeywords) {
    const config = {
      headers: {
        Authorization: "Bearer " + YELP_APIKEY,
      },
      params: {
        latitude: lat,
        longitude: lng,
        term: keyword,
        categories: keyword,
        sort_by: "best_match",
        limit: "10",
      },
    };
    const response = await axios.get(yelpURL, config);
    const filtered = filterYelpAPIResponse(response);
    data[keyword] = filtered;
  }
  return data;
};

export const UseFetchYelpData = (lat, lng) => {
  const { isLoading, data } = useQuery(["fetchYelp", lat, lng], fetchYelpAPI);
  return { data, isLoading };
};
