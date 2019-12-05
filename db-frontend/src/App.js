import React from "react";
import Router from "./Router";
import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import store from "./store/store";
import { StoreProvider } from "easy-peasy";

function App() {
  return (
    <StoreProvider store={store}>
      <Router />
      <ToastContainer />
    </StoreProvider>
  );
}

export default App;
