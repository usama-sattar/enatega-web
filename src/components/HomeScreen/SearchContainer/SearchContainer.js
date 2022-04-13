/* eslint-disable react-hooks/exhaustive-deps */
import {
  Button,
  Grid,
  InputAdornment,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Autocomplete from "@mui/material/Autocomplete";
import parse from "autosuggest-highlight/parse";
import throttle from "lodash/throttle";
import React, { useContext, useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import SyncLoader from "react-spinners/SyncLoader";
import LocationIcon from "../../../assets/icons/LocationIcon";
import { LocationContext } from "../../../context/Location";
import { useLocation } from "../../../hooks";
import FlashMessage from "../../FlashMessage";
import useStyle from "./styles";
// import { NavigateNextTwoTone } from "@mui/icons-material";

const autocompleteService = { current: null };

function SearchContainer() {
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("md"));
  const extraSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const classes = useStyle({ mobile, extraSmall });
  const [value, setValue] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState([]);
  const [latLng, setLatLng] = useState({});
  const [search, setSearch] = useState("");
  const { loading, loc, error, updateError } = useLocation();
  const [open, setOpen] = useState(!!error);
  const { setLocation } = useContext(LocationContext);
  const navigateTo = useNavigate();

  const fetch = React.useMemo(
    () =>
      throttle((request, callback) => {
        autocompleteService.current.getPlacePredictions(request, callback);
      }, 200),
    []
  );

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  useEffect(() => {
    let localStorageLocation = localStorage.getItem("location");
    if (localStorageLocation)
      localStorageLocation = JSON.parse(localStorageLocation).deliveryAddress;
    const deliveryAddress = loc?.deliveryAddress
      ? loc.deliveryAddress
      : localStorageLocation
      ? localStorageLocation
      : "Select Location";
    setSearch(deliveryAddress);
  }, [loc]);

  useEffect(() => {
    let active = true;

    if (!autocompleteService.current && window.google) {
      autocompleteService.current =
        new window.google.maps.places.AutocompleteService();
    }
    if (!autocompleteService.current) {
      return undefined;
    }

    if (inputValue === "") {
      setOptions(value ? [value] : []);
      return undefined;
    }

    fetch({ input: inputValue }, (results) => {
      if (active) {
        let newOptions = [];
        if (value) {
          newOptions = [value];
        }
        if (results) {
          newOptions = [...newOptions, ...results];
        }
        setOptions(newOptions);
      }
    });

    return () => {
      active = false;
    };
  }, [value, inputValue, fetch]);

  const changeLocation = (passedLocation) => {
    if (error) {
      setOpen(true);
      return;
    } else if (loading) {
      setOpen(true);
      updateError("Wait. your location is fetching");
      return;
    }
    const location =
      passedLocation.latitude &&
      passedLocation.longitude &&
      passedLocation.deliveryAddress
        ? passedLocation
        : loc;
    localStorage.setItem("location", JSON.stringify(location));
    setLocation(location);
    navigateTo("/restaurant-list");
  };

  return (
    <Grid container className={classes.mainContainer}>
      <FlashMessage
        severity={loading ? "info" : "error"}
        alertMessage={error}
        open={open}
        handleClose={handleClose}
      />

      <Grid item xs={12} className={classes.headingContainer}>
        <Grid item xs={1} md={1} />
        <Grid
          container
          item
          xs={10}
          sm={10}
          md={9}
          lg={7}
          className={classes.searchContainer}
        >
          <Grid item xs={12} sm={9}>
            <Autocomplete
              id="google-map-demo"
              getOptionLabel={(option) =>
                typeof option === "string" ? option : option.description
              }
              filterOptions={(x) => x}
              options={options}
              autoComplete
              includeInputInList
              filterSelectedOptions
              value={value ? value : search ?? "Loading ..."}
              onChange={(event, newValue) => {
                if (newValue) {
                  const b = new window.google.maps.Geocoder();
                  b.geocode({ placeId: newValue.place_id }, (res) => {
                    const location = res[0].geometry.location;
                    setSearch(res[0].formatted_address);
                    setLatLng({
                      lat: location.lat(),
                      lng: location.lng(),
                    });
                  });
                } else {
                  setSearch("");
                  setLatLng({});
                }
                setOptions(newValue ? [newValue, ...options] : options);
                setValue(newValue);
              }}
              onInputChange={(event, newInputValue) => {
                setInputValue(newInputValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  style={{ color: "initial" }}
                  variant="outlined"
                  label="Enter your full address"
                  fullWidth
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {params.InputProps.endAdornment}
                        <InputAdornment
                          position="end"
                          onClick={(e) => {
                            e.preventDefault();
                            setValue(search?.deliveryAddress ?? "");
                            setSearch(loc?.deliveryAddress ?? "");
                            setLatLng({
                              lat: loc?.latitude,
                              lng: loc?.longitude,
                            });
                          }}
                        >
                          {loading ? (
                            <SyncLoader
                              color={theme.palette.primary.main}
                              size={5}
                              speedMultiplier={0.7}
                              margin={1}
                            />
                          ) : (
                            <LocationIcon />
                          )}
                        </InputAdornment>
                      </>
                    ),
                  }}
                />
              )}
              renderOption={(props, option) => {
                const matches =
                  option.structured_formatting.main_text_matched_substrings;
                let parts = null;
                if (matches) {
                  parts = parse(
                    option.structured_formatting.main_text,
                    matches.map((match) => [
                      match.offset,
                      match.offset + match.length,
                    ])
                  );
                }

                return (
                  <Grid {...props} container alignItems="center">
                    <Grid item>
                      <LocationOnIcon className={classes.icon} />
                    </Grid>
                    <Grid item xs>
                      {parts &&
                        parts.map((part, index) => (
                          <span
                            key={index}
                            style={{
                              fontWeight: part.highlight ? 700 : 400,
                              color: "black",
                            }}
                          >
                            {part.text}
                          </span>
                        ))}

                      <Typography variant="body2" color="textSecondary">
                        {option.structured_formatting.secondary_text}
                      </Typography>
                    </Grid>
                  </Grid>
                );
              }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              disableElevation
              className={classes.button}
              onClick={(e) => {
                e.preventDefault();
                if (search) {
                  changeLocation({
                    label: "Home",
                    latitude: latLng.lat,
                    longitude: latLng.lng,
                    deliveryAddress: search,
                  });
                }
              }}
            >
              Find Restaurants
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default React.memo(SearchContainer);
