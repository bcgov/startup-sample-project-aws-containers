import React, { useContext, useState } from "react";
import GreetingContext from "./GreetingContext";
import axios from "axios";
import { API_BASE_URL } from "../config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

const GreetingSelector = () => {
  const [selectedGreeting, setSelectedGreeting] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { greetingItems, setGreetingItems, setPage } =
    useContext(GreetingContext);

  const handleGreetingChange = (event) => {
    setSelectedGreeting(event.target.value);
  };

  const handleSendGreeting = () => {
    setIsLoading(true);
    setPage(1);
    axios
      .post(`${API_BASE_URL}/api/v1/greeting`, { greeting: selectedGreeting })
      .then((response) => {
        const newGreetingItem = response.data;
        setGreetingItems([newGreetingItem, ...greetingItems]);
        setSelectedGreeting("");
      })
      .catch((error) => {
        console.error("Error sending greeting:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div class="container">
      <h3>Select your favorite greeting</h3>
      <div class="bc-gov-dropdown-wrapper">
        <FontAwesomeIcon icon={faChevronDown} className="fas fa-chevron-down" />
        <select
          class="bc-gov-dropdown"
          value={selectedGreeting}
          onChange={handleGreetingChange}
        >
          <option disabled value="">
            Select Greeting
          </option>
          <option value="Aloha">Aloha</option>
          <option value="Bonjour">Bonjour</option>
          <option value="Greetings and salutations">
            Greetings and salutations
          </option>
          <option value="Hello">Hello</option>
          <option value="Howdy">Howdy</option>
          <option value="Konichiwa">Konichiwa</option>
        </select>
        <div class="container">
          <button
            class={
              selectedGreeting === ""
                ? "BC-Gov-PrimaryButton-disabled"
                : "BC-Gov-PrimaryButton"
            }
            onClick={handleSendGreeting}
            disabled={isLoading || selectedGreeting === ""}
          >
            {isLoading ? "Sending..." : "Send Greeting"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GreetingSelector;
