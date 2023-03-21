const express = require("express");
const Joi = require("joi");
const router = express.Router();
const args = process.argv;
const puppeteer = require("puppeteer-extra");
const fs = require("fs");
const stealthPluggin = require("puppeteer-extra-plugin-stealth");
const axios = require("axios");
const cheerio = require("cheerio");

/* 

API ENDPOINT FOR SENDING EMAILS FOR CONVERSION

ENDPOINT: http://{YOUR DOMAIN HERE}/sendemails

BODY EXAMPLE: { emails: ["ahmed@gmail.com", "bilal@gmail.com"] }

CONSTRAINTS: Must be an array, empty array not acceptable, only "emails" key allowed.

VALIDATION: The validation is done through JOI

*/

router.post("/sendemails", async (req, res) => {
  //Performing validation
  const { error } = validateRequests(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //Setting emails for conversion.
  let emails = req.body.emails;

  puppeteer.use(stealthPluggin());
  // const AdblockerPlugin = require("puppeteer-extra-plugin-adblocker");
  // puppeteer.use(AdblockerPlugin({ blockTrackers: true }));

  let page;

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  const pupFunc = async () => {
    let verifiedPeopleChip = [];
    // That's it, the rest is puppeteer usage as normal
    const browser = await puppeteer.launch({
      headless: false,
      slowMo: 30,
      args: [
        "--blink-setting=imagesEnabled=false", //DIsables Images
        "--no-sandbox",
      ],
    });
    const newPage = await browser.newPage();
    const page = await browser.newPage();
    await page.goto("https://sheets.new/");
    await page.waitForSelector('input[type="email"]');
    await page.type('input[type="email"]', "EMAIL"); // Email login
    await page.click("#identifierNext");
    console.log("EMAIL ENTERED");
    await page.waitForSelector('input[type="password"]', { visible: true });
    await page.type('input[type="password"]', "PASSWORD"); // Password login
    console.log("PASSWORD ENTERED");
    await page.waitForSelector("#passwordNext", { visible: true });
    try {
      await Promise.all([
        page.click("#passwordNext"),
        page.waitForNavigation({ waitUntil: "networkidle2" }),
        page.waitForSelector("div.cell-input"),
      ]);
    } catch {}
    await page.waitForTimeout(3000);

    for (let i = 0; i < emails.length; i++) {
      // await Promise.all([
      await page.type(
        "#t-formula-bar-input-container > div > div > div.cell-input",
        ` ${emails[i]}`,
        { delay: 100 }
      );
      await page.keyboard.press("Enter");
      // ]);
      await page.waitForTimeout(1000);
    }

    // await page.keyboard.press("Enter");
    // await page.waitForTimeout(1500);
    await page.keyboard.down("Control");

    // await page.keyboard.down("ControlLeft");
    await page.keyboard.down("Space");
    await page.keyboard.down("Space");
    await page.waitForTimeout(1500);

    await page.waitForTimeout("#docs-insert-menu");
    await page.click("#docs-insert-menu");
    await page.waitForTimeout(1500);
    await page.waitForSelector(
      "div.people-chip-menu-item > div.goog-menuitem-content > span.goog-menuitem-label"
    );
    await page.click(
      "div.people-chip-menu-item > div.goog-menuitem-content > span.goog-menuitem-label"
    );
    await page.waitForTimeout(3000);
    const URL = await page.url();
    try {
      await newPage.goto(URL, {
        waitUntil: "networkidle2",
      });
      await newPage.waitForTimeout(3000);
    } catch {}
    // RETURN ALL VALID EMAILS
    try {
      const code1 = await newPage.$x('//script[contains(., "bootstrapData")]');
      const content = await newPage.evaluate((el) => el.innerHTML, code1[0]);

      const modifiedContent = JSON.parse(
        content
          .match(/(bootstrapData).*?(};)/gs)[0]
          .split("=")[1]
          .split(";")[0]
      );
      var data = JSON.parse(modifiedContent["changes"]["firstchunk"][0][1])[3];

      try {
        for (let x of data) {
          if (x[0].hasOwnProperty("30")) {
            verifiedPeopleChip.push(x[0]["30"][0][1][0]["1"][0]["1"]);
          }
        }
        console.log("verifiedPeopleChip" + verifiedPeopleChip);
      } catch (err) {
        console.log("EEEEERRRRR" + err);
      }
    } catch {}
    await browser.close();
    return verifiedPeopleChip;
  };
  try {
    const result = await pupFunc();
    res.status(200).send({ result });
  } catch (err) {
    console.log("EEEEERRRRROOR" + err);
  }
});

//Function for validating body requests.
function validateRequests(requests) {
  const schema = Joi.object({
    emails: Joi.array().items(Joi.string().max(30).min(5)).min(1).required(),
  });

  return schema.validate(requests);
}

module.exports = router;
