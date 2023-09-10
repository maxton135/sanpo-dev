const getDistanceBetween = (place1, place2) => {
  const lat1 = place1.location.lat;
  const lng1 = place1.location.lng;
  const lat2 = place2.location.lat;
  const lng2 = place2.location.lng;

  const earthRadiusKm = 6371; // Radius of the Earth in kilometers
  const kmToMiles = 0.621371; // Conversion factor from kilometers to miles

  const degToRad = (degrees) => {
    return degrees * (Math.PI / 180);
  };

  const deltaLat = degToRad(lat2 - lat1);
  const deltaLng = degToRad(lng2 - lng1);

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(degToRad(lat1)) *
      Math.cos(degToRad(lat2)) *
      Math.sin(deltaLng / 2) *
      Math.sin(deltaLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distanceKm = earthRadiusKm * c;
  const distanceMiles = distanceKm * kmToMiles;

  return distanceMiles;
};

export const createSuggestionsList = (
  placesData,
  yelpData,
  pattern,
  keywords,
  currentLocation
) => {
  let suggestions = [];
  const suggestionRecursion = (
    i,
    suggestion,
    usedIDs,
    prevPlace,
    totalDistance
  ) => {
    if (i == pattern.length) {
      suggestions.push({
        places: suggestion,
        totalDistance:
          totalDistance + getDistanceBetween(prevPlace, currentLocation),
      });
      return;
    }
    const letter = pattern[i];
    const keyword = keywords[i];
    if (letter == "W") {
      // places data arrays are sorted by distance already
      // so use first two places in array
      const places = placesData[keyword];
      for (const place of places) {
        if (!usedIDs.includes(place.id)) {
          suggestionRecursion(
            i + 1,
            [...suggestion, place],
            [...usedIDs, place.id],
            place,
            totalDistance + getDistanceBetween(prevPlace, place)
          );
        }
      }
    } else if (letter == "F") {
      const places = yelpData[keyword];
      for (const place of places) {
        if (!usedIDs.includes(place.id)) {
          suggestionRecursion(
            i + 1,
            [...suggestion, place],
            [...usedIDs, place.id],
            place,
            totalDistance + getDistanceBetween(prevPlace, place)
          );
        }
      }
    }
  };
  suggestionRecursion(0, [], [], currentLocation, 0);
  return suggestions;
};

export const filterByDistance = (suggestions, threshold, desiredDistance) => {
  let filteredSuggestions = [];
  suggestions.forEach((suggestion) => {
    const totalDistance = suggestion.totalDistance;
    if (
      Math.abs(desiredDistance - totalDistance) <
      desiredDistance * threshold
    ) {
      filteredSuggestions.push(suggestion);
    }
  });

  function compare(a, b) {
    const aDistance = Math.abs(desiredDistance - a.totalDistance);
    const bDistance = Math.abs(desiredDistance - b.totalDistance);
    if (aDistance < bDistance) {
      return -1;
    }
    if (aDistance > bDistance) {
      return 1;
    }
    return 0;
  }
  filteredSuggestions.sort(compare);

  return filteredSuggestions;
};

const angleBetweenPlaces = (p1, p2, p3) => {
  // Calculate the angle between three points using the dot product
  const x1 = p1.location.lat;
  const y1 = p1.location.lng;
  const x2 = p2.location.lat;
  const y2 = p2.location.lng;
  const x3 = p3.location.lat;
  const y3 = p3.location.lng;

  const dx1 = x1 - x2;
  const dy1 = y1 - y2;
  const dx3 = x3 - x2;
  const dy3 = y3 - y2;

  const dotProduct = dx1 * dx3 + dy1 * dy3;
  const magnitudeProduct =
    Math.sqrt(dx1 ** 2 + dy1 ** 2) * Math.sqrt(dx3 ** 2 + dy3 ** 2);

  // Calculate the angle in radians
  const angleRadians = Math.acos(dotProduct / magnitudeProduct);

  // Convert the angle from radians to degrees
  const angleDegrees = (180 * angleRadians) / Math.PI;

  return angleDegrees;
};

export const filterByCircularity = (suggestions, origin) => {
  console.log("entered");
  let filteredSuggestions = [];
  // console.log("THE ORIGIN: ");
  // console.log(origin);

  // console.log("SUGGESTIONS: ");
  suggestions.forEach((suggestion) => {
    const sequence = [origin, ...suggestion.places]
    // console.log("SEQUENCE: ");
    // console.log(sequence);

    let isCircular = true;
    const stops = sequence.length;
    const desiredAngle = ((stops - 2) * 180) / stops;
    // console.log("# OF STOPS: ");
    // console.log(stops);
    // console.log("DESIRED ANGLE: ");
    // console.log(desiredAngle);
    
    for (let p1i = 0; p1i < stops; p1i++) {
      let p2i = (p1i + 1) % stops;
      let p3i = (p1i + 2) % stops;
      // console.log("POINT #", p1i);
      // console.log("P1I: ")
      // console.log(p1i)
      // console.log("P2I: ")
      // console.log(p2i)
      // console.log("P3I: ")
      // console.log(p3i)
      const angle = angleBetweenPlaces(sequence[p1i], sequence[p2i], sequence[p3i]);
      // console.log("ACTUAL ANGLE: ")
      // console.log(angle);
      // console.log("THRESHOLD: ");
      // console.log(angle * 0.5)
      if (Math.abs(desiredAngle - angle) > angle * 0.8) {
        // console.log("ANGLE DOES NOT MAKE THRESHOLD ;(((");
        isCircular = false;
        break;
      }
      // console.log("ANGLE MAKES THRESHOLD!")
    }
    // console.log("IS CIRCULAR: ")
    // console.log(isCircular)
    if (isCircular) {
      filteredSuggestions.push(suggestion);
    }
      // create an array [origin, p1, p2, p3]
      // need to calculate the following angles
      // o - 1 - 2
      // 1 - 2 - 3
      // 2 - 3 - o
      // 3 - o - 1
  })
  console.log("FILTERED SUGGS LENGTH: ");
  console.log(filteredSuggestions.length);
  return filteredSuggestions;
};
