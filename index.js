const express = require('express')
const cors = require('cors')
let morgan = require('morgan')
require('dotenv').config()
const Contact = require('./models/contact')
const { response } = require('express')
const app = express()

app.use(cors())
app.use(express.static('build'))
app.use(express.json())

const errorHandler = (error, request, response, next) => {
  console.log(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

morgan.token('data', function (req, res) {
  return JSON.stringify(req.body).length === 2 ? null : JSON.stringify(req.body)
})


// app.use(morgan('tiny'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

app.get('/api/persons', (req, res) => {
  Contact.find({}).then(result => {
    res.json(result)
  })
})

app.post('/api/persons', (req, res, next) => {
  const body = req.body

  if (body.name === undefined || body.number === undefined) {
    return res.status(400).json({
      error: 'Request should contain name and number!'
    })
  }

  const contact = new Contact({
    name: body.name,
    number: body.number,
  })

  contact.save().then(savedContact => {
    res.json(savedContact)
  })
    .catch(error => next(error))

})

app.get('/api/persons/:id', (req, res, next) => {
  Contact.findById(req.params.id)
    .then(contact => {
      if (contact) {
        res.json(contact)
      } else {
        res.status(404).send(`The person with id 
        ${req.params.id} doesn't exist in the server.`)
      }
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body

  if (!body.number) {
    return res.status(400).json({
      error: 'missing name or number'
    })
  }

  const contact = {
    number: body.number
  }

  Contact.findByIdAndUpdate(req.params.id, contact, { new: true, runValidators: true, context: 'query' })
    .then(updatedContact => {
      res.json(updatedContact)
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res) => {
  Contact.findByIdAndDelete(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => {
      console.log('error deleting on the database:', error.message)
    })
})

app.get('/info', (req, res) => {

  Contact.find({}).then(list => {
    const msg = `Phonebook has info for ${list.length} people`
      + '<br/><br/>' + `${new Date}`;

    res.send(msg)
  })
})

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})