const express = require('express')
const app = express()

let phonebook = [
  {
    "id": 1,
    "name": "Arto Hellas",
    "number": "040-123456"
  },
  {
    "id": 2,
    "name": "Ada Lovelace",
    "number": "39-44-5323523"
  },
  {
    "id": 3,
    "name": "Dan Abramov",
    "number": "12-43-234345"
  },
  {
    "id": 4,
    "name": "Mary Poppendieck",
    "number": "39-23-6423122"
  }
]

app.get('/api/persons', (req, res) => {
  res.json(phonebook)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const contact = phonebook.filter((c) => c.id === id)

  if (contact.length === 0) {
    return res.status(404).send(`The person with id ${id} doesn't exist in the server.`)
  }

  res.json(contact)
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)

  phonebook = phonebook.filter(c => c.id !== id)
  res.status(204).end()
})

app.get('/info', (req, res) => {
  const msg = `Phonebook has info for ${phonebook.length} people`
    + '<br/><br/>' + `${new Date}`;

  res.send(msg)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})