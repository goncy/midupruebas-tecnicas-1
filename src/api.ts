import type {Book} from "./types";

// Disclaimer: In this app, the book.list method is being used in a `server`
// component and the readList methods are being used in a client component.
// This might lead to poisoning (exposing sensitive data to the client) so be
// careful when following this pattern. If your methods are server only you can
// use the `server-only` package to prevent poisoning.

const api = {
  readList: {
    // Update read list in local storage
    update: async (readList: Set<Book["ISBN"]>) =>
      localStorage.setItem("readList", JSON.stringify(Array.from(readList))),
    // Suscribe to storage changes
    onChange: (callback: (readList: Set<Book["ISBN"]>) => void) => {
      function updateReadList() {
        // Get new read list from local storage
        const readList = new Set(
          JSON.parse(window.localStorage.getItem("readList") || "[]") as Book["ISBN"][],
        );

        // Run callback with new data
        callback(readList);
      }

      // Listen to storage event for multi window support
      window.addEventListener("storage", updateReadList);

      // Fetch the list on suscription
      updateReadList();

      // Return a function to unsuscribe
      return () => {
        window.removeEventListener("storage", updateReadList);
      };
    },
  },
  book: {
    // Fetch the list of books and extract the Book object from every item
    list: (): Promise<Book[]> =>
      import("./books.json").then((data) => data.default.library.map((item) => item.book)),
  },
};

export default api;
