const express = require('express');
const fs = require('fs');

const app = express();

function countStudents(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf-8', (err, data) => {
      if (err) {
        reject(new Error('Cannot load the database'));
        return;
      }

      const lines = data.split('\n').filter(line => line.trim() !== '');
      const header = lines.shift(); // remove header
      const students = {};

      for (const line of lines) {
        const tokens = line.split(',');
        if (tokens.length < 4) continue;
        const field = tokens[3];
        if (!students[field]) {
          students[field] = [];
        }
        students[field].push(tokens[0]);
      }

      let output = `Number of students: ${lines.length}`;
      for (const [field, names] of Object.entries(students)) {
        output += `\nNumber of students in ${field}: ${names.length}. List: ${names.join(', ')}`;
      }

      resolve(output);
    });
  });
}

app.get('/', (req, res) => {
  res.send('Hello Holberton School!');
});

app.get('/students', async (req, res) => {
  const dbPath = process.argv[2];
  try {
    const output = await countStudents(dbPath);
    res.setHeader('Content-Type', 'text/plain');
    res.send(`This is the list of our students\n${output}`);
  } catch (err) {
    res.status(500).send('This is the list of our students\nCannot load the database');
  }
});

app.listen(1245);

module.exports = app;
