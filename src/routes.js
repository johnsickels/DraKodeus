const express = require("express");
const router = express.Router();
const needle = require("needle");

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
  console.log(query);
  // needle.get(
  //   `https://api.stackexchange.com/2.2/search/advanced?order=desc&sort=activity&q=${query}&site=stackoverflow`,
  //   options,
  //   function (error, response) {
  //     if (!error && response.statusCode == 200) {
  //       // console.log(response.body.items);
  //       let text = "";
  //       for (i = 0; i < 5; i++) {
  //         //   console.log(
  //         //     response.body.items[i].title + "\n" + response.body.items[i].link
  //         //   );
  //         text +=
  //           response.body.items[i].title +
  //           "\n" +
  //           response.body.items[i].link +
  //           "\n";
  //       }
  //       return res.json({
  //         response_type: "in_channel",
  //         text: text,
  //       });
  //     }
  //   }
  // );
  res.json({
    response_type: "in_channel",
    text: "Questions from Stack Overflow",
  });
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

router.get("/", (req, res) => {
  console.log(req);
  return res.send("Hello World GET");
});

module.exports = router;
