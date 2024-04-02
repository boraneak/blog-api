import express from 'express';
const app = express();

app.use(express.json());
app.get('/', (req, res) => {
  res.send('hello, ur sever is up and running...!');
})

app.post('/', (req, res) => {
  console.log(`hello ${req.body.name}`);
  res.end();
});
const port = 3001;

app.listen(port, () => {
  console.log(`server is listening on http://localhost:${port}`);
});
