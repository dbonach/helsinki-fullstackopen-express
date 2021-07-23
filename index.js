const express = require('express')
const cors = require('cors')
let morgan = require('morgan')
require('dotenv').config()
const Contact = require('./models/contact')
const app = express()

app.use(express.json())
app.use(cors())
app.use(express.static('build'))

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
//   const id = Number(req.params.id)
//   const contact = phonebook.filter((c) => c.id === id)

//   if (contact.length === 0) {
//     return res.status(404).send(`The person with id ${id} doesn't exist in the server.`)
//   }

//   res.json(contact)
// })

// app.delete('/api/persons/:id', (req, res) => {
//   const id = Number(req.params.id)

//   phonebook = phonebook.filter(c => c.id !== id)
//   res.status(204).end()
// })

// app.get('/info', (req, res) => {
//   const msg = `Phonebook has info for ${phonebook.length} people`
//     + '<br/><br/>' + `${new Date}`;

//   res.send(msg)
// })

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})