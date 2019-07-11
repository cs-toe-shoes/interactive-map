const clientMaker = require('../database.js');

const apiPostController = {
  postVote: (req, res) => {
    const useremail = res.locals.verifiedEmail;
    const { resourceid, upvote } = req.body;
    const text = 'INSERT INTO votes (resourceid, useremail, upvote) VALUES ($1, $2, $3) ON CONFLICT (resourceid, useremail) DO UPDATE  SET upvote = $3 RETURNING *';
    const values = [resourceid, useremail, upvote];
    const client = clientMaker();
    client.connect((err) => {
      if (err) {
        return res.status(504).send('Internal error');
      }
      client.query(text, values, (err, result) => {
        if (err) {
          console.log('postController => postVote => client.query', err);
          return res.send(err);
        }
        console.log('postController => postVote => client.query', result.rows);
        client.end();
        return res.send(result.rows);
      });
    });
  },

  postResource: (req, res) => {
    const { categoryid, link, author } = req.body;
    // console.log(categoryid, link, author);
    const text = 'INSERT INTO resources (categoryid, link, author, iscommunity) VALUES ($1, $2, $3, $4) RETURNING *';
    const values = [categoryid, link, author, true];
    const client = clientMaker();
    client.connect((err) => {
      // if(err) res.status(504).send('Internal error');
      client.query(text, values, (err, result) => {
        if (err) console.log('Error ', err);
        client.end();
        return res.status(200).send(result.rows);
      });
    });
  },

  postCategory: (req, res) => {
    const { category } = req.body;
    console.log(req.body);
    const queryString = 'INSERT INTO categories (category) VALUES ($1) RETURNING *';
    const values = [category];
    const client = clientMaker();
    client.connect((err) => {
      client.query(queryString, values, (error, result) => {
        if (err) console.log('Error', error);
        client.end();
        return res.status(200).send(result.rows);
      });
    });
  },
};

module.exports = apiPostController;
