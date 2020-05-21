const fetch = require("node-fetch");

const verifyFacebook = (req, res, next) => {
  if (req.body.accessToken) {
    fetch(
      `https://graph.facebook.com/me?access_token=${req.body.accessToken}`,
      {
        method: "POST",
      }
    )
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          next();
        } else {
          res.json({ error: "incorect acccess token" });
        }
      });
  } else {
    res.json({ error: "no access token" });
  }
};

module.exports = verifyFacebook;