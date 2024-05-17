const express = require('express');
const app = express();

app.use(express.json());

app.post('/', (req, res) => {
  // get request values inside req.body
  const price = req.body.price
  const orderId = req.body.orderId

  res.send('Hello from our server!');
  // use price, orderId to do something meaningful
});

app.post('/api/sandbox/create', (req, res) => {
    // get request values inside req.body

    fetch("https://sandbox.tryfinch.com/api/sandbox/create", {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(req.body), // body data type must match "Content-Type" header
      }).then(function(response){
        return response.json();
      }).then(function(data){
        res.send(data);
      })
      .catch(function(error) {
      console.log(`Download error: ${error.message}`);
    });
  });

app.get('/', (req, res) => {
    res.send('{"Hello from our server!"}');
});

app.listen(5155, () => {
    console.log('server listening on port 5155');
})