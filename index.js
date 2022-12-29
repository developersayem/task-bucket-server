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
        //TASK CREATE ONE  OPARATION
        app.post("/task", async (req, res) => {
            const data = req.body;
            const task = await tasksCollections.insertOne(data);
            res.send(task);
        });
        // TASKS READ_BY_EMAIL_OPERATION 
        app.get("/mytasks", async (req, res) => {
            let query = {};
            if (req.query.email) {
                query = {
                    "email": req.query.email
                }
            }
            const cursor = tasksCollections.find(query);
            const tasks = await cursor.toArray();
            res.send(tasks);
        });
        // TASKS READ_BY_EMAIL_OPERATION 
        app.get("/priority", async (req, res) => {
            const query = { priority: 'high' };
            const cursor = tasksCollections.find(query);
            const tasks = await cursor.toArray();
            res.send(tasks);
        });
        // TASKS READ_BY_EMAIL_OPERATION 
        app.get("/taskType", async (req, res) => {
            const query = { taskType: 'complete' };
            const cursor = tasksCollections.find(query);
            const tasks = await cursor.toArray();
            res.send(tasks);
        });
        // REVIEW_DELETE_OPARATION(D)
        app.delete("/mytask/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const task = await tasksCollections.deleteOne(query);
            res.send(task);
        });
        app.put("/mytaskid/:id", async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const review = req.body;
            const option = { upinsert: true };
            const updatedUser = {
                $set: {
                    taskType: 'complete',
                },
            };
            const result = await reviewsCollection.updateOne(
                filter,
                updatedUser,
                option
            );
            res.send(result);
        });

    } finally { }
} mongoDbRun().catch((err) => console.error(err));


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})