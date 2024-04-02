import express from 'express';
const app = express();

app.get('/', (req, res) => {
  res.send('hello, ur sever is up and running...!');
})

const port = 3001;

app.listen(port, () => {
  console.log(`server is listening on http://localhost:${port}`);
});
