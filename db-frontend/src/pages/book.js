import React, { useState } from "react";
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
import { useStoreState } from "easy-peasy";
import { toast } from "react-toastify";

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

  const [cardNo, setCardNo] = useState("");

  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const onCloseCheckoutModal = () => {
    setCheckoutModalOpen(false);
  };

  const [checkinModalOpen, setCheckinModalOpen] = useState(false);
  const onCloseCheckinModal = () => {
    setCheckinModalOpen(false);
  };

  const value = useStoreState(state =>
    state.book.books.find(book => book.Isbn === params.id)
  );

  const checkoutBook = () => {
    fetch("http://localhost:3000/book/checkout", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ Isbn: value.Isbn, Card_no: cardNo })
    })
      .then(response => response.json())
      .then(json => toast.info(json.message))
      .catch(error => toast.info(error.message));
  };

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
            value.Pages !== "0" ? value.Pages + " pages" : "No Page Data Found"
          }
        />
        <CardMedia
          className={classes.media}
          image={value.Image}
          title="Paella dish"
        />
        <CardContent>
          <Typography variant="body2" color="textSecondary" component="p">
            <b>Written by:</b> {value.Name}
            <br />
            <b>Isbn:</b> {value.Isbn}
            <br />
            <b>Publisher:</b> {value.Publisher}
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
        onChangeCardNo={setCardNo}
        onCheckout={checkoutBook}
      />
      <CheckinModal
        book={value}
        open={checkinModalOpen}
        onClose={onCloseCheckinModal}
      />
    </Grid>
  );
}
