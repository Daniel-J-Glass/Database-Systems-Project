import React, { useState } from "react";
import { BookConsumer } from "../context/bookContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  Typography,
  Box,
  Button,
  Grid
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { Link } from "react-router-dom";
import CheckoutModal from "../components/CheckoutModal";
import CheckinModal from "../components/CheckinModal";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    marginTop: 10,
    marginLeft: -44
  },
  paper: {
    height: 650,
    width: 450
  },
  media: {
    height: 0,
    paddingTop: "56.25%"
  }
}));

export default function Book(props) {
  const {
    match: { params }
  } = props;
  const classes = useStyles();
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const onCloseCheckoutModal = () => {
    setCheckoutModalOpen(false);
  };
  const [checkinModalOpen, setCheckinModalOpen] = useState(false);
  const onCloseCheckinModal = () => {
    setCheckinModalOpen(false);
  };

  return (
    <BookConsumer>
      {books => {
        const value = books.find(localBook => localBook.Isbn === params.id);

        return (
          <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justify="center"
            style={{ minHeight: "100vh", marginTop: -32 }}
          >
            <Card className={classes.paper}>
              <CardHeader
                title={value.Title}
                subheader={
                  value.Pages !== "0"
                    ? value.Pages + " pages"
                    : "No Page Data Found"
                }
              />
              <CardMedia
                className={classes.media}
                image={value.Image}
                title="Paella dish"
              />
              <CardContent>
                <Typography variant="body2" color="textSecondary" component="p">
                  Mort is a fantasy novel by British writer Terry Pratchett.
                  Published in 1987, it is the fourth Discworld novel and the
                  first to focus on the character Death, who only appeared as a
                  side character in the previous novels.
                </Typography>
              </CardContent>

              <Box
                mt={17}
                width="100%"
                display="flex"
                justifyContent="space-around"
                alignItems="flex-end"
              >
                <Link to="/books" style={{ textDecoration: "none" }}>
                  <Button variant="contained">Go Back</Button>
                </Link>
                <Button
                  onClick={() => setCheckinModalOpen(true)}
                  variant="contained"
                  color="primary"
                >
                  Check-In
                </Button>
                <Button
                  onClick={() => setCheckoutModalOpen(true)}
                  variant="contained"
                  color="primary"
                >
                  Checkout
                </Button>
              </Box>
            </Card>

            <CheckoutModal
              book={value}
              open={checkoutModalOpen}
              onClose={onCloseCheckoutModal}
            />
            <CheckinModal
              book={value}
              open={checkinModalOpen}
              onClose={onCloseCheckinModal}
            />
          </Grid>
        );
      }}
    </BookConsumer>
  );
}
