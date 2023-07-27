"use client";

import type {Book} from "@/types";

import {useEffect, useMemo, useState} from "react";

import api from "@/api";

// I have mixed feelings about all the logic being present in this file.
// But given that is not being used anywhere else, I think is fine.
//
// I tend to preffer not having much files to prevent context switching
// but this case is borderline between being too much and not enough.

export default function HomeClient({books}: {books: Book[]}) {
  const [readList, setReadList] = useState<Set<Book["ISBN"]>>(() => new Set());
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
  }, [readList, view, books]);
  const matches = useMemo(() => {
    // Early return if a book doesn't match the list or genre filters, return true otherwise
    return books.filter((book) => {
      if (view === "readlist" && !readList.has(book.ISBN)) return false;
      if (genre && book.genre !== genre) return false;

      return true;
    });
  }, [genre, readList, view, books]);

  function handleToggleFromReadList(book: Book) {
    // Create a draft of the read list to prevent state mutations
    const draft = structuredClone(readList);

    // Toggle the book from the read list
    if (draft.has(book.ISBN)) {
      draft.delete(book.ISBN);
    } else {
      draft.add(book.ISBN);
    }

    // Update the read list on origin
    api.readList.update(draft);

    // Set the new draft on state
    setReadList(draft);
  }

  useEffect(() => {
    // Suscribe to read list changes
    const unsuscribe = api.readList.onChange(setReadList);

    return () => {
      // Remove the event listener when the component unmounts
      unsuscribe();
    };
  }, []);

  return (
    <article className="grid w-full gap-4">
      <nav className="sticky top-0 bg-[Canvas] py-2">
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
        <section className="grid w-full grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-8">
          {matches.map((book) => (
            <div
              key={book.ISBN}
              className="grid cursor-pointer grid-rows-[auto,1fr] gap-4"
              onClick={() => handleToggleFromReadList(book)}
            >
              <img
                alt={book.title}
                className="aspect-[9/14] w-full rounded-md bg-gray-800 object-cover shadow-xl"
                src={book.cover}
              />
              <div className="grid content-start gap-2">
                <p className="text-xl font-medium">
                  {readList.has(book.ISBN) && <span>⭐</span>} {book.title}
                </p>
                <p className="text-md line-clamp-3 opacity-80">{book.synopsis}</p>
              </div>
            </div>
          ))}
        </section>
      ) : (
        <p className="w-full py-8 text-center opacity-50">No hay resultados</p>
      )}
    </article>
  );
}
