import { ref, set } from "firebase/database";
import { database } from "../firebaseConfig";

export const faqData = [
    {
      question: "How do I submit an amendment request?",
      answer: "You can submit amendment requests through the UTM portal at https://my.utm.my/. Log in with your credentials and navigate to the 'Amendment Requests' section."
    },
    {
      question: "What are the Faculty's office hours?",
      answer: "The Faculty of Computing office is open Monday through Friday, 8:00 AM to 5:00 PM. The office is closed on weekends and public holidays."
    },
    {
      question: "How can I contact my academic advisor?",
      answer: "You can find your academic advisor's contact information in the UTM portal under 'Academic Information'. Most advisors can be reached via their UTM email or during their posted office hours."
    },
    {
      question: "Where can I find my class schedule?",
      answer: "Your class schedule is available in the UTM portal (https://my.utm.my/). After logging in, go to the 'Academic' section and select 'Class Schedule'."
    }
  ];

  const uploadFAQData = async () => {
    const faqRef = ref(database, "faq"); // Create a reference to 'faq' node
    await set(faqRef, faqData);
    console.log("FAQ data uploaded successfully!");
};

// Call the function
uploadFAQData();