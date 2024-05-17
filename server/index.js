const express = require('express');
const app = express();
const dataFile = './data.json';
//const data = require(dataFile);
const fsp = require('fs/promises');

app.use(express.json());

const getemployees = function(){

}

const getCompanyData =function(res){
    let data = {};
    let compData ='';
    fsp.readFile(dataFile,'utf8')
    .then(function (result) {
        data=JSON.parse(result);
        //console.log(data.access_token);

        fetch("https://sandbox.tryfinch.com/api/employer/company", {
            method: "GET", // *GET, POST, PUT, DELETE, etc.
            headers: {"Content-Type": "application/json",
                        "Authorization": "Bearer "+data.access_token
                    },
        }).then(function(response){
            return response.json();
        }).then(function(d){
            data.comp = d;

            fetch("https://sandbox.tryfinch.com/api/employer/directory", {
                method: "GET", // *GET, POST, PUT, DELETE, etc.
                headers: {"Content-Type": "application/json",
                            "Authorization": "Bearer "+data.access_token
                        },
            }).then(function(response){
                return response.json();
            }).then(function(d){
                data.dir = d;

                res.send(JSON.stringify(data));

                
            })
            .catch(function(error) {
                console.log(`Download error: ${error.message}`);
            });
            
        })
        .catch(function(error) {
            console.log(`Download error: ${error.message}`);
        });

        
    })
    .catch(function (error) {
        console.log(error);
    })


}

const storeKey = function(data){
    fsp.writeFile(dataFile,JSON.stringify(data, null, 2)).then(function(response){
        console.log(response);
      })
      .catch(function(error) {
      console.log(`write error: ${error.message}`);
    });
}

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
        
        getCompanyData(res);
        
      })
      .catch(function(error) {
      console.log(`Download error: ${error.message}`);
    });
  });


app.listen(5155, () => {
    console.log('server listening on port 5155');
});