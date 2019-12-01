import React, { useState, useEffect } from "react";
import Typography from "@material-ui/core/Typography";
import { Box, TextField } from "@material-ui/core";
import BookGrid from "../components/BookGrid";
import { makeStyles } from "@material-ui/core/styles";
import { useDebouncedCallback } from "use-debounce";
import { toast } from "react-toastify";
import { useStoreActions, useStoreState } from "easy-peasy";

const useStyles = makeStyles(theme => ({
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: "calc(100% - 90px)"
  },
  progress: {
    margin: theme.spacing(2)
  }
}));

export default function Books() {
  const classes = useStyles();
  const books = useStoreState(state => state.book.books);
  const addBooks = useStoreActions(state => state.book.addBooks);
  const [search, setSearch] = useState("");
  const searchAllBooks = () => {
    if (search) {
      fetch("http://localhost:3000/book/search/" + search)
        .then(response => response.json())
        .then(json => {
          console.log(json);
          addBooks(json.results);
        })
        .catch(error => {
          console.log(error);
          toast.error(error.error);
        });
    } else {
      fetch("http://localhost:3000/book/all")
        .then(response => response.json())
        .then(json => {
          console.log(json);
          addBooks(json.results);
        })
        .catch(error => {
          console.log(error);
          toast.error(error.error);
        });
    }
  };
  const [debouncedCallback] = useDebouncedCallback(value => {
    searchAllBooks();
  }, 200);

  const getBooks = async () => {
    toast.info("Getting books...");
    searchAllBooks();
  };

  useEffect(() => {
    getBooks();
  }, []);

  return (
    <div>
      <Box ml={8} mt={4}>
        <Typography variant="h4">Library</Typography>

        <TextField
          id="outlined-basic"
          className={classes.textField}
          label="Search for book by ISBN, title, or author..."
          margin="normal"
          variant="outlined"
          value={search}
          onChange={e => {
            debouncedCallback(e.target.value);
            setSearch(e.target.value);
          }}
        />

        <BookGrid books={books} />
      </Box>
    </div>
  );
}
