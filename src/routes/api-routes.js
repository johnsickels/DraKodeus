const express = require("express");
const router = express.Router();
const needle = require("needle");
const he = require("he");
const firebase = require("firebase");
require("firebase/database");

const options = {
  compressed: true,
  accept: "application/json",
  content_type: "application/json",
};

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyAlfaxBqCHcWQbUvo7CrZabxDPIdyfPa4s",
  authDomain: "sasha-1fe2a.firebaseapp.com",
  databaseURL: "https://sasha-1fe2a.firebaseio.com",
  projectId: "sasha-1fe2a",
  storageBucket: "sasha-1fe2a.appspot.com",
  messagingSenderId: "461301062830",
  appId: "1:461301062830:web:28f240bf0092f0cc66613f",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var database = firebase.database();

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
          text: "Please try your query again",
          blocks: arr,
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

router.post("/api/boil", (req, res) => {
  const text = req.body.text;

  /**
   * If request text is a valid Zoom Personal Meeting ID (ten digit number)
   * Save it to Firebase under their slackID
   */
  if (!text) {
    database
      .ref()
      .orderByChild("slackID")
      .equalTo(req.body.user_id)
      .once("value", (snapshot) => {
        if (snapshot.exists()) {
          const userData = snapshot.val();
          const key = Object.keys(userData)[0];
          const zoomPMID = userData[key].zoomPMID;
          let boil = "/answer xxxx Thanks for `/ask`ing Trilobot!\n\n";
          boil +=
            "I'd like to open a zoom room while I work on a solution. Feel free to join if you'd like to provide more details about your question. There, we can chat for up to 15 minutes.\n\n";
          boil += `https://zoom.us/j/${zoomPMID}\n\n`;
          boil +=
            "In the meantime, I will continue to develop a response and may edit this response shortly.\n\n";
          boil += `- ${req.body.user_name}`;

          return res.json({
            response_type: "ephemeral",
            replace_original: true,
            text: boil,
          });
        } else {
          console.log("user does not exist");
          return res.json({
            response_type: "ephemeral",
            replace_original: true,
            text:
              "Please provide your Zoom Personal Meeting ID. Example: `/boil 1234567890`",
          });
        }
      });
  } else if (text.match(/\d{10}/)) {
    database
      .ref()
      .orderByChild("slackID")
      .equalTo(req.body.user_id)
      .once("value", (snapshot) => {
        if (snapshot.exists()) {
          // rewrite new zoomPMID
          const userData = snapshot.val();
          const key = Object.keys(userData)[0];

          database.ref(key).update({ zoomPMID: text });
          return res.json({
            response_type: "ephemeral",
            replace_original: true,
            text: `Your Zoom PMID has been reset to ${text}. Request again with /boil`,
          });
        } else {
          // write new zoomPMID

          database
            .ref()
            .push({
              name: req.body.user_name,
              slackID: req.body.user_id,
              zoomPMID: text,
            });
          return res.json({
            response_type: "ephemeral",
            replace_original: true,
            text:
              "You are now ready for answer templates. Request again with /boil",
          });
        }
      });
  } else if ((text = "help")) {
    // help here
  } else {
    return res.json({
      response_type: "ephemeral",
      replace_original: true,
      text:
        "Please provide a valid Zoom Personal Meeting ID. Example: `/boil 1234567890`",
    });
  }
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
