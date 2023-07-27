import api from "@/api";

import HomeClient from "./client";

// This is a server component that takes care of fetching the books from the API
// and passing them to the client component. As the rest of the data depends
// on browser APIs we have to fetch the rest in there.
//
// At this point might be possible to move this fetch to the client but might
// not be the case if we move the data to an external service.

export default async function Home() {
  const books = await api.book.list();

  return <HomeClient books={books} />;
}
