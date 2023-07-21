const express = require("express");
const path = require("path");
const pets = require("./petList");

const app = express();
const port = 8000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "css")));

app.get("/", (req, res) => {
  const categories = [
    { name: "Dogs", href: "/animals/dogs" },
    { name: "Cats", href: "/animals/cats" },
    { name: "Rabbits", href: "/animals/rabbits" },
  ];
  res.render("index", { categories, petType: null, petsOfType: null });
});

app.get("/animals/:pet_type", (req, res) => {
  const { pet_type: animalType } = req.params;
  const availableAnimals = pets[animalType];

  if (availableAnimals) {
    res.render("index", {
      categories: null,
      petType: animalType,
      petsOfType: availableAnimals,
    });
  } else {
    res.render("index", {
      categories: null,
      petType: null,
      petsOfType: null,
    });
  }
});

app.get("/animals/:pet_type/:pet_id", (req, res) => {
  const { pet_type, pet_id } = req.params;
  const availableAnimals = pets[pet_type];
  const pet = availableAnimals.find((animal) => animal.id === parseInt(pet_id));

  if (!pet) {
    res.send("<h1>Pet not exist</h1>");
  } else {
    res.send(`
      <h1>${pet.name}</h1>
      <img src="${pet.url}" width="400" alt="${pet.name}" />
      <p>Age: ${pet.age}</p>
      <p>Breed: ${pet.breed}</p>
    `);
  }
});

app.get("*", (req, res) => res.send("Not Found any Data"));

app.listen(port, () => console.log(`Server running on port ${port}`));
