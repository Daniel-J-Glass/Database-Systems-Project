import React, { useState } from "react";
import Typography from "@material-ui/core/Typography";
import { Box, TextField } from "@material-ui/core";
import BookGrid from "../components/BookGrid";
import { makeStyles } from "@material-ui/core/styles";
import { useDebouncedCallback } from "use-debounce";

const useStyles = makeStyles(theme => ({
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: "calc(100% - 90px)"
  }
}));

export default function Books() {
  const classes = useStyles();
  const [search, setSearch] = useState("");
  const [debouncedCallback] = useDebouncedCallback(value => {
    console.log("Searching for " + value + "...");
  }, 1000);

  return (
    <div>
      <Box ml={8} mt={4}>
        <Typography variant="h3">Library</Typography>

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

        <BookGrid />
      </Box>
    </div>
  );
}
