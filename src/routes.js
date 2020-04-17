var express = require("express");
var router = express.Router();

const options = {
  compressed: true,
  accept: "application/json",
  content_type: "application/json",
};

router.post("/api/wilsonify", (req, res) => {
  needle.post(
    "https://api.imgflip.com/caption_image?template_id=175540452&username=JohnSickels&password=test123&text0=I know nada about any of that.",
    "",
    options,
    function (error, response) {
      if (!error && response.statusCode == 200) {
        return res.json({
          // response_type: "in_channel",
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

router.post("/api/test", (req, res) => {
  needle.post("https://en3ah8idfuhjm.x.pipedream.net", "", options, function (
    error,
    response
  ) {
    if (!error && response.statusCode == 200) {
      // return req;
      return res.json({
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
