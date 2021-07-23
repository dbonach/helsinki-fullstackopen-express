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

app.post('/api/persons', (req, res) => {
  const body = req.body

  if (!body.name && !body.number) {
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
    .catch((error) => {
      console.log('error saving to the database:', error.message);
    })

})

// app.get('/api/persons/:id', (req, res) => {
//   Note.findById(request.params.id)
//     .then(note => {
//       if (note) {
//         res.json(note)
//       } else {
//         res.status(404).end()
//       }
//     })
//     .catch(error => {
//       console.log(error);
//       res.status(500).end()
//     })


//   if (contact.length === 0) {
//     return res.status(404).send(`The person with id ${id} doesn't exist in the server.`)
//   }

//   res.json(contact)
// })

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

  Contact.findByIdAndUpdate(req.params.id, contact, { new: true })
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

// app.get('/info', (req, res) => {
//   const msg = `Phonebook has info for ${phonebook.length} people`
//     + '<br/><br/>' + `${new Date}`;

//   res.send(msg)
// })

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})