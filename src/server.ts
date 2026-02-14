import express, { Express, NextFunction, Request, Response } from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import puppeteer  from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

import { IResponseError, ResponseWrapper } from "@utils/responses";
// import "@config/passportHandler";


const app: Express = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cors());

// Security
if (process.env.NODE_ENV === "production" || process.env.NODE_ENV === "staging") {
  app.use(
    helmet({
      crossOriginEmbedderPolicy: false,
    }),
  );
}
const seen: string[] = [];
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
    await delay(5000);
    await page.click('button.login-button');
    console.log("logged in");
    // Wait for navigation or dashboard element to confirm success
    await delay(7000);

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

app.get("/", (_req, res) => {
  res.status(200).send("OK");
});

//app.use("/admin/queues", serverAdapter.getRouter());
app.get("/scrape", async (_req: Request, res: Response) => {
  try {
    console.log("ran get")
    puppeteer.use(StealthPlugin());
    const launchOptions = {
      headless: true,
      ignoreHTTPSErrors: true,
      args: [
        '--disable-setuid-sandbox',
        '--no-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--no-first-run',
        '--no-zygote',
        '--disable-software-rasterizer'
      ],
      executablePath:
      process.env.NODE_ENV === "production"
        ? process.env.PUPPETEER_EXECUTABLE_PATH
        : puppeteer.executablePath(),
    };
    console.log("setting up browser")
    const browser = await puppeteer.launch(launchOptions);
    try {
      const page = await browser.newPage();

      await page.goto(`${BASE_URL}`, { waitUntil: "networkidle2" });
console.log("went to page")
      await login(page);
      console.log("logged in to so and so")
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
        console.log("here here")
        const uniqueData = tweets.filter((item: any) => {
          const key = JSON.stringify(item);
          if (seen.includes(key)) return false;
          return true;
        });
        
        uniqueData.forEach((item: any) => {
          seen.push(JSON.stringify(item));
        });
        
        if (seen.length > uniqueData.length) {
          seen.splice(0, uniqueData.length);
        }
      res.send({uniqueData, length: uniqueData.length, tlength: tweets.length});
    } finally {
      await browser.close();
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({ error: "Failed to scrape data" });
  }
});


app.use("/*", (_req: Request, _res: Response, next) => {
  const error: IResponseError = new Error("Not found");
  error.status = 404;
  // console.log(apiRouter.stack)
  next(error);
});

app.use((error: IResponseError, req: Request, res: Response, _next: NextFunction) => {
  const response = new ResponseWrapper(res);
  const title = error.status === 404 ? "Invalid endpoint" : "Unauthorized";
  console.log(req.url,req.method)

  return response.ErrorResponse({
    title,
    message: error.message,
    code: error.status,
  });
});


export default app;
