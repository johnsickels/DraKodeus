const express = require("express");
const router = express.Router();
const needle = require("needle");
const he = require("he");

const options = {
  compressed: true,
  accept: "application/json",
  content_type: "application/json",
};

router.post("/api/wilsonify", (req, res) => {
  const text = req.body.text || "I know nada about any of that.";
  needle.post(
    `https://api.imgflip.com/caption_image?template_id=175540452&username=JohnSickels&password=test123&text0=${text}`,
    "",
    options,
    function (error, response) {
      if (!error && response.statusCode == 200) {
        return res.json({
          response_type: "in_channel",
          delete_original: "true",
          text: "Here's your Wilson meme",
          attachments: [
            {
              type: "image",
              image_url: response.body.data.url,
              alt_text: "Memeified with /wilsonfy",
            },
          ],
        });
      }
    }
  );
});

// https://api.stackexchange.com/2.2/search?order=desc&sort=activity&intitle=length%20of%20an%20object&site=stackoverflow
router.post("/api/overflow", (req, res) => {
  const query = req.body.text || "what is truthy and falsey";
  // what is the difference between == and === in javascript?
  //   console.log(query);
  needle.get(
    // /2.2/similar?order=desc&sort=relevance&title=In javascript what is the difference between let and var ?&site=stackoverflow
    `https://api.stackexchange.com/2.2/similar?order=desc&sort=relevance&title=${query}&site=stackoverflow`,
    options,
    function (error, response) {
      if (!error && response.statusCode == 200) {
        // console.log(response.body.items[0]);
        let arr = [];

        for (i = 0; i < 5; i++) {
          const res = response.body.items[i];

          let obj = {
            type: "section",
            text: {
              type: "mrkdwn",
              text: "",
            },
          };

          obj.text.text += `:question: *${he.decode(res.title)}*\n`;
          obj.text.text += `:link: ${res.link}\n`;
          if (res.answer_count > 4) {
            obj.text.text += ":star::star::star::star::star:";
          } else {
            for (j = 0; j < res.answer_count; j++) {
              obj.text.text += ":star:";
            }
          }
          obj.text.text += ` Answers: ${res.answer_count}\n\n`;

          arr.push(obj);
          if (i < 4) {
            arr.push({
              type: "divider",
            });
          }
        }

        console.log(arr);

        return res.json({
          response_type: "in_channel",
          text: arr,
        });
      }
    }
  );
});

router.post("/api/humor", (req, res) => {
  needle.get(
    "https://www.reddit.com/r/programmerhumor/top/.json?count=20",
    options,
    function (error, response) {
      if (!error && response.statusCode == 200) {
        const random = Math.floor(Math.random() * 20);
        const title = response.body.data.children[random].data.title;
        const url = response.body.data.children[random].data.url;

        return res.json({
          response_type: "in_channel",
          delete_original: "true",
          text: title,
          attachments: [
            {
              type: "image",
              image_url: url,
              alt_text: "Deilvered from r/programmerhumor",
            },
          ],
        });
      }
    }
  );
});

router.post("/api/test", (req, res) => {
  needle.post("https://en3ah8idfuhjm.x.pipedream.net", "", options, function (
    error,
    response
  ) {
    if (!error && response.statusCode == 200) {
      return res.json({
        response_type: "in_channel",
        text: JSON.stringify(req.body),
      });
    }
  });
});

module.exports = router;
