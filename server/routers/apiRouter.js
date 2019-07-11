const express = require('express');
const { getData, getCategory } = require('../controllers/apiGetController.js');
const { postVote, postResource, postCategory } = require('../controllers/apiPostController.js');
const {
  getoAuthCode,
  getAccessToken,
  getAPI,
  jwtCookie,
  setVerifiedEmail,
} = require('../controllers/oAuthController.js');
const {
  getGoogleAuthCode,
  getGoogleToken,
  getGoogleEmail,
  getGooglePicture,
} = require('../controllers/googleAuthController');
const socketController = require('../controllers/socketController');

const apiRouter = express.Router();

apiRouter.get('/category', getCategory);
apiRouter.get('/resources/:id', setVerifiedEmail, getData);
// apiRouter.get('/upvoted/:id', getUpvotedResources);

// create a route for the callbackURL
// this is the response from the GitHub OAuth server after client requests to use GitHub for Oauth
apiRouter.get('/login', getoAuthCode, getAccessToken, getAPI, jwtCookie);
apiRouter.get('/googleAuth', getGoogleAuthCode, getGoogleToken, getGoogleEmail, jwtCookie);
apiRouter.get('/googlePicture', getGooglePicture);
apiRouter.get('/verify', setVerifiedEmail, (req, res) => {
  if (res.locals.verifiedEmail) return res.send({ verified: true });
  return res.send({ verified: false });
});
// apiRouter.get('/fakeData', getFakeData);

apiRouter.post('/vote/', setVerifiedEmail, socketController.emitVote, postVote);
apiRouter.post('/resource/', postResource);
apiRouter.post('/category/', postCategory);

module.exports = apiRouter;
