import dynamic from "next/dynamic";

import api from "@/api";

import loading from "./loading";

const DynamicHomeClient = dynamic(() => import("./client"), {
  ssr: false,
  loading,
});

export default async function Home() {
  const books = await api.books.list();

  return <DynamicHomeClient books={books} />;
}
