import React, { useState, useEffect } from "react";
import { ref, set, onValue, push, update, remove, off } from "firebase/database";
import { database } from "./firebaseConfig";
import './styles/Chat.css';
import './styles/Cate.css';

const FaqEditorPage = ({ onBack }) => {
  const [faqs, setFaqs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [editFaqId, setEditFaqId] = useState(null);

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
    });

    return () => {
      off(faqRef);
      off(categoryRef);
    };
  }, []);

  const handleFaqSubmit = async (e) => {
    e.preventDefault();
    if (!newQuestion || !newAnswer || !selectedCategory) return;

    const faqData = {
      question: newQuestion,
      answer: newAnswer,
      categoryId: selectedCategory,
    };

    try {
      if (editFaqId) {
        await update(ref(database, `faq/${editFaqId}`), faqData);
        setEditFaqId(null);
      } else {
        const newFaqRef = push(ref(database, "faq"));
        await set(newFaqRef, faqData);
      }
      setNewQuestion("");
      setNewAnswer("");
      setSelectedCategory("");
    } catch (error) {
      console.error("Error saving FAQ:", error);
    }
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    if (!newCategory) return;

    const categoryData = { name: newCategory };

    try {
      const newCategoryRef = push(ref(database, "categories"));
      await set(newCategoryRef, categoryData);
      setNewCategory("");
    } catch (error) {
      console.error("Error saving category:", error);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      await remove(ref(database, `categories/${categoryId}`));
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const handleEditFaq = (faq) => {
    setEditFaqId(faq.id);
    setNewQuestion(faq.question);
    setNewAnswer(faq.answer);
    setSelectedCategory(faq.categoryId);
  };

  const handleDeleteFaq = async (faqId) => {
    try {
      await remove(ref(database, `faq/${faqId}`));
    } catch (error) {
      console.error("Error deleting FAQ:", error);
    }
  };

  return (
    <div className="faq-editor-page">
      <div className="top-bar">
        <h1> Category </h1>
        <button onClick={onBack} className="hamburger-button">Back to Admin Page</button>
      </div>

      <div className="main-content">
        {/* Add Category Section */}
        <form onSubmit={handleCategorySubmit} className="category-form">
          <h2>Add New Category</h2>
          <div className="add-category">
            <input
              type="text"
              placeholder="Enter category name"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
            <button type="submit">Add Category</button>
          </div>
        </form>

        {/* List Categories in Table Format */}
        <div className="category-list">
          <h2>Categories</h2>
          <table className="styled-table">
            <thead>
              <tr>
                <th>Category Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id}>
                  <td>{category.name}</td>
                  <td>
                    <button onClick={() => handleDeleteCategory(category.id)} className="delete-button">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* FAQ Form */}
        <form onSubmit={handleFaqSubmit} className="faq-form">
          <h2>{editFaqId ? "Edit FAQ" : "Add FAQ"}</h2>
          <div className="faq-form-group">
            <input
              type="text"
              placeholder="Question"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              className="faq-input"
            />
            <input
              type="text"
              placeholder="Answer"
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
              className="faq-input"
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="faq-input"
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <button type="submit">{editFaqId ? "Update FAQ" : "Add FAQ"}</button>
          </div>
        </form>

        {/* FAQ List */}
        <div className="faq-list">
          <h2>FAQs</h2>
          <table className="styled-table">
            <thead>
              <tr>
                <th>Question</th>
                <th>Answer</th>
                <th>Category</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {faqs.map((faq) => (
                <tr key={faq.id}>
                  <td>{faq.question}</td>
                  <td>{faq.answer}</td>
                  <td>{categories.find((cat) => cat.id === faq.categoryId)?.name || "Uncategorized"}</td>
                  <td>
                    <button onClick={() => handleEditFaq(faq)} className="edit-button">Edit</button>
                    <button onClick={() => handleDeleteFaq(faq.id)} className="delete-button">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FaqEditorPage;
