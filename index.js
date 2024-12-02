const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

const app = express();

//maiddlewere
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.USER_ID}:${process.env.USER_PASS}@cluster0.ls3lx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});


const UserCollaction = client.db("AddUser").collection("users");
const usersCollaction = client.db("AddUser").collection("user")

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();
        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        app.post('/users', async (req, res) => {
            const newuser = req.body;
            const result = await UserCollaction.insertOne(newuser);
            res.send(result)
        })
        app.get('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await UserCollaction.findOne(query)
            res.send(result)
        })



        app.get('/users', async (req, res) => {
            const { sherchprams } = req.query;
            let option = {}
            // this a react regex provide and the option is the uppercase and other he also lowercase
            if (sherchprams) {
                option = { title: { $regex: sherchprams, $options: 'i' } }
            }
            const query = UserCollaction.find(option)
            const result = await query.toArray()
            res.send(result)
        })

        app.patch('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const data = req.body;
            const result = await UserCollaction.updateOne(query, {
                $set: {
                    title: data.title,
                    day: data.day,
                    formattedDate: data.formattedDate,
                },
            });
            res.send(result);
        })
        app.patch('/status/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }

            const result = await UserCollaction.updateOne(query, {
                $set: {
                    isCompleted: true
                },
            });
            res.send(result);
        })

        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await UserCollaction.deleteOne(query)
            res.send(result)
        })
        //user login info
        app.post('/user', async (req, res) => {
            const query = req.body;
            const result = await usersCollaction.insertOne(query)
            res.send(result)
        })
        app.get('/user', async (req, res) => {
            const result = await usersCollaction.find().toArray()
            res.send(result)
        })
        app.delete('/user/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await usersCollaction.deleteOne(query);
            res.send(result)
        })
        app.patch('/user', async (req, res) => {
            const email = req.body.email;
            const filter = { email }
            const result = await usersCollaction.updateOne(filter, {
                $set: {
                    lastSignInTime: req.body.lastSignInTime
                },
            });
            res.send(result)
        })

        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('the project is done')
})
app.listen(port, () => {
    console.log(`this is a server : ${port}`);
})