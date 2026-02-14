
import "./pre-start";
import { AppDataSource } from "@database/data-source";
import { HtmlEmbedding } from "@database/entity";
import { embedTextJina } from "@utils/vector";
import * as fs from "fs";
import puppeteer  from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import pgvector from "pgvector";
import crypto from "crypto";

import * as cheerio from "cheerio";

const BASE_URL = "https://j7tracker.io"

async function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

async function login(page: any) {
    await page.goto(`${BASE_URL}`, { waitUntil: "networkidle2" });
    // await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle2" });

    // Fill login fields (adjust selectors)
    await page.type('input[id="username"]', "sustangomango_1187968396546019491", { delay: 50 });
    await page.type('input[id="password"]', "JMM0Cy7Z9XnHH2eeTghh", { delay: 50 });
    // Click the Login button
    await delay(10000);
    await page.click('button.login-button');
    console.log("logged in");
    // Wait for navigation or dashboard element to confirm success
    await delay(8000);

    await page.click('.update-modal-footer button');
    await delay(2000);

    // await page.click('.welcome-theme-modal button');
    // await page.evaluate(() => {
    //     const modal = document.querySelector('.welcome-theme-modal');
    //     const okButton = modal?.querySelector('button');
    //     okButton?.click();
    //   });

    await page.click('div[style="display: flex; justify-content: center;"] button');




    console.log("✅ Logged in successfully");

    // Save cookies for next run
    
}

// ======================================================
// MAIN EXECUTION
// ======================================================
(async () => {
    puppeteer.use(StealthPlugin());
    const launchOptions = {
      headless: false, // Set to false if you want to see the browser UI
      ignoreHTTPSErrors: true, // This option resolves the certificate error
      // Optional: Add arguments for stability in different environments like Docker
      args: ['--disable-setuid-sandbox', '--no-sandbox'], 
    };
  
    const browser = await puppeteer.launch(launchOptions);
    const page = await browser.newPage();
  

    await page.goto(`${BASE_URL}`, { waitUntil: "networkidle2" });

    await login(page);

    const tweets = await page.evaluate(() => {
        const formatTweet = (el: Element) => {
          const typeClasses = el.className.split(" ").filter(Boolean);
      
          const getText = (selector: string) =>
            el.querySelector(selector)?.textContent?.trim() || null;
      
          const getAttr = (selector: string, attr: string) =>
            el.querySelector(selector)?.getAttribute(attr) || null;
      
          const getAllImages = (selector: string) =>
            Array.from(el.querySelectorAll(selector)).map(img =>
              img.getAttribute("src")
            );
      
          // Detect type
          let type = "post";
          if (typeClasses.includes("retweet")) type = "retweet";
          if (typeClasses.includes("reply")) type = "reply";
          if (typeClasses.includes("quote")) type = "quote";
      
          return {
            type,
      
            author: {
              name: getText(".tweet-author .name"),
              username: getText(".tweet-author .username"),
              profileImage: getAttr(".tweet-author img.profile-image", "src"),
              verified: !!el.querySelector(".verified-badge"),
              business: !!el.querySelector(".business-badge"),
              affiliate: !!el.querySelector(".affiliate-badge"),
              followers: getText(".follower-count-badge span:last-child")
            },
      
            timestamp: {
              full: getText(".time-full"),
              short: getText(".time-short")
            },
      
            content: getText(".tweet-content > div > .tweet-content"),
      
            media: getAllImages(".tweet-media img.media-image"),
      
            quotedTweet: el.querySelector(".quoted-tweet")
              ? {
                  author: {
                    name: getText(".quoted-tweet .quoted-author strong"),
                    username: getText(".quoted-tweet .quoted-username")
                  },
                  content: getText(".quoted-tweet-content"),
                  media: getAllImages(".quoted-tweet img.media-image")
                }
              : null,
      
            // ✅ Added reply-to-tweet support
            replyToTweet: el.querySelector(".reply-to-tweet")
              ? {
                  author: {
                    name: el.querySelector(".reply-to-tweet .tweet-author .name")?.textContent?.trim() || null,
                    username: el.querySelector(".reply-to-tweet .tweet-author .username")?.textContent?.trim() || null,
                    profileImage:
                      el.querySelector(".reply-to-tweet img.profile-image-small")?.getAttribute("src") || null,
                    business: !!el.querySelector(".reply-to-tweet [aria-label='Business account']")
                  },
                  content:
                    el.querySelector(".reply-to-tweet .tweet-content")?.textContent?.trim() || null,
                  media: Array.from(
                    el.querySelectorAll(".reply-to-tweet img.media-image")
                  ).map(img => img.getAttribute("src"))
                }
              : null
          };
        };
      
        return Array.from(document.querySelectorAll(".tweet-embed"))
          .map(formatTweet);
      });
      
    
      
      console.log(tweets)

    

  })();
  
  