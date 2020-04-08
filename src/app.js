const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

let repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  if (!title || !url || !techs) {
    return response.status(400).json({ error: "Validation fails!" });
  }

  const id = uuid();

  const likes = 0;

  repositories.push({ id, title, url, techs, likes });

  return response.json({ id, title, url, techs, likes });
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  if (!title || !url || !techs) {
    return response.status(400).json({ error: "Validation fails!" });
  }

  const repo = repositories.find(item => item.id === id);

  if (!repo) {
    return response.status(400).json({ error: 'Repository does not exist!' });
  }

  repositories = repositories
    .map(item => item.id === id ? { ...item, title, url, techs } : item);
  
  const newRepo = repositories.find(item => item.id === id);

  return response.json(newRepo);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repo = repositories.find(item => item.id === id);

  if (!repo) {
    return response.status(400).json({ error: 'Repository does not exist!' });
  }

  repositories = repositories.filter(item => item.id !== id);

  return response.status(204).json();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repo = repositories.find(item => item.id === id);

  if (!repo) {
    return response.status(400).json({ error: 'Repository does not exist!' });
  }

  repositories = repositories
    .map(item => item.id === id ? { ...item, likes: item.likes + 1  } : item);
  
  const newRepo = repositories.find(item => item.id === id);

  return response.json(newRepo);
});

module.exports = app;
