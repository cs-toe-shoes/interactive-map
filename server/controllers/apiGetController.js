const jwt = require('jsonwebtoken');
const clientMaker = require('../database.js');
const { cookieSecret } = require('../server_settings/oAuthSettings');

const apiGetController = {
  getData: (req, res) => {
    const { id } = req.params;
    const queryString = `
      SELECT  a.link,
              a.resourceid,
              SUM(case when b.upvote = TRUE then 1 else 0 end) sumUpvote,
              SUM(case when b.upvote = FALSE then 1 else 0 end) sumDownvote,
              SUM(case
                WHEN b.upvote IS TRUE then 1
                WHEN b.upvote IS FALSE then -0.5
                WHEN b.upvote IS NULL then 0
                end) score,
              SUM(case 
                when b.useremail='${res.locals.verifiedEmail}' AND b.upvote IS TRUE then 1
                when b.useremail='${res.locals.verifiedEmail}' AND b.upvote IS FALSE then -1
                when b.useremail='${res.locals.verifiedEmail}' AND b.upvote IS NULL then 0
                end) hasVoted
      FROM    resources a
              FULL JOIN votes b
                  ON a.resourceid = b.resourceid
              WHERE a.categoryid = ${id}
      GROUP   BY b.resourceid, a.link, a.resourceid
        ORDER BY score DESC;`;

    const client = clientMaker();
    client.connect((err) => {
      // if(err) res.status(504).send('Internal error');
      client.query(queryString, (err, result) => {
        if (err) {
          console.log('getController => getData => client.query', err);
          return res.status(504).send(err);
        }
        // console.log(result.rows);
        const results = result.rows;
        // console.log('getController => getData => client.query', results);
        client.end();
        return res.status(200).send(results);
      });
    });
  },
  getCategory: (req, res) => {
    const queryIdString = 'SELECT * FROM categories';
    const client = clientMaker();
    client.connect((err) => {
      if (err) {
        console.log('getController => getCategory => client.query', err);
        return res.status(504).send(err);
      }
      client.query(queryIdString, (err, result) => {
        if (err) return res.status(504).send(err);
        const results = result.rows;
        client.end();
        return res.status(200).send(results);
      });
    });
  },
};

module.exports = apiGetController;
