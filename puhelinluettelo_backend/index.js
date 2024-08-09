require('dotenv').config()

const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const Person = require('./models/person')

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
app.use(express.static('dist'))
app.use(express.json())
app.use(morgan(morganFormatFunction))

app.get('/api/persons', (req, resp, next) => {
    Person.find({}).then(persons => {
        resp.json(persons)
    })
    .catch(error => next(error))
})

app.get('/api/persons/:id', (req, resp, next) => {
    Person.findById(req.params.id).then(person => {
        if (person) {
            resp.json(person)
        } else {
            response.status(404).send({ error: 'No person with that id found' })
        }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, resp, next) => {
    Person.findByIdAndDelete(req.params.id)
        .then(dbResult => {
            resp.status(204).end()
        })
        .catch(error => next(error))    
})

app.put('/api/persons/:id', (req, resp, next) => {
    const reqPerson = req.body


    Person.findByIdAndUpdate(
        reqPerson.id,
        reqPerson,
        { new: true, runValidators: true, context: 'query' }
    )
        .then(updatedPerson => {
            resp.json(updatedPerson)
        })
        .catch(error => next(error))
})

app.post('/api/persons', (req, resp, next) => {
    const reqPerson = req.body

    const newPerson = Person({name: reqPerson.name, number: reqPerson.number})

    newPerson.save()
        .then(addedPerson => {
            resp.json(addedPerson)
        })
        .catch(error => next(error))
})



app.get('/info', (req, resp, next) => {

    Person.find({}).then(personList => {
        const html = `
            <p>Phonebook has info for ${personList.length} people</p>
            <p>${Date()}</p>
        `

        resp.send(html)
    })
    .catch(error => next(error))

})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
  
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.log(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'Malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }

    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
