import express from 'express';
import morgan from 'morgan';
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
    downvotes: 0
  },
  {
    name: 'learn-node',
    upvotes: 0,
    downvotes: 0
  },
  {
    name: 'mongodb',
    upvotes: 0,
    downvotes: 0
  },
];
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

const port = 3001;

app.listen(port, () => {
  console.log(`server is listening on http://localhost:${port}`);
});
