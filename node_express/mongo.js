const mongoose = require('mongoose')
var uniqueValidator = require('mongoose-unique-validator')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

// const personName = process.argv[3]
// const personNumber = process.argv[3]
//const password = process.argv[2]

const url =
  'mongodb+srv://user_test:user_test@cluster0.yw90z.mongodb.net/Cluster0?retryWrites=true&w=majority'

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const personSchema = new mongoose.Schema({
  // id: Number,
  name: {
    type: String,
    minlength: 3,
    required:true
  },
  number: {
    type: String,
    minlength: 8,
    required: true
  }
})
personSchema.plugin(uniqueValidator)

const Person = mongoose.model('Person', personSchema)

const person = new Person({
//   id: 12,
  name: process.argv[3],
  number: process.argv[4],
})

person.save().then(() => {
  if(process.argv[3] === undefined || process.argv[4] === undefined){
    console.log('No changes made.')
  }
  else{
    console.log(`added ${process.argv[3]} number ${process.argv[4]} to phonebook!`)
  }
  mongoose.connection.close()
})

Person.find({}).then(result => {
  result.forEach(person => {
    console.log(person)
  })
  mongoose.connection.close()
})