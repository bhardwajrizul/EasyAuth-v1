const rateLimit = (maxTokens, refillTime) => {
  const tokens = new Map();

  const interval = setInterval(() => {
    for (const [key, value] of tokens.entries()) {
      tokens.set(key, Math.min(maxTokens, value + 1));
    }
  }, refillTime);

  return (req, res, next) => {
    let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    // console.log(ip);
    ip = ip.split(',')[0].trim();
    // console.log("Client Public IP :  ",(ip));


    if (!tokens.has(ip)) {
      tokens.set(ip, maxTokens);
    }

    const tokenCount = tokens.get(ip);

    if (tokenCount === 0) {
      console.log("Client Public IP :  ", (ip));
      res.statusCode = 429;
      res.setHeader('Retry-After', Math.ceil(refillTime / 1000));
      res.end('Too many requests!! Retry-After ' + Math.ceil(refillTime / 1000) + ' seconds :-)');
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


// When you connect your computer to a local network (such as your home Wi-Fi), your computer is 
// assigned a private IP address by the router. The private IP address is used to identify your 
// computer within the local network. Other devices on the same network can communicate with your 
// computer using this IP address.

// When you make a request to a server on the internet, your request goes through your router first.
// Your router then assigns a public IP address to your request and sends it to the internet.
// The public IP address is used to identify your network on the internet.
// The server on the internet sees your request coming from this public IP address and
// sends its response to that same address.

// When the response arrives at your router, it checks which private IP address the request came from
// and forwards the response to your computer. Your computer then processes the response and displays
// it in your web browser.

// So, in summary, your private IP address is assigned by your router to identify your 
// computer on the local network, while your public IP address is assigned by your router to identify 
// your network on the internet