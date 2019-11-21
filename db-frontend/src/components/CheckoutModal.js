import React from "react";
import {
  Card,
  CardContent,
  Modal,
  Grid,
  TextField,
  Button,
  Box
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    marginTop: 10,
    marginLeft: -44
  },
  paper: {
    width: 500
  },
  media: {
    height: 0,
    paddingTop: "56.25%"
  }
}));

export default function CheckoutModal({
  open,
  onClose,
  book,
  onCheckout,
  onChangeCardNo
}) {
  const classes = useStyles();

  return (
    <Modal open={open} onClose={onClose}>
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justify="center"
        style={{ minHeight: "100vh", marginTop: -32 }}
      >
        <Card className={classes.paper}>
          <CardContent>
            <h2>Check Out</h2>
            <p>
              You are attempting to check out <b>{book.Title}</b>.
            </p>
            <p>
              Please provide us with your <b>library card number</b> to proceed.
            </p>

            <TextField
              id="standard-basic"
              label="Library Card Number"
              margin="normal"
              style={{ width: "100%" }}
              onChange={e => onChangeCardNo(e.target.value)}
            />

            <Box
              width={"100%"}
              justifyContent="space-between"
              display="flex"
              flexDirection="row"
              mt={3}
            >
              <Button variant="contained" color="secondary" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={onCheckout} variant="contained" color="primary">
                Checkout
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Modal>
  );
}
