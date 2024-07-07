
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const messagesContainer = document.querySelector('.messages-container');

const config = require('./config');
const apiKey = config.openaiApiKey;


function sendMessage(message) {
  const url = 'https://api.openai.com/v1/chat/completions'; 
  const previousMessage = messagesContainer.querySelector('.bot-message')?.textContent; 

  const data = {
    model: 'gpt-3.5-turbo', 
    messages: [
      ...(previousMessage ? [{ role: 'system', content: previousMessage }] : []), 
      {
        role: 'user',
        content: message,
      },
    ],
  };

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify(data),
  };

  fetch(url, options)
    .then(response => response.json())
    .then(data => {
      for (const choice of data.choices) {
        
        const responseMessage = choice.message.content || "Não recebi resposta do bot."; 

        addMessage('bot', responseMessage);
      }
    })
    .catch(error => {
      console.error('Erro na requisição:', error);
    });
}


function addMessage(sender, message) {
  const messageElement = document.createElement('div');
  messageElement.classList.add('message');

  if (sender === 'user') {
    messageElement.classList.add('user-message');
  } else {
    messageElement.classList.add('bot-message');
  }

  
  
  messageElement.innerHTML = `<b>${sender}:</b> ${message.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/&/g, '&amp;')}`;

  messagesContainer.appendChild(messageElement);
}


sendButton.addEventListener('click', () => {
  const message = messageInput.value;
  if (message.trim()) {
    addMessage('user', message);
    sendMessage(message);
    messageInput.value = '';
  }
});


messageInput.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    sendButton.click();
  }
});
