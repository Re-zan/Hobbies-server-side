const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

//middleware
app.use(cors());
app.use(express.json());

//mongodb start
const uri = `mongodb+srv://${process.env.DB_username}:${process.env.DB_password}@cluster0.6wlkevy.mongodb.net/?retryWrites=true&w=majority`;

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
    // await client.connect();
    //start project
    //collection
    hobbies_collections = client
      .db("hobbies-listDB")
      .collection("hobbies-collection");

    //get list
    app.get("/hobbies", async (req, res) => {
      const result = await hobbies_collections
        .find()
        .sort({ _id: -1 })
        .toArray();
      res.send(result);
    });

    // creat hobbies list
    app.post("/hobbies", async (req, res) => {
      const data = req.body;
      const result = await hobbies_collections.insertOne(data);
      res.send(result);
    });

    //delete data
    app.delete("/hobbies/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await hobbies_collections.deleteOne(query);
      res.send(result);
      console.log(id);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

//testing
app.get("/", (req, res) => {
  res.send("List are cominggggggggggggggggggggggggggggggggggggg");
});
//connect
app.listen(port);
