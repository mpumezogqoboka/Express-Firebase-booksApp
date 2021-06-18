const express = require('express');
const app = express();
const bodyParser  = require('body-parser');
const path = require('path');

//Firebase config

const admin = require('firebase-admin')
const secretKey = require('./secret.json')
admin.initializeApp({
    credential: admin.credential.cert(secretKey)
})

const firestore = admin.firestore();
const auth = admin.auth();

app.use(bodyParser.json())
app.set('port', process.env.port || 3000) 



//Get all books 

app.get('/books', (req, res, next)=>{
    const allBooks = [];
    firestore.collection('books').get().then((books) => {
        books.forEach(book => {
            allBooks.push({
                id: book.id,
                ...book.data()
            })
        })
        res.status(200).send(allBooks)
    }).catch(error => res.status(500).send(error.message))
})

app.get('/books/:id', (req, res, next)=>{
    const id = req.params.id;
    if(id === undefined) {
        res.status(500).send('Book is not defined!')
    } else {
        firestore.collection('books').doc(id).get().then((book) => {
            res.status(200).send({
                id: book.id,
                ...book.data()
            })
        })
        
    }
})


app.post('/books', (req, res, next) => {
    const books = req.body; 
    
    if(books === undefined) {
        res.status(500).send('Book is not defined!')
    } else {
        firestore.collection('books').doc().create(books).then(() => {
            res.status(200).send(books)
        }).catch(error => res.status(500).send(error.message))
    }
})

app.delete('/books/:id', (req, res, next) => {
    const id = req.params.id;
    if (id === undefined) {
        res.status(500).send('Book is not defined!')
    } else {
        firestore.collection('books').doc(id).delete().then(book => {
            res.status(200).send('Book has been deleted!')
        })
    }
})

app.put('/books/:id', (req, res, next) => {
    const id = req.params.id;
    const book = req.body;
    if(id === undefined) {
        res.status(500).send('Book is not defined!')
    } else {
        firestore.collection('books').doc(id).update(book).then(() => {
            res.status(200).send('Book has been updated!')
        })
    }
})


app.listen(app.get('port'), server =>{
    console.info(`Server listen on port ${app.get('port')}`);
})