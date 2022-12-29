const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
require('dotenv').config()
const port = process.env.PORT || 5000;



// MIDDLEWARES
app.use(cors());
app.use(express.json());


// APP HOME
app.get('/', (req, res) => {
    res.send('Hello World!')
})


//MONGO DB API
const uri = `mongodb+srv://${process.env.DB_USER_NAME}:${process.env.BD_USER_PASSWORD}@cluster0.4fdxwm9.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

//MONGO DB FUNCTION
async function mongoDbRun() {
    try {
        const tasksCollections = client.db("taskBucket").collection("tasks");

        // TASKS READ_ALL_OPERATION
        app.get("/tasks", async (req, res) => {
            const query = {};
            const cursor = tasksCollections.find(query);
            const tasks = await cursor.toArray();
            res.send(tasks);
        });

    } finally { }
} mongoDbRun().catch((err) => console.error(err));


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})