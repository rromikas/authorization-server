const fetch = require("node-fetch");

const verifyGoogle = (req, res, next) => {
  if (req.body.accessToken) {
    fetch(
      `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${req.body.accessToken}`,
      {
        method: "POST",
      }
    )
      .then((res) => res.json())
      .then((res) => {
        if (res.error) {
          res.json({ error: "incorect google acccess token" });
        } else {
          next();
        }
      });
  } else {
    res.json({ error: "no access token" });
  }
};

module.exports = verifyGoogle;