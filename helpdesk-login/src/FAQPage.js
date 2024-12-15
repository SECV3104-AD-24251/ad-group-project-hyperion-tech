import React from 'react';
import FAQHeader from './components/FAQHeader';
import FAQList from './components/FAQList';
import BackButton from './components/BackButton';
import { faqData } from './data/faqData';
import './styles/FAQ.css';

const FAQPage = ({ onBack }) => {
  return (
    <div className="faq-container">
      <BackButton onClick={onBack} />
      <FAQHeader />
      <FAQList /> {/*faqs={faqData} removed*/}
    </div>
  );
};

export default FAQPage;