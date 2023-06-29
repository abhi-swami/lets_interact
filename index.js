const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { Configuration, OpenAIApi } = require("openai");

const app = express();

app.use(express.json());
app.use(cors());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

app.get("/", (req, res) => {
  res.send("Home Page");
});
app.post("/story", async (req, res) => {
  const { topic } = req.body;
  console.log(req.body);
  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `Create a funny story on  the  ${topic}  `,
      temperature: 0.8,
      max_tokens: 3000,
      top_p: 1,
      frequency_penalty: 0.5,
      presence_penalty: 0,
    });
    console.log(response.data.choices[0].text);
    res.status(200).send({ mesg: response.data.choices[0].text });
  } catch (error) {
    res.status(400).send({ mesg: error.message });
  }
});

app.listen(process.env.PORT_NUMBER, () => {
  console.log(`Server running on port ${process.env.PORT_NUMBER}`);
});
