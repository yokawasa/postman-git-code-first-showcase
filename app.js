const express = require('express');
const app = express();
app.use(express.json());

let polls = {};
let pollIdSeq = 1;

// 投票作成
app.post('/polls', (req, res) => {
  const { question, options } = req.body;
  if (!question || !Array.isArray(options) || options.length === 0) {
    return res.status(400).json({ error: 'Invalid request' });
  }
  const id = String(pollIdSeq++);
  polls[id] = {
    question,
    options: options.map(name => ({ name, votes: 0 }))
  };
  res.status(201).json({ id });
});

// 投票
app.post('/polls/:id/vote', (req, res) => {
  const { id } = req.params;
  const { option } = req.body;
  const poll = polls[id];
  if (!poll) return res.status(404).json({ error: 'Poll not found' });
  const opt = poll.options.find(o => o.name === option);
  if (!opt) return res.status(400).json({ error: 'Invalid option' });
  opt.votes += 1;
  res.json({ message: 'Vote counted' });
});

// 集計取得
app.get('/polls/:id', (req, res) => {
  const { id } = req.params;
  const poll = polls[id];
  if (!poll) return res.status(404).json({ error: 'Poll not found' });
  res.json({
    question: poll.question,
    options: poll.options
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Poll API listening on port ${port}`);
});
