import express from 'express';
import morgan from 'morgan';
import { dbConn } from '../database/index.js';
const app = express();

app.use(express.json());
app.use(morgan('dev'));
app.get('/', (req, res) => {
  res.send('hello, ur sever is up and running...!');
})

app.post('/', (req, res) => {
  console.log(`hello ${req.body.name}`);
  res.end();
});

app.get('/hello/:name', (req, res) => {
  const { name } = req.params;
  console.log(name);
  res.end();
});

// get a single article from mongodb

app.get('/api/articles/:name', async (req, res) => {
  const { name } = req.params;
  try {
    const mongoClient = await dbConn();
    const database = mongoClient.db('blog');
    const article = await database.collection('articles').findOne({ name: name });
    if (article) {
      res.status(200).send(article);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.log('cannot get mongo client', error);
  }

});
// upvote
app.put('/api/articles/:name/upvote', async (req, res) => {
  const { name } = req.params;
  const mongoClient = await dbConn();
  const database = mongoClient.db('blog');
  await database.collection('articles').updateOne({ name: name }, { $inc: { upvotes: 1 } });

  const article = await database.collection('articles').findOne({ name: name });
  if (article) {
    res.status(200).send(article);
  } else {
    res.sendStatus(404);
  }
});

// comments
app.post('/api/articles/:name/comments', (req, res) => {
  const { name } = req.params;
  const { postedBy, text } = req.body;
  const article = articleInfo.find(a => a.name === name);
  if (article) {
    article.comments.push({ postedBy, text });
    res.send(article.comments);
  } else {
    res.send('aricle not found');
  }
});

const port = process.env.PORT;

async function startServer() {
  try {
    await dbConn();
    app.listen(port, () => {
      console.log(`Server is listening on http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Error connecting to database:', error);
    process.exit(1);
  }
}

startServer();
