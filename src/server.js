const Express = require("express");
const bodyParser = require("body-parser");

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
  return res.send("Hello World");
});

app.listen(port, () => {
  console.log(`Server started at localhost:${port}`);
});
