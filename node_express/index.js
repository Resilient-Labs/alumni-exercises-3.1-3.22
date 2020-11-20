const express = require('express')
const app = express()
require('dotenv').config()
const Person = require('./models/person')
const morgan = require('morgan')

const cors = require('cors')

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(morgan('combined'))

morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms'
  ].join(' ')
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons.map(person => person.toJSON()))
  })
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body
  // const regx = RegExp('/^[A-Za-z0-9]+$/');

  if(persons.includes(body.name)){
    return response.status(400).json({
      error: 'person entry already exists'
    })
  }
  const person = new Person({
    id: generateId(),
    name: body.name,
    number: body.number || 0
  })
  if (isNaN(parseInt(body.number))){
    throw new Error (body.error)
  }
  //prevent alphanumeric input
  // if(regx.test(body.name)===true || regx.test(body.number)===true){
  //     throw new Error ('must be a string');
  // }
  else  {
    person.save().then(savedPerson => {
      response.json(savedPerson)
    }).catch(error => next(error))
  }
  morgan(':method :url :status :response-time ms - :res[content-length]')
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person.toJSON())
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

//   app.post('/api/notes', (request, response) => {
//     const body = request.body
//     if (body.content === undefined) {
//       return response.status(400).json({ error: 'content missing' })
//     }

//     // ...
//   })
app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }
  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson.toJSON())
    })
    .catch(error => next(error))
})

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

//   app.get('/info', (request, response) => {
//     response.send(`There are ${persons.length}
//     people in the phonebook today : ${date}`)
//   })

//   app.delete('/api/persons/:id', (request, response) => {
//     const id = Number(request.params.id)
//     persons = persons.filter(person => person.id !== id)
//     response.status(204).end()
//   })

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}
app.use(errorHandler)

const generateId = () => {
  const maxId = persons.length > 0
    ? Math.floor(Math.random() * (10000 - 4 + 1)) + 4
    : 0
  return maxId + 1
}

let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-532352',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendick',
    number: '39-23-6423122',
  }
]

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})