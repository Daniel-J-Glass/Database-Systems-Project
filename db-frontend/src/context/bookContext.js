import React from "react";
import books from "../testData/books";

const BookContext = React.createContext(books);

export const BookProvider = BookContext.Provider;
export const BookConsumer = BookContext.Consumer;
export default BookContext;
