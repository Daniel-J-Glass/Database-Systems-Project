import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardHeader,
  Button,
  Box
} from "@material-ui/core";
import { Link } from "react-router-dom";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    marginTop: 10,
    marginLeft: -44
  },
  paper: {
    width: 300,
    paddingBottom: 24
  },
  media: {
    width: "100%",
    height: 500,
    align: "top"
  }
}));

export default function BookGrid({ books, loans }) {
  const classes = useStyles();
  const titleLength = 20;

  return (
    <Grid container className={classes.root} spacing={2}>
      <Grid item xs={12}>
        <Grid container justify="center" spacing={4}>
          {books.map(value => (
            <Grid key={value.Isbn} item>
              <Card className={classes.paper}>
                <CardHeader
                  title={
                    value.Title &&
                    value.Title.substring(0, titleLength) +
                      (value.Title.length > titleLength ? "..." : "")
                  }
                  subheader={
                    value.Pages !== "0"
                      ? value.Pages + " pages"
                      : "No Page Data Found"
                  }
                />
                <CardMedia
                  className={classes.media}
                  image={`http://covers.openlibrary.org/b/isbn/${value.Isbn}.jpg`}
                  title="Paella dish"
                />
                <CardContent>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    component="p"
                  >
                    {value.Name && (
                      <div>
                        <b>Written by:</b> {value.Name}
                        <br />
                      </div>
                    )}
                    <b>Isbn:</b> {value.Isbn}
                    <br />
                    <b>Publisher:</b> {value.Publisher}
                    <br />
                    <b>Checked Out:</b>{" "}
                    {loans &&
                    loans.find(loan => loan.Isbn === value.Isbn) !== undefined
                      ? "Checked Out"
                      : "Not Checked Out"}
                  </Typography>
                </CardContent>

                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="flex-end"
                  mt={3}
                >
                  <Box mr={2}>
                    <Link
                      to={"/book/" + value.Isbn}
                      style={{ textDecoration: "none" }}
                    >
                      <Button variant="contained">Details</Button>
                    </Link>
                  </Box>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
}
