import { gql, useMutation } from "@apollo/client";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import { useTheme } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import React, { useCallback, useContext, useRef, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import FlashMessage from "../../components/FlashMessage";
import UserContext from "../../context/User";
import { isValidEmailAddress } from "../../utils/customFunction";
import { LoginWrapper } from "../Wrapper";
import useStyles from "./styles";
import Analytics from "../../utils/analytics";
import RegistrationIcon from "../../assets/images/emailLock.png";
import { Avatar } from "@mui/material";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";

function PhoneNumber() {
  const theme = useTheme();
  const classes = useStyles();
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const formRef = useRef(null);
  const { state } = useLocation();
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const handleAction = () => {
    setError("");
    let validate = true;
    if (!phone) {
      setPhoneError("Phone number required");
      validate = false;
      return;
    }
    if (validate) {
      if (phone !== state?.prevPhone) {
        navigate("/verify-phone", {
          replace: true,
          state: {
            phone,
          },
        });
      } else {
        setPhoneError("New phone number must be different from pervious one");
      }
    }
  };

  return (
    <LoginWrapper>
      <FlashMessage
        open={Boolean(error)}
        severity={"error"}
        alertMessage={error}
      />
      <Box display="flex">
        <Box m="auto">
          <Avatar
            m="auto"
            alt="email"
            src={RegistrationIcon}
            sx={{
              width: 100,
              height: 100,
              display: "flex",
              alignSelf: "center",
            }}
          />
        </Box>
      </Box>
      <Typography variant="h5" className={classes.font700}>
        Update your phone <br /> number?
      </Typography>
      <Box mt={theme.spacing(1)} />
      <Typography
        variant="caption"
        className={`${classes.caption} ${classes.fontGrey}`}
      >
        We need this to secure your account
      </Typography>
      <Box mt={theme.spacing(4)} />
      <form ref={formRef}>
        <Box className={classes.form}>
          <PhoneInput
            placeholder="Enter phone number"
            defaultCountry="PK"
            value={phone}
            onChange={setPhone}
            className={classes.codePicker}
            error={phoneError}
          />
          {/* <TextField
            name={"phone number"}
            defaultValue={state?.email ?? ""}
            variant="outlined"
            label="Mobile number"
            fullWidth
            InputLabelProps={{
              style: {
                color: theme.palette.grey[500],
              },
            }}
          /> */}
        </Box>
        <Box mt={theme.spacing(8)} />
        <Button
          variant="contained"
          fullWidth
          type="email"
          disableElevation
          disabled={loading}
          className={classes.btnBase}
          onClick={(e) => {
            e.preventDefault();
            handleAction();
          }}
        >
          {loading ? (
            <CircularProgress color="primary" />
          ) : (
            <Typography
              variant="caption"
              className={`${classes.caption} ${classes.font700}`}
            >
              CONTINUE
            </Typography>
          )}
        </Button>
      </form>
    </LoginWrapper>
  );
}

export default PhoneNumber;
