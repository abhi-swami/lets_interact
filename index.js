
// const express = require('express');
// const axios = require('axios');

// const app = express();
// const port = 3000; // Change the port number if needed

// // Middleware for parsing JSON in request bodies
// app.use(express.json());

// // Define a route for handling POST requests to /chat
// app.post('/chat', async (req, res) => {
//   try {
//     // Retrieve the message from the request body
//   const message = req.body.message;
//     console.log(message);
//     // Make a request to the GPT model API with the message
//     const response = await axios.post('https://api.openai.com/v1/engines/davinci-codex/completions', {
//       prompt: `${message}`,
//       max_tokens: 50
//     }, {
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': 'Bearer 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', // Replace with your OpenAI API key
//       },
//     });

//     // Extract the generated reply from the API response
//     const reply = response.data.choices[0].text.trim().split('\n');
//     console.log(reply);
//     // Send the reply back as the response
//     res.json({ reply });
//   } catch (error) {
//     console.error('Error:', error.message);
//     res.status(500).json({ error: 'An error occurred' });
//   }
// });

// // Start the server
// const server=app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });

// process.stdin.resume();
// process.stdin.setEncoding('utf8');

// console.log('Enter your message (press Ctrl+C to exit):');

// process.stdin.on('data', async (message) => {
//   try {
//     // Remove newlines and trailing spaces from the message
//     message = message.trim();

//     // Make a request to the server with the message
//     const response = await axios.post(`http://localhost:${port}/chat`, { message });

//     // Extract the reply from the response
//     const reply = response.data.reply;

//     // Display the reply in the CLI
//     console.log('Bot:', reply.join(''));
//   } catch (error) {
//     console.error('Error:', error.message);
//   }
// });

// // Gracefully shutdown the server on process termination
// process.on('SIGINT', () => {
//   console.log('Shutting down server...');
//   server.close(() => {
//     console.log('Server stopped.');
//     process.exit();
//   });
// });



const { Configuration, OpenAIApi } = require("openai");
const readlineSync = require("readline-sync");
require("dotenv").config();

(async () => {
  const configuration = new Configuration({
    apiKey: "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",
  });
  const openai = new OpenAIApi(configuration);

  const history = [];

  while (true) {
    const user_input = readlineSync.question("Your input: ");

    let messages = history.map(([input_text, completion_text]) => [
      { role: "user", content: input_text },
      { role: "assistant", content: completion_text }
    ]).flat();

    messages.push({ role: "user", content: user_input });

    try {
      const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: messages,
      });

      const completion_text = completion.data.choices[0].message.content;
      console.log(completion_text);

      const user_input_again = readlineSync.question(
        "\nWould you like to continue the conversation? (Y/N)"
      );
      if (user_input_again.toUpperCase() === "N") {
        return;
      } else if (user_input_again.toUpperCase() !== "Y") {
        console.log("Invalid input. Please enter 'Y' or 'N'.");
        return;
      }

      history.push([user_input, completion_text]);
    } catch (error) {
      if (error.response) {
        console.log(error.response.status);
        console.log(error.response.data);
      } else {
        console.log(error.message);
      }
    }
  }
})();
