import React, { useState, useEffect } from "react";
import { ref, onValue, off } from "firebase/database";
import { database } from "../firebaseConfig";
import FAQItem from './FAQItem';
import '../styles/FAQ.css';

const FaqList = () => {
  const [faqs, setFaqs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    const faqRef = ref(database, "faq");
    const categoryRef = ref(database, "categories");

    onValue(faqRef, (snapshot) => {
      const data = snapshot.val();
      const loadedFaqs = data
        ? Object.entries(data).map(([id, faq]) => ({ id, ...faq }))
        : [];
      setFaqs(loadedFaqs);
    });

    onValue(categoryRef, (snapshot) => {
      const data = snapshot.val();
      const loadedCategories = data
        ? Object.entries(data).map(([id, category]) => ({ id, ...category }))
        : [];
      setCategories(loadedCategories);
      if (loadedCategories.length > 0) {
        setActiveCategory(loadedCategories[0].id); // Default to the first category
      }
    });

    return () => {
      off(faqRef);
      off(categoryRef);
    };
  }, []);

  const handleCategoryClick = (categoryId) => {
    setActiveCategory(categoryId);
  };

  const filteredFaqs = faqs.filter((faq) => faq.categoryId === activeCategory);

  return (
    <div className="faq-page">
      <div className="faq-container">
        {/* Category Bar */}
        <div className="category-bar">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`category-button ${activeCategory === category.id ? 'active' : ''}`}
              onClick={() => handleCategoryClick(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* FAQ List */}
        <div className="faq-list">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq) => (
              <FAQItem
                key={faq.id}
                question={faq.question}
                answer={faq.answer}
              />
            ))
          ) : (
            <p>No FAQs available for this category.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FaqList;
