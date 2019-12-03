import { action, createStore, persist, thunk } from "easy-peasy";
import { toast } from "react-toastify";

const bookStore = {
  books: [],
  addBooks: action((state, payload) => {
    state.books = payload;
  }),
  actuallyAddBooks: action((state, payload) => {
    state.books.push(...payload);

    state.books = state.books.filter(
      (v, i, a) => a.findIndex(t => t.Isbn === v.Isbn) === i
    );
  })
};

const fineStore = {
  fines: [],
  setFines: action((state, payload) => {
    state.fines = payload;
  })
};

const storeModel = {
  book: bookStore,
  fine: fineStore,
  loans: [],
  setLoans: action((state, payload) => {
    state.loans = payload;
  }),
  searchLoans: [],
  setSearchLoans: action((state, payload) => {
    state.searchLoans = payload;
  }),
  getLoans: thunk(async actions => {
    await fetch("http://localhost:3000/loans/allLoans")
      .then(response => response.json())
      .then(json => {
        actions.setLoans(json.loans);
      })
      .catch(error => {
        console.error(error);
        toast.error(error.error);
      });
  }),
  getLoansSearch: thunk(async (actions, payload) => {
    if (!payload) actions.setSearchLoans([]);
    await fetch("http://localhost:3000/loan/search/" + payload)
      .then(response => response.json())
      .then(json => {
        console.log(json.results);
        actions.setSearchLoans(json.results);
        actions.book.actuallyAddBooks(json.results);
      })
      .catch(error => {
        console.error(error);
        toast.error(error.error);
      });
  })
};

const store = createStore(persist(storeModel));

export default store;
