import puppeteer from "puppeteer";
import multer from "multer";
import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary'


cloudinary.config({
  cloud_name: 'ubeus',
  api_key: '296351691679173',
  api_secret: 'Avhi-xgZfwe18yje5MAO1YCA2v4'
});

const PIXABAY_API_KEY = "51838578-21a5f6a714a9fbb07c3498fd3"; // replace with your key


export const getPixabayImage = async(q: string) => {
  try {
    const res = await axios.get(`https://pixabay.com/api/?key=${PIXABAY_API_KEY}&q=${q}&image_type=photo&perPage=1`);

    const hits = res.data.hits;
    if (!hits.length) {
      throw new Error(`No images found for query: ${q}`);
    }

    const random = hits[Math.floor(Math.random() * hits.length)];
    return random.largeImageURL; 
  } catch (err) {
    console.error("Pixabay fetch error:", err.message);
    return null;
  }
}


export const uploadFile = () => {
  const storage = multer.memoryStorage(); 
  const upload = multer({
    storage,
    limits: { fileSize: 100 * 1024 * 1024 }, 
    fileFilter(_req, file, callback) {
      const allowedTypes = [
        "text/csv",
        "application/pdf",
        "text/plain",
      ];

      if (allowedTypes.includes(file.mimetype)) {
        callback(null, true);
      } else {
        callback(new Error("Only CSV, PDF or plain text files are allowed."));
      }
    },
  });

  return upload;
};

export const htmlToImage = async(htmlString: string): Promise<string> => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Set viewport to match image container size
  await page.setViewport({ width: 600, height: 600, deviceScaleFactor: 2 });


  await page.setContent(htmlString);

  // Wait for images to load
  await page.waitForSelector('.background-image');
  await page.evaluate(() => {
    return Promise.all(Array.from(document.images, img => {
      if (img.complete) return Promise.resolve();
      return new Promise(resolve => {
        img.addEventListener('load', resolve);
        img.addEventListener('error', resolve);
      });
    }));
  });

  // Screenshot only the image container
  const imageContainer = await page.$('.image-container');
  const outputFilename = "postImage.png" as `${string}.png`;
  const outputPath = path.resolve(process.cwd(), outputFilename);
  await imageContainer!.screenshot({
    path: outputPath as `${string}.png`,
    type: "png",
  });

  await browser.close();

  return outputPath;
};

export const uploadImageToCloudinary = async(filePath: string): Promise<string> => {
  const result = await cloudinary.uploader.upload(filePath);
console.log(result)
  return result.secure_url as string;
}