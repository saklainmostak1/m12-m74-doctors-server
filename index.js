const express = require('express')
const app = express()
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const cors = require('cors')
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ckrddue.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run(){
    try{
        const appointmentOptionCollection = client.db('doctorsPortal').collection('appointmentOptions')


        app.get('/appointmentOptions', async (req , res) =>{
            const query = {}
            const cursor = appointmentOptionCollection.find(query)
            const option = await cursor.toArray()
            res.send(option)
        })

    }
    finally{

    }
}
run().catch(error => console.log(error))


app.get('/', (req, res) =>{
    res.send('doctor server is running')
})
app.listen(port, (req, res)=> {
    console.log('api is running on', port);
})
