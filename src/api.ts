import type {Book} from "@/types";

import data from "./books.json";

const api = {
  books: {
    list: async (): Promise<Book[]> =>
      new Promise((resolve) =>
        setTimeout(() => resolve(data.library.map((item) => item.book)), 1000),
      ),
  },
  readList: {
    // Fetch and parse read list from local storage
    fetch: async (): Promise<Set<Book["ISBN"]>> =>
      new Promise((resolve) =>
        setTimeout(
          () =>
            resolve(
              new Set(
                typeof window !== "undefined"
                  ? (JSON.parse(window.localStorage.getItem("readList") || "[]") as Book["ISBN"][])
                  : [],
              ),
            ),
          1000,
        ),
      ),
    // Update read list in local storage
    update: (readList: Set<Book["ISBN"]>) =>
      Promise.resolve(
        window.localStorage.setItem("readList", JSON.stringify(Array.from(readList))),
      ),
  },
};

export default api;
