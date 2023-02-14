const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.izvrctz.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const blogsCollection = client.db("practiceDB").collection("blogs");

    //<<------------ Blogs route start---------------->>//
    app.get("/blogs", async (req, res) => {
      const result = await blogsCollection.find({}).toArray();
      res.send(result);
    });
    app.get("/blog/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const result = await blogsCollection.findOne(filter);
      res.send(result);
    });
    app.post("/blog", async (req, res) => {
      const blog = req.body;
      const result = await blogsCollection.insertOne(blog);
      res.send(result);
    });
    app.delete("/blog/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const result = await blogsCollection.deleteOne(filter);
      res.send(result);
    });

    app.put("/blog/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const query = req.body;
      const updateDoc = {
        $set: query,
      };
      const result = await blogsCollection.updateOne(filter, updateDoc);
      res.send(result);
    });

    //<<------------ Blogs route end---------------->>//
  } finally {
  }
}

run().catch((err) => console.error(err));

app.get("/", (req, res) => {
  res.send("Server is running...");
});

app.listen(port, () => {
  console.log(`Server is running...on ${port}`);
});
