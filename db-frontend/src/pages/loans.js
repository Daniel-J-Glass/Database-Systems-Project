import React, { useState, useEffect } from "react";
import { TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { toast } from "react-toastify";
import { useDebouncedCallback } from "use-debounce/lib";
import BookGrid from "../components/BookGrid";
import { useStoreActions, useStoreState } from "easy-peasy";

const useStyles = makeStyles(theme => ({
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: "calc(100% - 90px)"
  },
  root: {
    flexGrow: 1,
    marginTop: 10,
    marginLeft: -44
  },
  paper: {
    width: 450,
    paddingBottom: 24
  },
  media: {
    width: "100%",
    height: 450,
    align: "top"
  }
}));

export default function Loans() {
  const [search, setSearch] = useState("");
  const classes = useStyles();
  const superLoans = useStoreState(state => state.searchLoans);
  const loans = useStoreState(state => state.loans);
  const getLoans = useStoreActions(actions => actions.getLoansSearch);

  const [debouncedCallback] = useDebouncedCallback(value => {
    getLoans(search);
  }, 100);

  useEffect(() => {
    getLoans(search);
  }, []);

  return (
    <div style={{ padding: 16, margin: 0 }}>
      <h1>Loans</h1>

      <TextField
        id="outlined-basic"
        className={classes.textField}
        label="Search by card number, name, or isbn..."
        margin="normal"
        variant="outlined"
        value={search}
        onChange={e => {
          debouncedCallback(e.target.value);
          setSearch(e.target.value);
        }}
      />

      <BookGrid
        books={superLoans.filter(loan =>
          loans.find(smallLoan => smallLoan.Isbn === loan.Isbn)
        )}
        loans={loans}
      />
    </div>
  );
}
