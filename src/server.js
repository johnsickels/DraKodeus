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

const port = PORT || 4000;

const htmlRoutes = require("./routes/html-routes");
const apiRoutes = require("./routes/api-routes");
app.use(htmlRoutes);
app.use(apiRoutes);

app.listen(port, () => {
  console.log(`Server started at localhost:${port}`);
});
