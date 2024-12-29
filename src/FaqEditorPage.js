import React, { useState, useEffect } from "react";
import { ref, set, onValue, push, update, remove, off } from "firebase/database";
import { database } from "./firebaseConfig";
import './styles/Chat.css';

const FaqEditorPage = ({ onBack }) => {
  const [faqs, setFaqs] = useState([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [editFaqId, setEditFaqId] = useState(null);

  // Load FAQs from Firebase
  useEffect(() => {
    const faqRef = ref(database, "faq");
    onValue(faqRef, (snapshot) => {
      const data = snapshot.val();
      const loadedFaqs = data
        ? Object.entries(data).map(([id, faq]) => ({ id, ...faq }))
        : [];
      setFaqs(loadedFaqs);
    });

    return () => off(faqRef); // Correctly use 'off' to detach listeners
  }, []);

  // Add or Edit FAQ
  const handleFaqSubmit = async (e) => {
    e.preventDefault();
    if (!newQuestion || !newAnswer) return;

    const faqData = {
      question: newQuestion,
      answer: newAnswer,
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
    } catch (error) {
      console.error("Error saving FAQ:", error);
    }
  };

  // Edit FAQ
  const handleEditFaq = (faq) => {
    setEditFaqId(faq.id);
    setNewQuestion(faq.question);
    setNewAnswer(faq.answer);
  };

  // Delete FAQ
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
        <h1>FAQ Editor</h1>
        <button onClick={onBack} className="hamburger-button">Back to Admin Page</button>
      </div>

      <div className="main-content">
        <form onSubmit={handleFaqSubmit} className="faq-form">
          <div className="add-category">
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
            <button type="submit">{editFaqId ? "Update FAQ" : "Add FAQ"}</button>
          </div>
        </form>

        <div className="faq-list">
          {faqs.map((faq) => (
            <div key={faq.id} className="faq-item">
              <p>
                <strong>Q:</strong> {faq.question}
                <br />
                <strong>A:</strong> {faq.answer}
              </p>
              <div className="editor-buttons">
                <button onClick={() => handleEditFaq(faq)} className="edit-button">Edit</button>
                <button onClick={() => handleDeleteFaq(faq.id)} className="delete-button">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FaqEditorPage;
