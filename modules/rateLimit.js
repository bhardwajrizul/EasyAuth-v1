const rateLimit = (maxTokens, refillTime) => {
  const tokens = new Map();

  const interval = setInterval(() => {
    for (const [key, value] of tokens.entries()) {
      tokens.set(key, Math.min(maxTokens, value + 1));
    }
  }, refillTime);

  return (req, res, next) => {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    console.log(ip);

    if (!tokens.has(ip)) {
      tokens.set(ip, maxTokens);
    }

    const tokenCount = tokens.get(ip);

    if (tokenCount === 0) {
      res.statusCode = 429;
      res.setHeader('Retry-After', Math.ceil(refillTime / 1000));
      res.end('Too many requests');
      return;
    }

    tokens.set(ip, tokenCount - 1);

    res.on('finish', () => {
      if (!res.headersSent) {
        tokens.set(ip, tokenCount);
      }
    });

    next();
  };
};

module.exports = rateLimit;
