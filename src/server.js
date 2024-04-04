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

// fake articles' data
const articleInfo = [
  {
    name: 'learn-react',
    upvotes: 0,
    downvotes: 0,
    comments: []
  },
  {
    name: 'learn-node',
    upvotes: 0,
    downvotes: 0,
    comments: []
  },
  {
    name: 'mongodb',
    upvotes: 0,
    downvotes: 0,
    comments: []
  },
];
// get a single article from db
// app.get('/api/articles/:name', async (req, res) => {
//   const { name } = req.params;
//   res.send(name);
// });
// upvote
app.put('/api/articles/:name/upvote', (req, res) => {
  const { name } = req.params;
  const article = articleInfo.find(a => a.name === name);
  if (article) {
    article.upvotes += 1;
    res.send(`the ${name} article now has ${article.upvotes} upvotes`);
  } else {
    res.send('aricle not found');
  }
});
//downvote
app.put('/api/articles/:name/downvote', (req, res) => {
  const { name } = req.params;
  const article = articleInfo.find(a => a.name === name);
  if (article) {
    article.upvotes -= 1;
    res.send(`the ${name} article now has ${article.upvotes} downvotes`);
  } else {
    res.send('aricle not found');
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
