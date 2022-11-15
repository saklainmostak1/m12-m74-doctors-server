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

        const bookingCollection = client.db('doctorsPortal').collection('bookings')


        app.get('/appointmentOptions', async (req , res) =>{
            const date = req.query.date
            const query = {}
            const cursor = appointmentOptionCollection.find(query)
            const options = await cursor.toArray()
            const bookingquery = {appiontmentDate: date}
            const alreadyBooked = await bookingCollection.find(bookingquery).toArray()
            options.forEach(option => {
                const optionBooked = alreadyBooked.filter(book => book.treatment === option.name)
                const bookedSlots = optionBooked.map(book => book.slot)
                console.log(date, option.name,bookedSlots); 
            } )
            res.send(options)
        })

        app.post('/bookings', async(req, res) =>{
            const booking = req.body
            const result = await bookingCollection.insertOne(booking)
            res.send(result)
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
