import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { Link } from "react-router-dom";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    flexGrow: 1
  }
}));

export default function Appbar() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Link to="/books" style={{ textDecoration: "none", color: "white", marginRight: 20 }}>
            <Typography variant="h6" className={classes.title}>
              Library
            </Typography>
          </Link>
          {/* <Link to="/checked-out" style={{ textDecoration: "none", color: "white" }}>
            <Typography variant="h6" className={classes.title}>
              Checked-Out
            </Typography>
          </Link> */}
        </Toolbar>
      </AppBar>
    </div>
  );
}
