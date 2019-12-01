import React, { useState, useEffect } from "react";
import {
  Button,
  Grid,
  Paper,
  Box,
  InputLabel,
  Checkbox,
  FormControlLabel
} from "@material-ui/core";
import { toast } from "react-toastify";
import { useStoreActions, useStoreState } from "easy-peasy";
import { makeStyles } from "@material-ui/core/styles";
import { LocalAtm } from "@material-ui/icons";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  paper: {
    padding: theme.spacing(5),
    textAlign: "center",
    color: theme.palette.text.secondary
  }
}));

export default function Fines() {
  const setFines = useStoreActions(actions => actions.fine.setFines);
  const fines = useStoreState(state => state.fine.fines);
  const [filterZeroFines, setFilterZeroFines] = useState(false);
  const [filterPaidFines, setFilterPaidFines] = useState(false);

  const filteredFines = fines
    .filter(fine => {
      if (filterZeroFines && fine.Fine_amt === 0) return undefined;

      if (filterPaidFines && fine.Paid) return undefined;

      return fine;
    })
    .filter(a => a);

  const getAllFines = () => {
    fetch("http://localhost:3000/fines/all")
      .then(response => response.json())
      .then(json => setFines(json.fines))
      .catch(error => toast.info(error.message));
  };

  const refreshFines = () => {
    fetch("http://localhost:3000/fines/refresh", {
      method: "POST"
    })
      .then(response => response.json())
      .then(json => {
        toast.info(json.message);
        getAllFines();
      })
      .catch(error => toast.info(error.message));
  };

  const payFine = cardNo => {
    fetch("http://localhost:3000/fines/payAll", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ Card_no: cardNo })
    })
      .then(response => response.json())
      .then(json => {
        toast.info(json.message);
        getAllFines();
      })
      .catch(error => toast.info(error.message));
  };

  const classes = useStyles();

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  });

  useEffect(() => {
    getAllFines();
  }, []);

  console.log(fines);

  return (
    <div style={{ padding: 16, margin: 0 }}>
      <h1>Fines</h1>

      <Box
        height="100px"
        display="flex"
        flexDirection="row"
        alignItems="center"
      >
        <Button
          style={{ marginRight: 16 }}
          onClick={refreshFines}
          variant="contained"
          color="secondary"
        >
          Update Fines
        </Button>

        <FormControlLabel
          style={{ marginRight: 16 }}
          control={
            <Checkbox
              checked={filterPaidFines}
              onChange={e => setFilterPaidFines(e.target.checked)}
            />
          }
          label="Filter Paid Fines"
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={filterZeroFines}
              onChange={e => setFilterZeroFines(e.target.checked)}
            />
          }
          label="Filter Zero Fines"
        />
      </Box>

      <Grid container spacing={3}>
        {filteredFines.map(fine => (
          <Grid item xs={6}>
            <Paper className={classes.paper} position="relative">
              <LocalAtm style={{ marginBottom: 16 }} />
              <Box>
                <InputLabel style={{ fontWeight: 600, marginBottom: 0 }}>
                  Card Number:
                </InputLabel>
                <p style={{ marginTop: 4 }}>{fine.Card_id}</p>

                <InputLabel style={{ fontWeight: 600, marginBottom: 0 }}>
                  Fine Amount:
                </InputLabel>
                <p style={{ marginTop: 4 }}>
                  {formatter.format(fine.Fine_amt)}
                </p>

                <InputLabel style={{ fontWeight: 600, marginBottom: 0 }}>
                  Paid:
                </InputLabel>
                <p style={{ marginTop: 4 }}>
                  {fine.Paid ? "Paid" : "Not Paid"}
                </p>

                <Button
                  style={{ marginTop: 8 }}
                  onClick={() => payFine(fine.Card_id)}
                  variant="contained"
                  color="primary"
                >
                  Mark as Paid
                </Button>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
