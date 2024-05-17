import React, {useState, useEffect} from 'react';
import { Button, Spin, Dropdown, Menu } from 'antd';

const providers_list = [
  {label: 'Select Provider', key: '1'},
  {label: 'ADP Run', key: 'adp_run'},
  {label: 'Bamboo HR', key: 'bamboo_hr'}, 
  {label: 'Bamboo HR (API)', key: 'bamboo_hr_api'},
  {label: 'HiBob', key: 'bob'},
  {label: 'Gusto', key: 'gusto'},
  {label: 'Humaans', key: 'humaans'},
  {label: 'Insperity', key: 'insperity'},
  {label: 'Justworks', key: 'justworks'},
  {label: 'Namely', key: 'namely'}, 
  {label: 'Paychex Flex', key: 'paychex_flex'}, 
  {label: 'Paychex Flex (API)', key: 'paychex_flex_api'}, 
  {label: 'Paycom', key: 'paycom'}, 
  {label: 'Paycom (API)', key: 'paycom_api'}, 
  {label: 'Paylocity', key: 'paylocity'}, 
  {label: 'Paylocity (API)', key: 'paylocity_api'}, 
  {label: 'Personio', key: 'personio'}, 
  {label: 'Quickbooks', key: 'quickbooks'}, 
  {label: 'Rippling', key: 'rippling'}, 
  {label: 'Sage HR', key: 'sage_hr'}, 
  {label: 'Sapling', key: 'sapling'}, 
  {label: 'Squoia One', key: 'sequoia_one'}, 
  {label: 'Square Payroll', key: 'square_payroll'}, 
  {label: 'Trinet', key: 'trinet'}, 
  {label: 'Trinet (API)', key: 'trinet_api'}, 
  {label: 'Ulti Pro', key: 'ulti_pro'},
  {label: 'Wave', key: 'wave'},
  {label: 'Workday', key: 'workday'},
  {label: 'Zenefits', key: 'zenefits'},
  {label: 'Zenefits (API)', key: 'zenefits_api'}
];


const App = () => {

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  
  const onClick = (e) => {
    console.log('click ', e);

    fetch("/api/sandbox/create", {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        "provider_id": e.key,
        "products": ["company", "directory", "individual", "employment"],
        "employee_size": 10
      }), // body data type must match "Content-Type" header
    }).then(function(response){
      return response.json();
    }).then(function(data){
      console.log(data);
    })
    .catch(function(error) {
    console.log(`Download error: ${error.message}`);
  });
    /*fetch("/api/sandbox/create", {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          "provider_id": e.key,
          "products": ["company", "directory", "individual", "employment"],
          "employee_size": 10
        }), // body data type must match "Content-Type" header
      }).then(function(response){
        return response.json();
      }).then(function(data){
        console.log(data);
      })
      .catch(function(error) {
      console.log(`Download error: ${error.message}`);
    });
    */

  }
  

  return (
    <div className='App'>
       <Menu
        onClick={onClick}
        style={{
          width: 180,
        }}
        defaultSelectedKeys={['1']}
        mode="inline"
        items={providers_list}
      />
    </div>
);
  /*if (loading) {
    return (
        <div className='App'>
            <Spin />
        </div>
    );
} else
    return (
        <div className='App'>
            <h1>Check Employee</h1>
            <h3>Providers</h3>
            <div className='container'>
                {data.map((e) => (
                    <div className='item' key={e.title}>
                        <div>
                            <b>Title: </b>
                            {e.title}
                        </div>
                        <div>
                            <b>Description: </b>
                            {e.body}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
    */
};

export default App;