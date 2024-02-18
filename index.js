const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3001;

// middleware declarations

app.use(cors());

app.use(express.static("dist"));

app.use(express.json());

morgan.token("payload", function (req, res) {
  return JSON.stringify(req.body);
});

app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :payload"
  )
);
// mock storage. Not persisted on restart
let contacts = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

const generatePrimaryKey = () => {
  const randomInt = Math.ceil(Math.random() * 99999999999999);
  return randomInt;
};

app.get("/info", (req, res) => {
  const date = new Date();

  res.send(
    `<p>Phonebook has info for ${contacts.length} people!</p>
    <p>
      ${date.toString()}
    </p>`
  );
});

app.get("/api/persons/", (req, res) => {
  res.json([...contacts]);
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  console.log(id);

  const contact = contacts.find((contact) => contact.id === id);

  if (contact) {
    console.log("testing..");
    return res.json({ ...contact });
  } else {
    res.status(404).end();
  }
});

app.post("/api/persons", (request, response) => {
  const contact = request.body;

  if (!contact.name || !contact.number) {
    return response
      .status(400)
      .json({ error: "Missing required params 'name' or 'number" });
  }

  const existingContact = contacts.find((c) => c.name === contact.name);

  console.log(existingContact);
  if (existingContact) {
    return response.status(400).json({ error: "Contact already exists." });
  }

  contact["id"] = generatePrimaryKey();

  console.log(contact);
  contacts.push(contact);
  response.json(contact);
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);

  console.log(id);

  contacts = contacts.filter((contact) => contact.id !== id);

  return res.status(204).end();
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
