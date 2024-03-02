const mongoose = require("mongoose");
const url = process.env.MONGODB_URI;

mongoose.set("strictQuery", false);

mongoose.connect(url);

const contactSchema = new mongoose.Schema({
  name: String,
  number: String,
});

// when json conversion occurs we drorenamep the _id to id and drop from response
contactSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Contact = mongoose.model("Contact", contactSchema);

module.exports = Contact;
