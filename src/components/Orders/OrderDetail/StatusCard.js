import { Box, Grid, Paper, Typography, useTheme } from "@mui/material";
import React from "react";
import useStyles from "./styles";
import Rider from "../../../assets/images/rider.jpeg";
import ClockLoader from "react-spinners/ClockLoader";

const ProgressImage =
  "https://images.deliveryhero.io/image/pd-otp-illustrations/v2/foodpanda/illu-in-progress.gif";
const DeliveredImage =
  "https://images.deliveryhero.io/image/pd-otp-illustrations/v2/foodpanda/illu-delivered.gif";

function StatusCard(props) {
  const theme = useTheme();
  const classes = useStyles();
  const {description,
    estimated_time,
    feedback,
    status_image,}=getOrderStatusValues(props)

  return (
    <Paper className={classes.cardContainer}>
      <Grid container className={classes.center}>
        <Grid item xs={12}>
          <Typography
            align="center"
            variant="body2"
            color="textSecondary"
            className={classes.smallText}
          >
            {description}
          </Typography>
        </Grid>
        <Grid item xs={12} className={classes.mv2}>
          <Typography
            align="center"
            variant="h5"
            color="textSecondary"
            className={classes.textBold}
          >
            {estimated_time}
          </Typography>
        </Grid>
        {props.orderStatus === "PENDING" ? (
          <Box display="flex" justifyContent="center" width="100%" mt={2}>
            <ClockLoader color={theme.palette.primary.main} />
          </Box>
        ) : status_image ? (
          <img className={classes.imgContainer} src={status_image} alt="Pic" />
        ) : null}
        <Typography
          variant="body2"
          color="textSecondary"
          align="center"
          className={`${classes.smallText} ${classes.w70} ${classes.mt3}`}
        >
          {feedback}
        </Typography>
      </Grid>
    </Paper>
  );
}
function getOrderStatusValues({
  expectedTime,
  isPickedUp,
  orderStatus,
  restaurant,
}) {
  const calculateTime = Math.floor((expectedTime - Date.now()) / 1000 / 60);
  const deliveryOption = !!isPickedUp ? "pick up" : "delivery";
  let description = "";
  let estimated_time = "";
  let feedback = "";
  let status_image = "";
  switch (orderStatus) {
    case "PENDING":
      description = "Waiting response from";
      estimated_time = restaurant?.name ?? "...";
      feedback = "";
      status_image = ProgressImage;
      break;
    case "ACCEPTED":
      description = `Estimated ${deliveryOption} time`;
      estimated_time =
        calculateTime > 0
          ? `${calculateTime} Min`
          : "Sorry! Your order is bit late.";
      feedback = `Preparing your food.${isPickedUp?"":" Your rider will pick it up once its ready"}`;
      status_image = ProgressImage;
      break;
    case "PICKED":
      description = " Your order is ";
      estimated_time = "Picked";
      feedback = "Your rider is on the way.";
      status_image = Rider;
    break;
    case "DELIVERED":
      description = "Your order has been";
      estimated_time = "Delivered";
      feedback = "Enjoy your meal!";
      status_image = DeliveredImage;
    break;
    case "CANCELLED":
      description = "Your order has been";
      estimated_time = "Cancelled";
      feedback = "";
      status_image = null;
      break;
    default:
      break;
  }

  return {
    description,
    estimated_time,
    feedback,
    status_image,
  };
}
export default StatusCard;
