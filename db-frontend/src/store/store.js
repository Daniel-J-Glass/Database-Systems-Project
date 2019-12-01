import { action, createStore, persist } from "easy-peasy";

const bookStore = {
  books: [],
  addBooks: action((state, payload) => {
    state.books = payload;
  }),
  actuallyAddBooks: action((state, payload) => {
    state.books.push(...payload);
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
  fine: fineStore
};

const store = createStore(persist(storeModel));

export default store;
