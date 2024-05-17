const express = require('express');
const app = express();
const dataFile = './data.json';
//const data = require(dataFile);
const fsp = require('fs/promises');

app.use(express.json());

const getemployees = function(){

}

const getCompanyData =function(){
    let data = {};

    fsp.readFile(dataFile)
    .then(function (result) {
        data=result;
        console.log(data);
    })
    .catch(function (error) {
        console.log(error);
    })
    /*
    fetch("https://sandbox.tryfinch.com/api/sandbox/create", {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(req.body), // body data type must match "Content-Type" header
      }).then(function(response){
        return response.json();
      }).then(function(d){
        
        storeKey(d);
        res.send(d);
      })
      .catch(function(error) {
      console.log(`Download error: ${error.message}`);
    });*/
}

const storeKey = function(data){
    console.log(data);

    fsp.writeFile(dataFile,JSON.stringify(data, null, 2)).then(function(response){
        console.log(response);
      })
      .catch(function(error) {
      console.log(`write error: ${error.message}`);
    });
}

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
      }).then(function(d){
        
        storeKey(d);
        
        
        res.send(d);
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
});