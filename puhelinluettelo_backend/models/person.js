const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to ', url)

mongoose.connect(url)
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connecting to MongoDB: ', error.message)
    })

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: [3, "Minimum name lenght is 3"],
        required: [true, 'Name is required']
    },
    number: {
        type: String,
        validate: {
            validator: (v) => {
                const regex = /(?:\d{3}-\d{5,})|(?:\d{2}-\d{6,})/
                return regex.test(v)
            },
            message: props => `${props.value} is not a valid phone number! Minimum length is 8 digits, and the format is either XX-XXXXXX or XXX-XXXXX`
        },
        required: [true, 'Phone number required']
    }
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

module.exports = mongoose.model('Person', personSchema)