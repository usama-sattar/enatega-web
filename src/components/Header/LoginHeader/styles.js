import makeStyles from "@mui/styles/makeStyles";

const useStyles = makeStyles((theme) => ({
  flex: {
    display: "flex",
    minHeight: "64px",
  },
  toolbar: {
    justifyContent: "space-between",
    backgroundColor: theme.palette.primary.light,
  },
  font700: {
    fontWeight: 700,
  },
  ml: {
    marginLeft: "8px",
  },
  linkDecoration: {
    textDecoration: "none",
    alignSelf: "center",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
}));

export default useStyles;
