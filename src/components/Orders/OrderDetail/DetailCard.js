import { Box, Divider, Grid, Paper, Typography } from "@mui/material";
import clsx from "clsx";
import React, { useContext } from "react";
import ConfigurationContext from "../../../context/Configuration";
import { calculatePrice } from "../../../utils/customFunction";
import ThreeDots from "../../ThreeDots/ThreeDots";
import useStyles from "./styles";

function DetailCard(props) {
  const classes = useStyles();
  const configuration = useContext(ConfigurationContext);
  const deliveryCharges = props.isPickedUp ? 0 :  props.deliveryCharges
  return (
    <Paper className={classes.cardContainer}>
      <Grid container className={classes.center}>
        <Grid item xs={12}>
          <Typography
            variant="h5"
            color="textSecondary"
            className={classes.textBold}
          >
            Order details
          </Typography>
        </Grid>
        <ThreeDots />
        <Grid container item xs={12}>
          <Grid item xs={5}>
            <Typography
              variant="body2"
              className={clsx(classes.disabledText, classes.smallText)}
            >
              Your order from:
            </Typography>
          </Grid>
          <Grid item xs={7} className={classes.ph1}>
            <Typography
              variant="body2"
              color="textSecondary"
              className={clsx(classes.textBold, classes.smallText)}
            >
              {props.restaurant?.name ?? "..."}
            </Typography>
          </Grid>
        </Grid>
        <Grid container item xs={12} className={classes.mv2}>
          <Grid item xs={5}>
            <Typography
              variant="body2"
              className={clsx(classes.disabledText, classes.smallText)}
            >
              Order number:
            </Typography>
          </Grid>
          <Grid item xs={7} className={classes.ph1}>
            <Typography
              variant="body2"
              color="textSecondary"
              className={clsx(classes.textBold, classes.smallText)}
            >
              {props.orderId ?? "..."}
            </Typography>
          </Grid>
        </Grid>
        <Grid container item xs={12}>
          <Grid item xs={5}>
            <Typography
              variant="body2"
              className={clsx(classes.disabledText, classes.smallText)}
            >
              {!!props.isPickedUp ? "Pick Up Address:" : "Delivery Address:"}
            </Typography>
          </Grid>
          <Grid item xs={7} className={classes.ph1}>
            {!!props.isPickedUp ? (
              <Typography
                variant="body2"
                color="textSecondary"
                className={clsx(classes.textBold, classes.smallText)}
              >
                {props.restaurant?.address ?? "..."}
              </Typography>
            ) : (
              <Typography
                variant="body2"
                color="textSecondary"
                className={clsx(classes.textBold, classes.smallText)}
              >
                {props.deliveryAddress?.deliveryAddress ?? "..."}
              </Typography>
            )}
          </Grid>
        </Grid>
        <ThreeDots />
        {props.items.map((item) => (
          <Grid key={item._id} item xs={12} className={classes.cardRow}>
            <Grid item>
              <Typography
                variant="caption"
                className={`${classes.disabledText} ${classes.smallText}`}
              >
                {`${item.quantity}x ${item.title}${
                  item.variation.title ? `(${item.variation.title})` : ""
                }`}
              </Typography>
              <Box display="flex" flexDirection="column">
                {item.addons.map((addon) => (
                  <Typography
                    variant="caption"
                    className={`${classes.disabledText}`}
                  >
                    +{addon.options.map((option) => option.title)}
                  </Typography>
                ))}
              </Box>
            </Grid>
            <Typography
              variant="body2"
              className={clsx(classes.disabledText, classes.smallText)}
            >
              {`${configuration.currencySymbol} ${parseFloat(
                calculatePrice(item)
              ).toFixed(2)}`}
            </Typography>
          </Grid>
        ))}
        <Grid item xs={12}>
          <Divider light orientation="horizontal" />
        </Grid>
        <Grid item xs={12} className={clsx(classes.cardRow, classes.mv2)}>
          <Typography
            variant="body2"
            className={clsx(classes.disabledText, classes.smallText)}
          >
            Subtotal
          </Typography>
          <Typography
            variant="body2"
            className={clsx(classes.disabledText, classes.smallText)}
          >
            {`${configuration.currencySymbol} ${parseFloat(
              props.orderAmount -
                deliveryCharges -
                props.taxationAmount -
                props.tipping
            ).toFixed(2)}`}
          </Typography>
        </Grid>
        <Grid item xs={12} className={classes.cardRow}>
          <Typography
            variant="body2"
            className={clsx(classes.disabledText, classes.smallText)}
          >
            Tip
          </Typography>
          <Typography
            variant="body2"
            className={clsx(classes.disabledText, classes.smallText)}
          >
            {`${configuration.currencySymbol} ${parseFloat(
              props.tipping
            ).toFixed(2)}`}
          </Typography>
        </Grid>
        <Grid item xs={12} className={classes.cardRow}>
          <Typography
            variant="body2"
            className={clsx(classes.disabledText, classes.smallText)}
          >
            Tax
          </Typography>
          <Typography
            variant="body2"
            className={clsx(classes.disabledText, classes.smallText)}
          >
            {`${configuration.currencySymbol} ${parseFloat(
              props.taxationAmount
            ).toFixed(2)}`}
          </Typography>
        </Grid>
        {!props.isPickedUp && <Grid item xs={12} className={classes.cardRow}>
          <Typography
            variant="body2"
            className={clsx(classes.disabledText, classes.smallText)}
          >
            Delivery Fee
          </Typography>
          <Typography
            variant="body2"
            className={clsx(classes.disabledText, classes.smallText)}
          >
            {`${configuration.currencySymbol} ${parseFloat(
              props.deliveryCharges
            ).toFixed(2)}`}
          </Typography>
        </Grid>}
        <Grid item xs={12} className={clsx(classes.cardRow, classes.mv2)}>
          <Box>
            <Typography
              variant="body2"
              color="textSecondary"
              className={clsx(classes.textBold, classes.smallText)}
            >
              Total
            </Typography>
            <Typography variant="caption" className={classes.disabledText}>
              (Incl. TAX)
            </Typography>
          </Box>
          <Typography
            variant="body2"
            color="textSecondary"
            className={clsx(classes.textBold, classes.smallText)}
          >
            {`${configuration.currencySymbol} ${parseFloat(
              props.orderAmount
            ).toFixed(2)}`}
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default React.memo(DetailCard);
