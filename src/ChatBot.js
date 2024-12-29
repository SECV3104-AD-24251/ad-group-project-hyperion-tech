import React, { useEffect } from 'react';
import { Webchat } from '@botpress/webchat'; // Import Webchat from Botpress

const ChatBot = () => {
  useEffect(() => {
    // Initialize Botpress Webchat once the component is mounted
    Webchat.init({
      botId: 'your-bot-id', // Replace with your Botpress bot ID
      host: 'https://webhook.botpress.cloud/2fd996b0-f5c2-4700-a2f9-1f2015831fc8', 
    });
  }, []); // Empty dependency array ensures this only runs once

  return <div id="chatbot-container"></div>;
};

export default ChatBot;