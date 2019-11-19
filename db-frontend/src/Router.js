import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Books from "./pages/books";
import Appbar from "./components/Appbar";
import Book from "./pages/book";

export default function App() {
  return (
    <Router>
      <Appbar />

      <Switch>
        <Route path="/books" component={Books} />
        <Route path="/book/:id" component={Book} />
      </Switch>
    </Router>
  );
}
