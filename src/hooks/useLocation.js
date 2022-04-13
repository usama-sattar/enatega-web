/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import Geocode from "react-geocode";
import { usePosition } from "use-position";
import { GOOGLE_MAPS_KEY } from "../config/constants";
export default function useLocation() {
  Geocode.setApiKey(GOOGLE_MAPS_KEY);
  Geocode.setLanguage("en");
  Geocode.enableDebug(false);
  const [permissionError, setPermissionError] = useState("");
  const { latitude, longitude, errorMessage: error } = usePosition(true);
  const [loc, setLoc] = useState();

  useEffect(() => {
    //console.log('error in useEffect', error)
    setPermissionError("");
    if ("geolocation" in navigator) {
      (async () => {
        await getAddress();
      })();
    }
     else {
      setPermissionError("Permission is not granted");
    }
  }, [latitude, error]);

  const geocodingLocation = async (lat, lng, setFunction) => {
    try {
      const locationName = await Geocode.fromLatLng(lat, lng);
      //console.log(locationName.results[0].formatted_address);
      return locationName.results[0].formatted_address;
    } catch (e) {
      console.error(error);
      return null;
    }
  };

  const getAddress = async () => {
    if (!latitude) {
      setPermissionError("Invalid Location");
      return;
    }
    const locationName = await geocodingLocation(latitude, longitude);
    if (locationName)
      setLoc({
        label: "Home",
        latitude: latitude,
        longitude: longitude,
        deliveryAddress: locationName,
      });
  };
  return {
    loading: !!error || !!permissionError ? false : !!loc ? false : true,
    error: error || permissionError,
    loc: loc,
    updateError: setPermissionError,
    geoCodeCoordinates: geocodingLocation,
  };
}
