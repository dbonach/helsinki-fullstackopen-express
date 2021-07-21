const mongoose = require('mongoose')

if (process.argv.length !== 3 && process.argv.length !== 5) {
  console.log('Please provide the password as an argument: node mongo.js <password>');
  console.log('or');
  console.log('node mongo.js <password> <name> <phone-number>');
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://fullstack:${password}@cluster0.ij7dm.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
})

const phonebookSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Contact = mongoose.model('Contact', phonebookSchema)

if (process.argv.length === 5) {

  const contact = new Contact({
    name: process.argv[3],
    number: process.argv[4]
  })

  contact.save().then(result => {
    console.log(`added ${result.name} number ${result.number} to phonebook`);
    mongoose.connection.close()
  })

} else {

  Contact.find({}).then(result => {
    console.log("phonebook:");
    result.forEach(contact => {
      console.log(contact.name, contact.number);
    })
    mongoose.connection.close()
  })

}