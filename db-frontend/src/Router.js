import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Books from "./pages/books";
import Appbar from "./components/Appbar";
import Book from "./pages/book";
import Borrowers from "./pages/borrowers";
import Fines from "./pages/fines";
import Loans from "./pages/loans";

export default function App() {
  return (
    <Router>
      <Appbar />

      <Switch>
        <Route path="/" exact component={Books} />
        <Route path="/books" component={Books} />
        <Route path="/book/:id" component={Book} />
        <Route path="/borrowers" component={Borrowers} />
        <Route path="/fines" component={Fines} />
        <Route path="/loans" component={Loans} />
      </Switch>
    </Router>
  );
}
