const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const WebSocket = require('ws');
const { Player } = require('./player');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  server.listen(3000, (err) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3000');
  });

  const wss = new WebSocket.Server({ port: 3001 });
  let lastRes = [];
  let players = [];
  let ranking = [];
  let multiplier = 0;
  let interval;
  let speed = 2;
  let freezingPoint = Math.random() * 10;
  let predictedMultiplier = 0,
    guessPoints = 0;

  const generateAutoPlayers = (points) => {
    const arr = [];
    for (let i = 0; i < 4; i++) {
      arr.push(new Player(`CPU ${i + 1}`, points, Math.random() * 10));
    }
    arr.push(new Player(`You`, guessPoints, predictedMultiplier));
    return arr;
  };

  const calculateResults = () => {
    lastRes = players.map((a) => {
      return { ...a };
    });
    players.forEach((player) => {
      if (player.multiplier <= multiplier) {
        player.points = player.points * player.multiplier.toFixed(2);
      } else {
        player.points = 0;
      }
    });

    calculateRanking();
  };

  const calculateRanking = () => {
    for (let i = 0; i < ranking.length; i++) {
      if (players[i].multiplier <= multiplier) {
        ranking[i].points = ranking[i].points + players[i].points;
      } else {
        const res =
          ranking[i].points - lastRes[i].points * lastRes[i].multiplier;
        if (res >= 0) {
          ranking[i].points = res;
        } else {
          ranking[i].points = 0;
        }
      }
    }
  };

  ranking = generateAutoPlayers(100);

  wss.on('connection', (ws) => {
    console.log('New client connected');

    ws.on('message', (message) => {
      console.log('Received:', message);

      const data = JSON.parse(message);

      if (data.type === 'chatMessage') {
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(
              JSON.stringify({ type: 'chatMessage', message: data.message })
            );
          }
        });
      } else if (data.type === 'start') {
        if (interval) clearInterval(interval);
        multiplier = 0;
        freezingPoint = Math.random() * 10;
        speed = data.data.speed;
        predictedMultiplier = data.data.predictedMultiplier;
        guessPoints = data.data.guessPoints;
        players = generateAutoPlayers(100);
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: 'reset', players }));
          }
        });

        interval = setInterval(() => {
          let nextVal = multiplier + Math.random() * (speed / 10);
          if (nextVal >= freezingPoint) {
            clearInterval(interval);
            multiplier = freezingPoint;
            calculateResults();
            wss.clients.forEach((client) => {
              if (client.readyState === WebSocket.OPEN) {
                client.send(
                  JSON.stringify({
                    type: 'current_round',
                    players,
                    ranking,
                  })
                );
              }
            });
          } else {
            multiplier = nextVal;
          }
          wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify({ type: 'multiplier', multiplier }));
            }
          });
        }, 100);
      }
    });

    ws.on('close', () => {
      console.log('Client disconnected');
    });
  });

  console.log('WebSocket server running on ws://localhost:3001');
});
