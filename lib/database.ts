import Datastore from "@seald-io/nedb";

const useNewsStore = new Datastore({
  filename: "./database/news.db",
  autoload: true
});

export { useNewsStore };