import { action, createStore, persist } from "easy-peasy";

const bookStore = {
  books: [],
  addBooks: action((state, payload) => {
    state.books = payload;
  })
};

const storeModel = {
  book: bookStore
};

const store = createStore(persist(storeModel));

export default store;
