// Set of functions create, remove and update contacts in the server
import axios from 'axios'
// const baseUrl = 'http://localhost:3001/api/persons'
const baseUrl = '/api/persons'

const create = newContact => {
  const request = axios.post(baseUrl, newContact)
  return request.then(response => response.data)
}

const remove = id => {
  return axios.delete(baseUrl.concat(`/${id}`))
}

const update = newContact => {
  const newNumber = { number: newContact.number }
  const request = axios.put(baseUrl.concat(`/${newContact.id}`), newNumber)
  return request.then(response => response.data)
}

const requests = { create, remove, update, baseUrl }

export default requests