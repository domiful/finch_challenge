const express = require('express');
const app = express();
const dataFile = './data.json';
//const data = require(dataFile);
const fsp = require('fs/promises');

app.use(express.json());


//gets company data after provider sandbox is created
const getCompanyData =function(res){
    let data = {};
    let cData = {};
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
            cData.comp = d;

            fetch("https://sandbox.tryfinch.com/api/employer/directory", {
                method: "GET", // *GET, POST, PUT, DELETE, etc.
                headers: {"Content-Type": "application/json",
                        "Authorization": "Bearer "+data.access_token
                        },
            }).then(function(response){
                return response.json();
            }).then(function(d){
                console.log(d);
                cData.dir = d;

                res.send(JSON.stringify(cData));

                
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

//stores access token to local storage
//should be encrypted 
const storeKey = function(data){
    return fsp.writeFile(dataFile,JSON.stringify(data, null, 2));
    
}


//creates the sandbox provider and stores the access token that is received
app.post('/api/sandbox/create', (req, res) => {
    // get request values inside req.body
    //console.log(req.body.provider_id);
    fetch("https://sandbox.tryfinch.com/api/sandbox/create", {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            "provider_id": req.body.provider_id,
            "products": ["company", "directory", "individual", "employment"],
            "employee_size": req.body.employee_size
          }), // body data type must match "Content-Type" header
      }).then(function(response){
        return response.json();
      }).then(function(d){
        
        storeKey(d).then(function(response){
            return response;
          }).then(function(d){
            getCompanyData(res);
        }).catch(function(error) {
            console.log(`Download error: ${error.message}`);
          });
        
        
      })
      .catch(function(error) {
      console.log(`Download error: ${error.message}`);
    });
});

//returns the individual and employemt data for a user selected employee
app.post('/api/employer/individual', (req, res) => {
    let data = {};
    let eData = {};
    fsp.readFile(dataFile,'utf8')
    .then(function (result) {
        data=JSON.parse(result);
        fetch("https://sandbox.tryfinch.com/api/employer/individual", {
            method: "POST", // *GET, POST, PUT, DELETE, etc.
            headers: {"Content-Type": "application/json",
                    "Authorization": "Bearer " + data.access_token
                    },
            body: JSON.stringify({"requests": [req.body]}), // body data type must match "Content-Type" header

        }).then(function(response){
            return response.json();
        }).then(function(d){
            eData.ind = d;

            
            fetch("https://sandbox.tryfinch.com/api/employer/employment", {
                method: "POST", // *GET, POST, PUT, DELETE, etc.
                headers: {"Content-Type": "application/json",
                        "Authorization": "Bearer " + data.access_token
                        },
                body: JSON.stringify({"requests": [req.body]}), // body data type must match "Content-Type" header

            }).then(function(response){
                return response.json();
            }).then(function(d){
                eData.emp = d;

                res.send(JSON.stringify(eData));

                
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
        console.log(`Other error: ${error.message}`);
    })


    
});


app.listen(5155, () => {
    console.log('server listening on port 5155');
});