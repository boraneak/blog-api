import express from "express";
import morgan from "morgan";
import fs from "fs";
import admin from "firebase-admin";
const credentials = JSON.parse(fs.readFileSync("./credentials.json"));
admin.initializeApp({
  credential: admin.credential.cert(credentials),
});
// import cors from 'cors';
import { connectToDB, db } from "../database/index.js";
const app = express();

app.use(express.json());
app.use(morgan("dev"));
// allow cors for all routes
// app.use(cors());

// get a single article from mongodb

app.get("/api/articles/:name", async (req, res) => {
  const { name } = req.params;
  try {
    const article = await db.collection("articles").findOne({ name: name });
    if (article) {
      res.status(200).send(article);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.log("Error retrieving article from the database:", error);
  }
});

// get all articles

app.get("/api/articles", async (req, res) => {
  try {
    const articlesCursor = await db.collection("articles").find();
    const articles = await articlesCursor.toArray();
    if (articles.length > 0) {
      res.status(200).send(articles);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.log("Error fetching articles:", error);
    res.status(500).send("Internal Server Error");
  }
});

// upvote
app.put("/api/articles/:name/upvote", async (req, res) => {
  const { name } = req.params;
  await db
    .collection("articles")
    .updateOne({ name: name }, { $inc: { upvotes: 1 } });

  const article = await db.collection("articles").findOne({ name: name });
  if (article) {
    res.status(200).send(article);
  } else {
    res.sendStatus(404);
  }
});

// comments
app.post("/api/articles/:name/comments", async (req, res) => {
  const { name } = req.params;
  const { postedBy, text } = req.body;
  await db
    .collection("articles")
    .updateOne({ name }, { $push: { comments: { postedBy, text } } });

  const article = await db.collection("articles").findOne({ name: name });
  if (article) {
    res.status(200).send(article);
  } else {
    res.sendStatus(404);
  }
});

// login
// app.post('/api/login', (req, res) => {
//   const {email, password } = req.body;
// });

const port = process.env.PORT;

async function startServer() {
  try {
    await connectToDB();
    app.listen(port, () => {
      console.log(`Server is listening on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Error connecting to database:", error);
    process.exit(1);
  }
}

startServer();
