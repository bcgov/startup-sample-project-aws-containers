import { createContext } from "react";

const GreetingContext = createContext({
  greetingItems: [],
  setGreetingItems: () => {},
  page: 1,
  setPage: () => {},
});

export default GreetingContext;
