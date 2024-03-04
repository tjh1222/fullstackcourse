const mongoose = require("mongoose")

if (process.argv.length < 3) {
    console.log("give password as argument")
    process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url = `mongodb+srv://tylerjohnhurley:${password}@contactcluster.jkpoiue.mongodb.net/?retryWrites=true&w=majority`
mongoose.set("strictQuery", false)

mongoose.connect(url)

const contactSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Contact = mongoose.model("Contact", contactSchema)

if (!name && !number) {
    Contact.find({}).then((res) => {
        console.log(res)
        mongoose.connection.close()
        process.exit(1)
    })
} else {
    const contact = new Contact({
        name: name,
        number: number,
    })

    contact.save().then(() => {
        console.log("contact saved!")
        mongoose.connection.close()
    })
}
