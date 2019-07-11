const clientMaker = require('../database.js');


const apiPostController = {
  postVote: (req, res) => {
    const useremail = res.locals.verifiedEmail;
    const { resourceid, upvote } = req.body;
    const text = 'INSERT INTO votes (resourceid, useremail, upvote) VALUES ($1, $2, $3) ON CONFLICT (resourceid, useremail) DO UPDATE  SET upvote = $3 RETURNING *';
    const values = [resourceid, useremail, upvote];
    const client = clientMaker();
    const checkVotes = `SELECT count(case when upvote = FALSE then 1 end)
    FROM votes WHERE resourceid = ${resourceid};`;
    client.connect((err) => {
      if (err) res.status(504).send('Internal error');
      Promise.all([client.query(text, values), client.query(checkVotes)])
        .then(([, downVotes]) => {
          const { count } = downVotes.rows[0];
          console.log('***NUM OF DOWNVOTES***:', count);
          if (count >= 1) console.log('DELETED RESOURCE');
          //  client.query(`DELETE FROM resources WHERE resourceid = ${resourceid}`)
          // .then(()=>client.end())
          // .catch(errDel=> res.status(500).send(`Error deleting resource: ${errDel}`));
        })
        .catch(error => console.log('err@postVote:', error));
    });
  },

  postResource: (req, res) => {
    const { categoryid, link, author } = req.body;
    console.log(categoryid, link, author);
    const text = 'INSERT INTO resources (categoryid, link, author, iscommunity) VALUES ($1, $2, $3, $4) RETURNING *';
    const values = [categoryid, link, author, true];
    const client = clientMaker();
    client.connect()
      .then(() => client.query(text, values)
        .then((result) => {
          client.end();
          return res.status(200).send(result.rows);
        })
        .catch(() => res.status(504).send('Internal error')))
      .catch(e => res.status(504).send(`Internal error: ${e}`));
  },
};

module.exports = apiPostController;
