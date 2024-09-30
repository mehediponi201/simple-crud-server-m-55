const express = require('express')
var cors = require('cors')
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000

//Middleware
app.use(cors())
app.use(express.json())

//mongodb
const { MongoClient, ServerApiVersion,ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.UserName_DB}:${process.env.Pass}@cluster0.caivj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// const uri = "mongodb://localhost:27017";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const database = client.db("usersDB");
    const dataCollection = database.collection("user");

    //GET 
    app.get('/users',async(req,res)=>{
      const cursor = dataCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    //GET for Indivisual Element
    app.get('/users/:id',async(req,res)=>{
      const id = req.params.id;
      const query = { _id : new ObjectId(id) };
      const result = await dataCollection.findOne(query);
      res.send(result);
    })

    // POST 
    app.post('/users',async(req,res)=>{
     const user = req.body;
     console.log('new user',user);
     const result = await dataCollection.insertOne(user);
     res.send(result);
    })
    
    //PUT
    app.put('/users/:id',async(req,res)=>{
      const id = req.params.id;
      const user = req.body;
      console.log(id,user);
      const filter = { _id : new ObjectId(id)};
      const options = { upsert: true };
    // Specify the update to set a value for the plot field
    const updateDoc = {
      $set: {
        name: user.name,
        email: user.email
      },
    };
    const result = await dataCollection.updateOne(filter, updateDoc, options);
    res.send(result);
    })

    //DELETE
    app.delete('/users/:id',async(req,res)=>{
      const id = req.params.id;
      console.log('Please delete the id form the database',id);
      const query = { _id : new ObjectId(id) };
      const result = await dataCollection.deleteOne(query);
      res.send(result);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);



app.get('/',(req,res)=>{
res.send('simple crud is running');
})

app.listen(port,()=>{
    console.log(`running port is ${port}`);
    
})


//jamesbondbangladesh007
//LupNb4Ep7xDTDn4S