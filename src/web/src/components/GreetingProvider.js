import React, { useState, useEffect } from "react";
import GreetingContext from "./GreetingContext";
import axios from "axios";
import { API_BASE_URL } from "../config";

const GreetingProvider = ({ children }) => {
  const [greetingItems, setGreetingItems] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    // Fetch greetings when component mounts
    axios
      .get(`${API_BASE_URL}/api/v1/greeting/latest`)
      .then((response) => {
        const items = response.data.greetingItems;
        if (Array.isArray(items)) {
          setGreetingItems(items);
        } else {
          console.error("Unexpected data format from API:", response.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching greetings:", error);
      });
  }, []);

  return (
    <GreetingContext.Provider
      value={{ greetingItems, setGreetingItems, page, setPage }}
    >
      {children}
    </GreetingContext.Provider>
  );
};

export default GreetingProvider;
