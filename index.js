require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Contact = require("./models/contact");

const app = express();
const port = process.env.PORT || 3001;

// middleware declarations

app.use(cors());

app.use(express.static("dist"));

app.use(express.json());

morgan.token("payload", function (req, res) {
  return JSON.stringify(req.body);
});

const errorHandler = (error, req, res, next) => {
  console.log("This is the error handler I made.");
  if (error.name === "CastError") {
    return res.status(400).send({ error: "Malformed Id" });
  }
  // only hanlding Casting Errors for now in this custom eventhandler. The default handler takes care of the rest for now.
  next(error);
};

app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :payload"
  )
);

app.get("/info", (req, res) => {
  const date = new Date();

  Contact.find({}).then((result) => {
    console.log("result", result);
    res.send(
      `<p>Phonebook has info for ${result.length} people!</p>
      <p>
        ${date.toString()}
      </p>`
    );
  });
});

app.get("/api/persons/", (req, res) => {
  // res.json([...contacts]);
  Contact.find({}).then((contacts) => {
    console.log("Contacts", contacts);
    res.json(contacts);
  });
});

app.get("/api/persons/:id", (req, res, next) => {
  Contact.findById(req.params.id)
    .then((contact) => {
      if (contact) {
        return res.json(contact);
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => {
      console.log(error);
      // res.status(400).send({ error: "malformatted id" });
      next(error);
    });
});

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response
      .status(400)
      .json({ error: "Missing required params 'name' or 'number" });
  }

  Contact.find({ name: body.name }).then((existingContacts) => {
    console.log("existing", existingContacts);
    console.log("length", existingContacts.length);
    if (existingContacts.length != 0) {
      return response.status(400).json({ error: "Contact already exists." });
    }

    const contact = new Contact({ name: body.name, number: body.number });

    contact.save().then((savedContact) => {
      console.log(savedContact);
      response.json(savedContact);
    });
  });
});

app.put("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;

  const updatePayload = {
    name: request.body.name,
    number: request.body.number,
  };

  console.log(updatePayload);
  console.log("id", id);

  Contact.findByIdAndUpdate(id, updatePayload, { new: true })
    .then((updatedContact) => {
      console.log("after update", updatedContact);
      return response.json(updatedContact);
    })
    .catch((error) => {
      next(error);
    });
});

app.delete("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;

  console.log(id);

  contacts = Contact.findByIdAndDelete(id)
    .then((response) => {
      return res.status(204).end();
    })
    .catch((error) => {
      next(error);
    });
});

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
