const Express = require("express");
const bodyParser = require("body-parser");
const needle = require("needle");
require("dotenv").config();

const app = new Express();
app.use(bodyParser.urlencoded({ extended: true }));

const { SLACK_TOKEN: slackToken, PORT } = process.env;

if (!slackToken) {
  console.error("missing environment variable SLACK_TOKEN");
  process.exit(1);
}

const port = PORT || 80;

const options = {
  compressed: true,
  accept: "application/json",
  content_type: "application/json",
};

app.post("/api/wilsonify", (req, res) => {
  console.log(req);
  needle.post(
    "https://api.imgflip.com/caption_image?template_id=175540452&username=JohnSickels&password=test123&text0=I know nada about any of that.",
    "",
    options,
    function (error, response) {
      if (!error && response.statusCode == 200) {
        console.log(response.body.data.url);
        return res.json({
          response_type: "in_channel",
          text: "Here's your Wilson meme",
          attachments: [
            {
              // type: "image",
              image_url: response.body.data.url,
              // alt_text: "Memeified with /wilsonfy",
            },
          ],
        });
      }
    }
  );
});

app.get("/", (req, res) => {
  console.log(req);
  return res.send("Hello World GET");
});

app.listen(port, () => {
  console.log(`Server started at localhost:${port}`);
});
