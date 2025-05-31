const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
require("dotenv").config();
const cors = require("cors");
const app = express();
const port = 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.guep9xh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    const database = client.db("Next-News");
    const newsCollection = database.collection("All-News");
    const categoriesCollection = database.collection("Categories");

    // get all news
    app.get("/all-news", async (req, res) => {
      const query = {};
      const allNews = await newsCollection.find(query).toArray();
      res.send(allNews);
    });

    app.get("/news", async (req, res) => {
      const category = req.query.category;
      const search = { category: category };
      const categoryBaseNews = await newsCollection.find(search).toArray();
      res.send(categoryBaseNews);
    });

    app.get("/news/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await newsCollection.findOne(query);
      res.send(result);
    });

    // get all category
    app.get("/categories", async (req, res) => {
      const query = {};
      const categories = await categoriesCollection.find(query).toArray();
      res.send(categories);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

// basic route
app.get("/", (req, res) => {
  res.send("News Server Running");
});

app.listen(port, () => {
  console.log(`News Server Run on port ${port}`);
});
