const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const jwt = require("jsonwebtoken");
const port = process.env.PORT || 5000;

const corsOptions = {
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
    optionSuccessStatus: 200,
  };
  app.use(cors(corsOptions));
  app.use(express.json());
  app.use(cookieParser());


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(process.env.DB_URI, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();


    const taskCollection = client.db("Task-management").collection("task");


    app.post("/task",  async (req, res) => {
        const taskItem = req.body;
        const result = await taskCollection.insertOne(taskItem);
        res.send(result);
      });
      app.get("/task", async (req, res) => {
        const taskItem = req.body;
        const result = await taskCollection.find(taskItem).toArray()
        res.send(result);
      });
      app.get("/task/:email",  async (req, res) => {
        const email = req.params.email;
        console.log(email)
        const query = {
          userEmail: email,
        };
        const result = await taskCollection.find(query).toArray();
        res.send(result);
      });
      app.get("/task/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await taskCollection.findOne(query);
        res.send(result);
      });
     
      
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);
app.get("/", (req, res) => {
    res.send("Hello from Task management..");
  });
  
  app.listen(port, () => {
    console.log(`task management is running on port ${port}`);
  })
