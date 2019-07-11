const socketController = {
  emitVote: (req, res, next) => {
    console.log(req.body);
    const { upvote: vote, resource } = req.body;
    // req.io.emit('vote', { votedBy: res.locals.verifiedEmail, vote, resource });
    req.socket.broadcast.emit('vote', { votedBy: res.locals.verifiedEmail, vote, resource });
    return next();
  },
};

module.exports = socketController;
