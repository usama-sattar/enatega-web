import { Avatar, Box, Divider } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import CartIcon from "../../../assets/icons/CartIcon";
import ProfileIcon from "../../../assets/icons/ProfileIcon";
import useStyle from "./styles";
import Logo from "../../../assets/images/logo.png";

function LoginDesktopHeader({ title, showIcon, showCart = false }) {
  const classes = useStyle();

  return (
    <AppBar elevation={0} position="fixed">
      <Toolbar className={classes.toolbar}>
        <RouterLink to="/" className={classes.linkDecoration}>
          <Avatar alt="Remy Sharp" src={Logo} sx={{ width: 50, height: 50 }} />
          <Typography variant="h6" color="primary" className={classes.font700}>
            {title}
          </Typography>
        </RouterLink>
        <Box className={classes.flex}>
          {showIcon && (
            <>
              <Divider flexItem orientation="vertical" light />
              <RouterLink to={"/login"} className={classes.linkDecoration}>
                <Button aria-controls="simple-menu" aria-haspopup="true">
                  <ProfileIcon />
                  <Typography
                    variant="button"
                    color="textSecondary"
                    className={`${classes.ml} ${classes.font700}`}
                  >
                    {"Login"}
                  </Typography>
                </Button>
              </RouterLink>
              <Divider flexItem orientation="vertical" light />
            </>
          )}
          {showCart && (
            <Box style={{ alignSelf: "center" }}>
              <RouterLink to="/" className={classes.linkDecoration}>
                <Button>
                  <CartIcon />
                </Button>
              </RouterLink>
            </Box>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default React.memo(LoginDesktopHeader);
