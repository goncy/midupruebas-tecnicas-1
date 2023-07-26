"use client";

import {useSnapshot} from "valtio";

import {setGenreFilter, state, toggleFromReadList, toggleListFilter} from "@/state";

export default function Home() {
  const {books, matches, filters, readList, genres} = useSnapshot(state);

  return (
    <article className="grid w-full gap-8">
      <section className="grid gap-4">
        <h2 className="text-2xl font-bold">Libros disponibles</h2>
        <nav>
          <ul className="inline-flex gap-4">
            <li>
              <select
                value={filters.list}
                onChange={(event) =>
                  toggleListFilter(event.target.value as "available" | "readlist")
                }
              >
                <option value="available">Disponibles ({books.length})</option>
                <option value="readlist">Lista de lectura ({readList.size})</option>
              </select>
            </li>
            <li>
              <select
                value={filters.genre}
                onChange={(event) => setGenreFilter(event.target.value)}
              >
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
      </section>
      <section className="grid w-full grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4">
        {matches.map((book) => (
          <div
            key={book.ISBN}
            className="grid cursor-pointer grid-rows-[auto,1fr] gap-4"
            onClick={() => toggleFromReadList(book)}
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
    </article>
  );
}
