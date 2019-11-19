import React from "react";
import Router from "./Router";
import "./App.css";
import books from "./testData/books";
import { BookProvider } from "./context/bookContext";

function App() {
  return (
    <BookProvider value={books}>
      <Router />
    </BookProvider>
  );
}

export default App;
