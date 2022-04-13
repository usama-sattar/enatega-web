import { useMediaQuery, useTheme } from "@mui/material";
import React from "react";
import { useLocation } from "react-router";
import LoginDesktopHeader from "./DesktopHeader";
import LoginMobileHeader from "./MobileHeader";

const TITLE = "Enatega";

const REGISTRATION_PATH = [
  "/login",
  "/new-login",
  "/registration",
  "/login-email",
  "/forgot-password",
  "/email-sent",
];

function Header({ showIcon = false }) {
  const theme = useTheme();
  const location = useLocation();
  const mobile = useMediaQuery(theme.breakpoints.down("sm"));
  const showCart = !REGISTRATION_PATH.includes(location.pathname);

  return mobile ? (
    <LoginMobileHeader title={TITLE} showCart={showCart} />
  ) : (
    <LoginDesktopHeader showIcon={showIcon} title={TITLE} showCart={showCart} />
  );
}

export default React.memo(Header);
