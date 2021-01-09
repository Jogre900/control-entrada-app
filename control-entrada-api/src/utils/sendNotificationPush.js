const ONESIGNAL_REST_API_KEY = process.env.ONESIGNAL_REST_API_KEY;
const ONESIGNAL_APP_ID = process.env.ONESIGNAL_APP_ID;

const HeadersNotification = {
  "Content-Type": "application/json; charset=utf-8",
  Authorization: "Basic " + ONESIGNAL_REST_API_KEY
};

const OptionsNotification = {
  host: "onesignal.com",
  port: 443,
  path: "/api/v1/notifications",
  method: "POST",
  headers: HeadersNotification
};

export const sendNotificationTest = async function(data) {
  data.app_id = ONESIGNAL_APP_ID;
  let resPush = null;

  let promisehttps = new Promise((resolve, reject) => {
    var https = require("https");
    var req = https.request(OptionsNotification, function(res) {
      res.on("data", function(data) {
        let newResp = JSON.parse(data);
        console.log("Response:");
        console.log(newResp);
        resPush = true;
        if (newResp.id == "") resPush = false;
        if (newResp.recipients == 0) resPush = false;
      });
      res.on("end", () => {
        console.log(resPush);
        resolve(JSON.parse(resPush));
      });
    });

    req.on("error", function(e) {
      console.log("ERROR:");
      console.log(e);
    });

    req.write(JSON.stringify(data));
    req.end();
  });

  return await promisehttps;
};
