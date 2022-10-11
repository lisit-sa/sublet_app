const {MongoClient, ObjectId} = require('mongodb')//initialization of DB & adding unique ID for DB objects
const express = require('express')//initialization of express.js
const multer = require('multer')//initialization of multer using for multipart/form-data
const upload = multer()
const sanitizeHTML = require('sanitize-html')//initialization of sanitize for safety html
const fse = require('fs-extra')
const sharp = require('sharp')
let db

const path = require('path')

//make sure that public/uploaded-photos exists at first launch
fse.ensureDirSync(path.join('public', 'uploaded-photos'))

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

app.post('/create-sublet', upload.any('photos'), ourCleanup, async(req, res) => {
    let photos = req.files
    req.cleanData.photo = []
    for (el of photos) {
        if(el) {
            const photoFileName = `${Date.now()}.jpg`
            await sharp(el.buffer).resize(844, 456).jpeg({quality: 60}).toFile(path.join('public', 'uploaded-photos', photoFileName))
            req.cleanData.photo.push(photoFileName) 
        } 
    }
    
    const info = await db.collection('Sublets').insertOne(req.cleanData)
    const newSublet = await db.collection('Sublets').findOne({_id: new ObjectId(info.insertedId)})
    res.send(newSublet)
}) 

app.delete('/sublet/:id', async (req, res) => {
    if(typeof req.params.id != 'string') req.params.id = ''
    const doc = await db.collection('Sublets').findOne({_id: new ObjectId(req.params.id)})
    if (doc.photo) {
        doc.photo.forEach(element => {
            fse.remove(path.join('public', 'uploaded-photos', element))
        });
    }
    db.collection('Sublets').deleteOne({_id: new ObjectId(req.params.id)})
    res.send('Good job')
})

app.post('/update-sublet', upload.any('photos'), ourCleanup, async(req, res) => {
    if (req.files) {
        //if customer upload a new photo
        let photos = req.files
        req.cleanData.photo = []
        let photoFileNameArr =[];
        for (el of photos) {
            if(el) {
                photoFileName = `${Date.now()}.jpg`
                photoFileNameArr.push(photoFileName)
                await sharp(el.buffer).resize(844, 456).jpeg({quality: 60}).toFile(path.join('public', 'uploaded-photos', photoFileName))
                req.cleanData.photo.push(photoFileName) 
            } 
        }
        const info = await db.collection("Sublets").findOneAndUpdate({ _id: new ObjectId(req.body._id) }, { $set: req.cleanData })
        if (info.value.photo) {  
            info.value.photo.forEach(element => {
                fse.remove(path.join('public', 'uploaded-photos', element))
            });
        }

        res.send(photoFileNameArr)
    } else {
        // if they are not uploading a new photo
        db.collection("Sublets").findOneAndUpdate({ _id: new ObjectId(req.body._id) }, { $set: req.cleanData })
        res.send(false)
    }
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



