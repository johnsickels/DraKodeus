const Express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = new Express();
app.use(bodyParser.urlencoded({ extended: true }));

const { SLACK_TOKEN: slackToken, PORT } = process.env;

if (!slackToken) {
  console.error("missing environment variable SLACK_TOKEN");
  process.exit(1);
}

const port = PORT || 80;

app.post("/", (req, res) => {
  console.log(req);
  return res.json({
    response_type: "in_channel",
    text: "Feed me",
    attachments: [
      {
        text: "Wilson memes",
      },
    ],
  });
});

app.get("/", (req, res) => {
  console.log(req);
  return res.send("Hello World GET");
});

app.listen(port, () => {
  console.log(`Server started at localhost:${port}`);
});
