const mongoose = require("mongoose")
const url = process.env.MONGODB_URI

mongoose.set("strictQuery", false)

mongoose.connect(url)

const contactSchema = new mongoose.Schema({
    name: { type: String, minLength: 3, required: true },
    number: {
        type: String,
        validate: {
            validator: function (v) {
                return /^\d{2,3}-\d{6,}$/.test(v)
            },
            message: "You did not provide a valid phone number for this contact.",
        },
        required: true,
    },
})

// when json conversion occurs we drorenamep the _id to id and drop from response
contactSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    },
})

const Contact = mongoose.model("Contact", contactSchema)

module.exports = Contact
