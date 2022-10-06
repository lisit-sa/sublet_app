const {MongoClient} = require('mongodb')
const express = require('express')
let db

const app = express()
app.set('view engine', 'ejs')
app.set('views', './views')
app.use(express.static('public'))

app.use(express.json())
app.use(express.urlencoded)


app.get('/', async (req, res) => {
    const allSublets = await db.collection('Sublets').find().toArray()
    console.log(allSublets)
    res.render('home', {allSublets})
})

app.get('/admin', (req, res) => {
    res.render('admin')
})

app.get('/api/Sublets', async (req, res) => {
    const allSublets = await db.collection('Sublets').find().toArray()
    res.json(allSublets)
})

app.post('/create-sublet', async(req, res) => {
    res.send('Thank you')
}) 

async function start() {
    const client = new MongoClient('mongodb://root:root@localhost:27017/sublet_base?&authSource=admin')
    await client.connect();
    db = client.db()
    app.listen(3000)
}
start()



