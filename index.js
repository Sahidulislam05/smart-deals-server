const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 3000;

// Middleware

app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://smartDBUser:drwI3nUcYPvWGeqa@sahidul-islam.zbcwnr8.mongodb.net/?appName=Sahidul-Islam";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

app.get("/", (req, res) => {
  res.send("Smart deals server is running!");
});

async function run() {
  try {
    await client.connect();
    const db = client.db("smart_db");
    const productCollection = db.collection("products");
    const bidsCollection = db.collection("bids");

    app.get("/products", async (req, res) => {
      // const projectFields = {
      //   title: 1,
      //   _id: 1,
      //   price_min: 1,
      //   price_max: 1,
      //   image: 1,
      // };
      // const cursor = productCollection
      //   .find()
      //   .sort({ price_min: -1 })
      //   .skip(2)
      //   .limit(2)
      //   .project(projectFields);

      console.log(req.query);
      const email = req.query.email;
      const query = {};
      if (email) {
        query.email = email;
      }
      const cursor = productCollection.find(query);

      const result = await cursor.toArray();
      res.send(result);

      app.get("/products/:id", async (req, res) => {
        const id = req.params.id;
        const qurey = { _id: new ObjectId(id) };
        const result = await productCollection.findOne(qurey);
        res.send(result);
      });
    });
    app.post("/products", async (req, res) => {
      const newProduct = req.body;
      const result = await productCollection.insertOne(newProduct);
      res.send(result);
    });

    app.patch("/products/:id", async (req, res) => {
      const id = req.params.id;
      const updateProduct = req.body;
      const qurey = { _id: new ObjectId(id) };
      const update = {
        $set: {
          name: updateProduct.name,
          price: updateProduct.price,
        },
      };
      const result = await productCollection.updateOne(qurey, update);
      res.send(result);
    });

    app.delete("/products/:id", async (req, res) => {
      const id = req.params.id;
      const qurey = { _id: new ObjectId(id) };
      const result = await productCollection.deleteOne(qurey);
      res.send(result);
    });

    // bids related apis
    app.get("/bids", async (req, res) => {
      const email = req.query.email;
      const query = {};
      if (email) {
        query.buyer_email = email;
      }
      const cursor = bidsCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    // bids post

    app.post("/bids", async (req, res) => {
      const newBid = req.body;
      const result = await bidsCollection.insertOne(newBid);
      res.send(result);
    });

    // bid delete
    app.delete("/bids/:id", async (req, res) => {
      const id = req.params.id;
      const qurey = { _id: new ObjectId(id) };
      const result = await bidsCollection.deleteOne(qurey);
      res.send(result);
    });

    // bids update

    app.patch("/bids/:id", async (req, res) => {
      const id = req.params.id;
      const updateBids = req.body;
      const qurey = { _id: new ObjectId(id) };
      const update = {
        $set: {
          name: updateBids.name,
          price: updateBids.price,
        },
      };
      const result = await bidsCollection.updateOne(qurey, update);
      res.send(result);
    });

    // single bid identify
    app.get("/bids/:id", async (req, res) => {
      const id = req.params.id;
      const qurey = { _id: new ObjectId(id) };
      const result = await bidsCollection.findOne(qurey);
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Smart deals server is running on port: ${port}`);
});
