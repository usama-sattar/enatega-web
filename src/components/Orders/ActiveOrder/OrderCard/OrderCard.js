import {
  Grid,
  Box,
  Typography,
  useTheme,
  Paper,
  useMediaQuery,
} from "@mui/material";
import React, { useEffect, useState, useRef } from "react";
import { Link as RouterLink } from "react-router-dom";
import useStyles from "./styles";
import ProgressBar from "../LinearProgress/ProgressBar";

const orderStatuses = [
  {
    key: "PENDING",
    status: 1,
    statusText: "Your order is still pending.",
  },
  {
    key: "ACCEPTED",
    status: 2,
    statusText: "Restaurant is preparing Food.",
  },
  {
    key: "PICKED",
    status: 3,
    statusText: "Rider is on the way.",
  },
  {
    key: "DELIVERED",
    status: 4,
    statusText: "Order is delivered.",
  },
  {
    key: "COMPLETED",
    status: 5,
    statusText: "Order is completed.",
  },
];

function timeConvert(n) {
  var num = n;
  var hours = num / 60;
  var rhours = Math.floor(hours);
  var minutes = (hours - rhours) * 60;
  var rminutes = Math.round(minutes);
  return (rhours > 0 ? rhours + " hr(s) " + rminutes : rminutes) + " min(s) ";
}

const checkStatus = (status) => {
  const obj = orderStatuses.filter((x) => {
    return x.key === status;
  });
  return obj[0];
};
export const OrderCard = (props) => {
  const theme = useTheme();
  const extraSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const classes = useStyles(extraSmall);
  const { item } = props;
  const [remainingTime, setRemainingTime] = useState(0);
  let secTimer = useRef(null);
  useEffect(() => {
    setRemainingTime(Math.floor((item.expectedTime - Date.now()) / 1000 / 60));
    if (!secTimer.current) {
      secTimer.current = setInterval(() => {
        setRemainingTime(
          Math.floor((item.expectedTime - Date.now()) / 1000 / 60)
        );
      }, 60000);
    }

    return () => {
      if (secTimer.current) clearInterval(secTimer.current);
    };
  }, [item]);

  return (
    <>
      <Grid item lg={5} md={5} key={item.index} className={classes.mt}>
        <RouterLink
          to={{ pathname: `/order-detail/${item._id}` }}
          className={classes.link}
        >
          <Paper elevation={0} className={classes.box}>
            <Box spacing={2} display={"flex"}>
              <Box>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  className={classes.textBold}
                >
                  {item.orderId}
                </Typography>
                <ProgressBar />
                <Typography variant="body2" color="textSecondary">
                  {remainingTime <= 0 ? (
                    <Typography>Your Order Is Running Late</Typography>
                  ) : (
                    checkStatus(item.orderStatus).statusText
                  )}
                </Typography>
              </Box>
              <Box
                display={"flex"}
                flex={1}
                alignItems={"flex-end"}
                justifyContent={"flex-end"}
              >
                <Typography variant="body2" color="textSecondary">
                  {remainingTime <= 0 ? " " : timeConvert(remainingTime)}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </RouterLink>
      </Grid>
      <Grid item sm={1} xs={1} />
    </>
  );
};
