import React, { useState, useEffect } from 'react';
import FAQItem from './FAQItem';
import { ref, get } from "firebase/database";
import { database } from '../firebaseConfig'; // Ensure this points to your Firebase configuration

const FAQList = () => {
  const [faqs, setFaqs] = useState([]); // State to hold FAQ data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    const fetchFAQData = async () => {
      try {
        const faqRef = ref(database, 'faq'); // Reference to the 'faq' node
        const snapshot = await get(faqRef);

        if (snapshot.exists()) {
          setFaqs(snapshot.val());
        } else {
          console.log("No FAQ data available!");
          setFaqs([]); // Set an empty array if no data exists
        }
      } catch (err) {
        console.error("Error fetching FAQ data:", err);
        setError("Failed to load FAQs. Please try again later.");
      } finally {
        setLoading(false); // Stop loading spinner
      }
    };

    fetchFAQData();
  }, []); // Empty dependency array ensures this runs once when the component mounts

  if (loading) {
    return <div>Loading FAQs...</div>; // Show a loading message
  }

  if (error) {
    return <div>{error}</div>; // Show an error message if there's an issue
  }

  return (
    <div className="faq-list">
      {faqs.map((faq, index) => (
        <FAQItem
          key={index}
          question={faq.question}
          answer={faq.answer}
        />
      ))}
    </div>
  );
};

export default FAQList;
