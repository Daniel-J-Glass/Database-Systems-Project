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
          <Link
            to="/books"
            style={{ textDecoration: "none", color: "white", marginRight: 20 }}
          >
            <Typography variant="h6" className={classes.title}>
              Library
            </Typography>
          </Link>
          <Link
            to="/borrowers"
            style={{ textDecoration: "none", color: "white", marginRight: 20 }}
          >
            <Typography variant="h6" className={classes.title}>
              Borrowers
            </Typography>
          </Link>
          <Link
            to="/fines"
            style={{ textDecoration: "none", color: "white", marginRight: 20 }}
          >
            <Typography variant="h6" className={classes.title}>
              Fines
            </Typography>
          </Link>
          <Link
            to="/loans"
            style={{ textDecoration: "none", color: "white" }}
          >
            <Typography variant="h6" className={classes.title}>
              Loans
            </Typography>
          </Link>
        </Toolbar>
      </AppBar>
    </div>
  );
}
