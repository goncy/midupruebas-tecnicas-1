"use client";

import {useEffect, useMemo, useState} from "react";

import {library} from "../books.json";

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
    fetch: (): Set<Book["ISBN"]> =>
      new Set(JSON.parse(window.localStorage.getItem("readList") || "[]") as Book["ISBN"][]),
    // Update read list in local storage
    update: (readList: Set<Book["ISBN"]>) =>
      localStorage.setItem("readList", JSON.stringify(Array.from(readList))),
  },
};

export default function Home() {
  const [readList, setReadList] = useState<Set<Book["ISBN"]>>(api.readList.fetch);
  const [genre, setGenre] = useState<string>("");
  const [view, setView] = useState<"available" | "readlist">("available");
  const genres = useMemo(() => {
    // Create a map to store the genres and their count
    const map = new Map<string, number>();

    for (const book of books) {
      // If the genre is not in the map, add it with a count of 0
      if (!map.has(book.genre)) map.set(book.genre, 0);

      // If the filter is set to readlist and the book is not in the readlist, skip it
      if (view === "readlist" && !readList.has(book.ISBN)) continue;

      map.set(book.genre, map.get(book.genre)! + 1);
    }

    // Convert the map to an array of objects with label and count
    return Array.from(map.entries()).map(([label, count]) => ({label, count}));
  }, [readList, view]);
  const matches = useMemo(() => {
    // Early return if a book doesn't match the list or genre filters, return true otherwise
    return books.filter((book) => {
      if (view === "readlist" && !readList.has(book.ISBN)) return false;
      if (genre && book.genre !== genre) return false;

      return true;
    });
  }, [genre, readList, view]);

  function handleToggleFromReadList(book: Book) {
    const draft = structuredClone(readList);

    if (draft.has(book.ISBN)) {
      draft.delete(book.ISBN);
    } else {
      draft.add(book.ISBN);
    }

    setReadList(draft);
  }

  useEffect(() => {
    api.readList.update(readList);
  }, [readList]);

  return (
    <article className="grid w-full gap-4">
      <nav>
        <ul className="inline-flex gap-4">
          <li>
            <select
              value={view}
              onChange={(event) => setView(event.target.value as "available" | "readlist")}
            >
              <option value="available">Disponibles ({books.length})</option>
              <option value="readlist">Lista de lectura ({readList.size})</option>
            </select>
          </li>
          <li>
            <select value={genre} onChange={(event) => setGenre(event.target.value)}>
              <option value="">Todos</option>
              {genres.map(({label, count}) => (
                <option key={label} value={label}>
                  {label} ({count})
                </option>
              ))}
            </select>
          </li>
        </ul>
      </nav>
      {matches.length ? (
        <section className="grid w-full grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4">
          {matches.map((book) => (
            <div
              key={book.ISBN}
              className="grid cursor-pointer grid-rows-[auto,1fr] gap-4"
              onClick={() => handleToggleFromReadList(book)}
            >
              <img
                alt={book.title}
                className="aspect-[9/14] w-full bg-gray-800 object-cover"
                src={book.cover}
              />
              <p className="text-xl">
                {readList.has(book.ISBN) && <span>✦</span>} {book.title}
              </p>
            </div>
          ))}
        </section>
      ) : (
        <p className="w-full py-8 text-center opacity-50">No hay resultados</p>
      )}
    </article>
  );
}
