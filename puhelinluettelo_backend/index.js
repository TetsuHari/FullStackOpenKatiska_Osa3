const express = require('express')
const cors = require('cors')
const morgan = require('morgan')

const app = express()


var phoneBook = [
    {
        id: "1",
        name: "Arto Hellas",
        number: "1123142341"
    },
    {
        id: "2",
        name: "Ada Lovelace",
        number: "555-555-555"
    }
]

morgan.token('mPostContent', (req, resp) => {
    return JSON.stringify(req.body)
})

const morganFormatFunction = (tokens, req, res) => {
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms',
        tokens.mPostContent(req, res)
    ].join(' ')
}

app.use(cors())
app.use(express.json())
app.use(morgan(morganFormatFunction))
app.use(express.static('dist'))

app.get('/api/persons', (req, resp) => {
    resp.json(phoneBook)
})

app.get('/api/persons/:id', (req, resp) => {
    const id = req.params.id
    const person = phoneBook.find(p => p.id === id)
    if(person) {
        resp.json(person)
    } else {
        resp.status(404).send({ error: 'No person with that id found' })
    }
})

app.delete('/api/persons/:id', (req, resp) => {
    const id = req.params.id
    console.log(`Delete person id: ${typeof(id)}`)
    phoneBook = phoneBook.filter(p => p.id !== id)
    console.log(phoneBook)
    
    resp.status(204).send()
    
})

app.post('/api/persons', (req, resp) => {
    const reqPerson = req.body

    if (!reqPerson.name || !reqPerson.number) {
        return resp.status(400).send({error: 'Missing name and/or number' })
    }

    if (phoneBook.map(p => p.name).includes(reqPerson.name)) {
        return resp.status(400).send({ error: 'Name present in the phonebook' })
    }

    const current_ids = phoneBook.map(p => p.id)
    console.log(current_ids)
    let newId = '0'

    while (current_ids.includes(newId)) {
        newId = String.toString(Math.floor(Math.random() * 10000))
    }

    const newPerson = { ...reqPerson, id: newId }

    phoneBook = phoneBook.concat(newPerson)

    resp.json(newPerson)
})

app.get('/info', (req, resp) => {
    const html = `
        <p>Phonebook has info for ${phoneBook.lenght} people</p>
        <p>${Date()}</p>
    `
    resp.send(html)
})

app.listen(3001)
