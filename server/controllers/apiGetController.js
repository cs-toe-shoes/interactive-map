const clientMaker = require('../database.js');

const apiGetController = {
  getData: (req, res) => {
    const { id } = req.params;
    const queryString = `
      SELECT  a.link,
              a.resourceid,
              SUM(case when b.upvote = TRUE then 1 else 0 end) sumUpvote,
              SUM(case when b.upvote = FALSE then 1 else 0 end) sumDownvote,
              SUM(case when b.upvote = TRUE then 1 else -0.5 end) score
      FROM    resources a
              FULL JOIN votes b
                  ON a.resourceid = b.resourceid
              WHERE a.categoryid = ${id}
      GROUP   BY b.resourceid, a.link, a.resourceid
        ORDER BY score DESC;`;

    const client = clientMaker();
    client.connect()
      .then(() => client.query(queryString)
        .then((result) => {
          client.end();
          return res.status(200).send(result.rows);
        })
        .catch(err => res.status(504).send(`Internal error: ${err}`)))
      .catch(err => res.status(504).send(`Internal error: ${err}`));
  },
  getCategory: (req, res) => {
    const queryIdString = 'SELECT * FROM categories';
    const client = clientMaker();
    client.connect()
      .then(() => client.query(queryIdString)
        .then(results => res.status(200).send(results.rows))
        .catch(err => res.status(504).send(`Internal Error: ${err}`)))
      .catch(err => res.status(504).send(`Internal Error: ${err}`));
  },
};
module.exports = apiGetController;
