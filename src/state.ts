import {proxy, subscribe} from "valtio";
import {proxySet} from "valtio/utils";

import {library} from "./books.json";

// Normalize data from JSON
const books = library.map((item) => item.book);

// Types
interface Book {
  title: string;
  pages: number;
  genre: string;
  cover: string;
  synopsis: string;
  year: number;
  ISBN: string;
}

// Resources
const api = {
  readList: {
    // Fetch and parse read list from local storage
    fetch: () => JSON.parse(window.localStorage.getItem("readList") || "[]") as Book["ISBN"][],
    // Update read list in local storage
    update: (books: Book["ISBN"][]) => localStorage.setItem("readList", JSON.stringify(books)),
  },
};

// State
export const state = proxy<{
  books: Book[];
  matches: Book[];
  genres: {label: string; count: number}[];
  filters: {genre: string; list: "available" | "readlist"};
  readList: Set<Book["ISBN"]>;
}>({
  books,
  filters: {
    genre: "",
    list: "available",
  },
  readList: proxySet(api.readList.fetch()),
  get genres(): {label: string; count: number}[] {
    // Create a map to store the genres and their count
    const map = new Map<string, number>();

    for (const book of books) {
      // If the genre is not in the map, add it with a count of 0
      if (!map.has(book.genre)) map.set(book.genre, 0);

      // If the filter is set to readlist and the book is not in the readlist, skip it
      if (state.filters.list === "readlist" && !state.readList.has(book.ISBN)) continue;

      map.set(book.genre, map.get(book.genre)! + 1);
    }

    // Convert the map to an array of objects with label and count
    return Array.from(map.entries()).map(([label, count]) => ({label, count}));
  },
  get matches(): Book[] {
    // Early return if a book doesn't match the list or genre filters, return true otherwise
    return books.filter((book) => {
      if (state.filters.list === "readlist" && !state.readList.has(book.ISBN)) return false;
      if (state.filters.genre && book.genre !== state.filters.genre) return false;

      return true;
    });
  },
});

// Actions
export const toggleFromReadList = (book: Book) => {
  state.readList.has(book.ISBN) ? state.readList.delete(book.ISBN) : state.readList.add(book.ISBN);
};

export const toggleListFilter = (value: "available" | "readlist") => {
  state.filters.list = value;
};

export const setGenreFilter = (value: string) => {
  state.filters.genre = value;
};

// Side Effects
subscribe(state.readList, () => {
  // Save the new read list everytime it changes
  api.readList.update(Array.from(state.readList));
});
