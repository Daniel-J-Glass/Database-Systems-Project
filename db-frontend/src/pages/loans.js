import React, { useState } from "react";
import { TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { toast } from "react-toastify";
import { useDebouncedCallback } from "use-debounce/lib";
import BookGrid from "../components/BookGrid";
import { useStoreActions } from "easy-peasy";

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
  const [loans, setLoans] = useState([]);
  const addBooks = useStoreActions(actions => actions.book.actuallyAddBooks);

  const getLoans = () => {
    fetch("http://localhost:3000/loans/get/" + search)
      .then(response => response.json())
      .then(json => {
        console.log(json);
        setLoans(json.loans);
        addBooks(json.loans);
      })
      .catch(error => {
        console.log(error);
        toast.error(error.error);
      });
  };
  const [debouncedCallback] = useDebouncedCallback(value => {
    getLoans();
  }, 100);

  return (
    <div style={{ padding: 16, margin: 0 }}>
      <h1>Loans</h1>

      <TextField
        id="outlined-basic"
        className={classes.textField}
        label="Search for your loans by card number..."
        margin="normal"
        variant="outlined"
        value={search}
        onChange={e => {
          debouncedCallback(e.target.value);
          setSearch(e.target.value);
        }}
      />

      <BookGrid books={loans} />
    </div>
  );
}
