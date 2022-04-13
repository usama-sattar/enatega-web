/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  CircularProgress,
  Container,
  Grid,
  Hidden,
  Typography,
  useTheme,
  Link as MaterialLink,
} from "@mui/material";
import { GoogleMap, Marker } from "@react-google-maps/api";
import React, { useCallback, useContext, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import AppStoreIcon from "../../assets/icons/AppStoreIcon";
import PlayStoreIcon from "../../assets/icons/PlayStoreIcon";
import Footer from "../../components/Footer/Footer";
import { Header } from "../../components/Header";
import { DetailCard, StatusCard } from "../../components/Orders";
import UserContext from "../../context/User";
import Analytics from "../../utils/analytics";
import { ORDER_STATUS } from "../../utils/constantValues";
import useStyles from "./styles";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function OrderDetail() {
  const theme = useTheme();
  const classes = useStyles();
  let { id } = useParams();
  const navigate = useNavigate();
  let destCoordinates = null;
  let restCoordinates = {};
  const queryParams = useQuery();

  const onLoad = useCallback(
    (map) => {
      const bounds = new window.google.maps.LatLngBounds();
      bounds.extend(restCoordinates);
      bounds.extend(destCoordinates);
      map.fitBounds(bounds);
      map.panToBounds(bounds);
    },
    [restCoordinates, destCoordinates]
  );

  const { loadingOrders, errorOrders, orders, clearCart } =
    useContext(UserContext);
  useEffect(async () => {
    await Analytics.track(Analytics.events.NAVIGATE_TO_ORDER_DETAIL, {
      orderId: id,
    });
  }, []);
  useEffect(() => {
    if (!id) {
      navigate("/orders");
    }
    if (queryParams.get("clearCart")) {
      clearCart();
    }
  }, [id]);
  if (errorOrders) {
    return (
      <Grid container className={classes.root}>
        <Header />
        <Typography>{errorOrders.message}</Typography>
      </Grid>
    );
  }
  const order = orders.find((o) => o._id === id);
  if (loadingOrders || !order) {
    return (
      <Grid container className={classes.root}>
        <Header />
        <CircularProgress color="primary" size={48} />
      </Grid>
    );
  }

  restCoordinates = {
    lat: parseFloat(order.restaurant.location.coordinates[1]),
    lng: parseFloat(order.restaurant.location.coordinates[0]),
  };
  if (!ORDER_STATUS.includes(order.orderStatus)) {
    restCoordinates = {
      lat: parseFloat(order.restaurant.location.coordinates[1]),
      lng: parseFloat(order.restaurant.location.coordinates[0]),
    };
    destCoordinates = {
      lat: parseFloat(order.deliveryAddress.location.coordinates[1]),
      lng: parseFloat(order.deliveryAddress.location.coordinates[0]),
    };
  }

  return (
    <Grid container className={classes.root}>
      <Header />
      {loadingOrders || !order ? (
        <CircularProgress color="primary" size={48} />
      ) : errorOrders ? (
        <Typography>Unable to load data </Typography>
      ) : (
        <Grid container item className={classes.mainContainer}>
          {!["CANCELLED", "DELIVERED"].includes(order.orderStatus) && (
            <Grid item xs={12}>
              <GoogleMap
                mapContainerStyle={{ height: "400px", width: "100%" }}
                zoom={14}
                center={restCoordinates}
                onLoad={destCoordinates && onLoad}
              >
                <Marker position={restCoordinates} />
                <Marker position={destCoordinates} />
              </GoogleMap>
            </Grid>
          )}
          <Container maxWidth="md" className={classes.mainContainer}>
            <Grid container spacing={3} className={classes.center}>
              <Grid item xs={12} sm={6}>
                <StatusCard {...order} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DetailCard {...order} />
                <Box pt={theme.spacing(2)} />
              </Grid>
            </Grid>
            <Box
              display="flex"
              height={theme.spacing(10)}
              width="100%"
              justifyContent="center"
              alignItems="center"
              className={classes.bottomContainer}
            >
              <Hidden smDown>
                <img
                  style={{ width: "139px", minHeight: "1px" }}
                  alt="delivery status"
                  src="https://images.deliveryhero.io/image/foodpanda/phones-app-banner/foodpanda.png?width=139&amp;height=98"
                />
                <Typography variant="body1" className={classes.smallText}>
                  Download our free app!
                </Typography>
              </Hidden>
              <MaterialLink
                target="__blank"
                href="https://apps.apple.com/pk/app/enatega-multivendor/id1526488093"
              >
                <AppStoreIcon />
              </MaterialLink>
              <Box pl={theme.spacing(2)} />
              <MaterialLink
                target="__blank"
                href="https://play.google.com/store/apps/details?id=com.enatega.multivendor"
              >
                <PlayStoreIcon />
              </MaterialLink>
            </Box>
          </Container>
        </Grid>
      )}
      <Footer />
    </Grid>
  );
}

export default OrderDetail;
