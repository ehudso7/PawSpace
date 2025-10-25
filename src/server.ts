import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import CloudinaryService from "./services/cloudinary";
import { VideoParams } from "./types/media";
import { postVideoToPawSpace } from "./services/pawspace";

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: "2mb" }));

const cloudinary = CloudinaryService.fromEnv();

app.post("/api/video/generate", async (req, res) => {
  try {
    const params = req.body as VideoParams;
    const url = await cloudinary.createTransformationVideo(params);
    res.json({ url });
  } catch (err: any) {
    res.status(400).json({ error: err.message ?? "Failed to generate video" });
  }
});

app.post("/api/video/effects", async (req, res) => {
  try {
    const { publicId, effects } = req.body as { publicId: string; effects: any[] };
    const url = await cloudinary.applyEffects(publicId, effects);
    res.json({ url });
  } catch (err: any) {
    res.status(400).json({ error: err.message ?? "Failed to apply effects" });
  }
});

app.post("/api/pawspace/post", async (req, res) => {
  try {
    const result = await postVideoToPawSpace(req.body);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message ?? "Failed to post to PawSpace" });
  }
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
