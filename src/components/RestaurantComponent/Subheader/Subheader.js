/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  InputAdornment,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Autocomplete from '@mui/material/Autocomplete';
import parse from "autosuggest-highlight/parse";
import throttle from "lodash/throttle";
import React, { useContext, useEffect, useState } from "react";
import SyncLoader from "react-spinners/SyncLoader";
import LocationIcon from "../../../assets/icons/LocationIcon";
import RightIcon from "../../../assets/icons/RightIcon";
import { LocationContext } from "../../../context/Location";
import { useLocation } from "../../../hooks";
import FlashMessage from "../../FlashMessage";
import useStyles from "./styles";


const autocompleteService = { current: null };

function Subheader() {
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down('sm'));
  const spacingTop = mobile ? "56px" : "63px";
  const classes = useStyles();
  const [expand, setExpand] = useState(false);
  const [search, setSearch] = useState("");

  const { loading, loc } = useLocation();
  const { location, setLocation } = useContext(LocationContext);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [alertMessage, setAlertMessage] = useState();
  const [severity, setSeverity] = useState("success");

  const [value, setValue] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState([]);
  const [latLng, setLatLng] = useState({});

  const fetch = React.useMemo(
    () =>
      throttle((request, callback) => {
        autocompleteService.current.getPlacePredictions(request, callback);
      }, 200),
    [],
  );
  useEffect(() => {
    getAddress();
  }, []);

  const getAddress = async () => {
    try {
      setBusy(true);
      if (!location) {
        let localStorageLocation = await localStorage.getItem("location");
        localStorageLocation = JSON.parse(localStorageLocation);
        if (localStorageLocation) {
          setLocation(localStorageLocation);
          setLatLng(localStorageLocation);
          setSearch(localStorageLocation.deliveryAddress);
          setBusy(false);
        } else {
          setBusy(loading);
          setLocation(loc);
          setLatLng(loc);
        }
      } else {
        setSearch(location.deliveryAddress);
      }
    } catch (e) {
      setAlertMessage(e.message);
      setSeverity("error");
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    let active = true;

    if (!autocompleteService.current && window.google) {
      autocompleteService.current = new window.google.maps.places.AutocompleteService();
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

  const changeLocation = (loc) => {
    localStorage.setItem("location", JSON.stringify(loc));
    setLocation(loc);
  };

  return (
    <>
      {busy ? null : (
        <Box style={{ top: spacingTop }} className={`${classes.root} ${classes.shadow} ${classes.mainContainer}`}>
          <FlashMessage severity={severity} alertMessage={alertMessage} open={open} setOpen={setOpen} />
          <Grid container item>
            <Grid item className={classes.upperContainer}>
              <Button
                style={{ display: mobile ? "block" : "flex", textAlign: "inherit" }}
                onClick={() => setExpand(!expand)}
              >
                <Typography variant="body1" color="textSecondary" className={`${classes.smallText} ${classes.mr10}`}>
                  DELIVERING TO
                </Typography>
                <Box style={{ display: "flex", alignItems: "center" }}>
                  <Typography
                    variant="body1"
                    color="textSecondary"
                    className={`${classes.smallText} ${classes.mr10} ${classes.textBold}`}
                  >
                    {search}
                  </Typography>
                  {!expand ? <ExpandMoreIcon color="primary" /> : <ExpandLessIcon color="primary" />}
                </Box>
              </Button>
            </Grid>
          </Grid>
          <Divider light orientation="horizontal" />
          {expand && (
            <>
              <Box
                style={{
                  width: "100%",
                  padding: "20px 0px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Container style={{ display: "flex", marginLeft: "0px" }}>
                  <Autocomplete
                    style={{ width: "100%" }}
                    id="google-map-demo"
                    getOptionLabel={(option) => (typeof option === "string" ? option : option.description)}
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
                                  setSearch(loc?.deliveryAddress ?? "");
                                  setValue(loc?.deliveryAddress ?? "");
                                  setLatLng({
                                    lat: loc.lat,
                                    lng: loc.lng,
                                  });
                                }}
                              >
                                {loading || busy ? (
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
                    renderOption={(props,option) => {
                      const matches = option.structured_formatting.main_text_matched_substrings;
                      let parts = null
                      if(matches) {
                        parts = parse(
                          option.structured_formatting.main_text,
                          matches.map((match) => [match.offset, match.offset + match.length])
                        );
                      }
                      return (
                        <Grid {...props} container alignItems="center">
                          <Grid item>
                            <LocationOnIcon className={classes.icon} />
                          </Grid>
                          <Grid item xs>
                            {parts && parts.map((part, index) => (
                              <span key={index} style={{ fontWeight: part.highlight ? 700 : 400, color: "black" }}>
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
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      setExpand(false);
                      if (search) {
                        changeLocation({
                          label: "Home",
                          latitude: latLng.lat,
                          longitude: latLng.lng,
                          deliveryAddress: search,
                        });
                      } else {
                        getAddress();
                      }
                    }}
                    className={classes.button}
                  >
                    <RightIcon />
                  </Button>
                </Container>
              </Box>
              <Divider light orientation="horizontal" />
            </>
          )}
        </Box>
      )}
    </>
  );
}

export default React.memo(Subheader);
