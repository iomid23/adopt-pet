const express = require('express');
const path = require('path');
const pets = require('./petList');

const app = express();
const PORT = process.env.PORT || 8000;
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Adopt a Pet</title>
        <link rel="stylesheet" href="/style.css">
      </head>
      <body>
        <h1>Adopt a Pet!</h1>
        <p>Browse through the links below to find your new furry friend:</p>
        <ul>
          <li><a href="/animals/dogs">Dogs</a></li>
          <li><a href="/animals/cats">Cats</a></li>
          <li><a href="/animals/rabbits">Rabbits</a></li>
        </ul>
      </body>
    </html>
  `);
});

app.get('/animals/:pet_type', (req, res) => {
  const { pet_type } = req.params;
  const petsOfType = pets[pet_type];

  if (!petsOfType) {
    return res.status(404).send('<h1>Page Not Found</h1>');
  }

  const petListHtml = petsOfType
    .map((pet, index) => `<li class="pet-list-item"><a href="/animals/${pet_type}/${index}">${pet.name}</a></li>`)
    .join('');

  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>List of ${pet_type}</title>
        <link rel="stylesheet" href="/style.css">
      </head>
      <body>
        <h1>List of ${pet_type}</h1>
        <ul class="pet-list">
          ${petListHtml}
        </ul>
      </body>
    </html>
  `);
});

app.get('/animals/:pet_type/:pet_id', (req, res) => {
  const { pet_type, pet_id } = req.params;
  const petTypeArray = pets[pet_type];

  if (!petTypeArray || !petTypeArray[pet_id]) {
    return res.status(404).send('<h1>Page Not Found</h1>');
  }

  const pet = petTypeArray[pet_id];

  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${pet.name}</title>
        <link rel="stylesheet" href="/style.css">
      </head>
      <body>
        <div class="pet-profile">
          <h1>${pet.name}</h1>
          <img src="${pet.url}" alt="${pet.name}" />
          <p>${pet.description}</p>
          <ul>
            <li>Breed: ${pet.breed}</li>
            <li>Age: ${pet.age}</li>
          </ul>
        </div>
      </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
