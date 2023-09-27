import React, { useContext } from "react";
import GreetingContext from "./GreetingContext";

const PAGE_SIZE = 10;

const GreetingList = () => {
  const { greetingItems, page, setPage } = useContext(GreetingContext);

  if (!greetingItems || !Array.isArray(greetingItems)) {
    return <div>No greetings available.</div>;
  }

  const sortedGreetings = [...greetingItems].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const startIndex = (page - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const pageGreetings = sortedGreetings.slice(startIndex, endIndex);

  const totalPages = Math.ceil(sortedGreetings.length / PAGE_SIZE);

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  return (
    <div class="container">
      <h3>Previous greeting selections</h3>
      <ul>
        {pageGreetings.map((item) => (
          <li key={item.id}>
            <span>{new Date(item.createdAt).toLocaleString()} - </span>
            {item.greeting}
          </li>
        ))}
      </ul>
      <div className="pagination">
        <button class="BC-Gov-SecondaryButton" onClick={handlePrevPage}>
          Prev Page
        </button>
        <button class="BC-Gov-SecondaryButton" onClick={handleNextPage}>
          Next Page
        </button>
      </div>
    </div>
  );
};

export default GreetingList;
