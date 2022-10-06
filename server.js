const {MongoClient, ObjectId} = require('mongodb')//initialization of DB & adding unique ID for DB objects
const express = require('express')//initialization of express.js
const multer = require('multer')//initialization of multer using for multipart/form-data
const upload = multer()
const sanitizeHTML = require('sanitize-html')//initialization of sanitize for safety html
let db

//initialization of our app 
const app = express()
app.set('view engine', 'ejs')
app.set('views', './views')
app.use(express.static('public'))

app.use(express.json())
app.use(express.urlencoded({extended: false}))

//getting al the sublets & displaying them at the main page 
app.get('/', async (req, res) => {
    const allSublets = await db.collection('Sublets').find().toArray()
    console.log(allSublets)
    res.render('home', {allSublets})
})

//rendering of admin page
app.get('/admin', (req, res) => {
    res.render('admin')
})

//creating a json file with our sublets
app.get('/api/Sublets', async (req, res) => {
    const allSublets = await db.collection('Sublets').find().toArray()
    res.json(allSublets)
})

app.post('/create-sublet', upload.single('photo'), ourCleanup, async(req, res) => {
    console.log(req.body)
    const info = await db.collection('Sublets').insertOne(req.cleanData)
    const newSublet = await db.collection('Sublets').findOne({_id: new ObjectId(info.insertedId)})
    res.send(newSublet)
}) 

function ourCleanup(req, res, next) {
    if (typeof req.body.city != 'string') req.body.city  =''
    if (typeof req.body.rooms != 'string') req.body.rooms  =''
    if (typeof req.body._id != 'string') req.body._id  =''

    req.cleanData = {
        city: sanitizeHTML(req.body.city.trim(), {allowedTags: [], allowedAttributes: {}}),
        rooms: sanitizeHTML(req.body.rooms.trim(), {allowedTags: [], allowedAttributes: {}})
    }

    next()
}

//access to DB
async function start() {
    const client = new MongoClient('mongodb://root:root@localhost:27017/sublet_base?&authSource=admin')
    await client.connect();
    db = client.db()
    app.listen(3000)
}
start()



