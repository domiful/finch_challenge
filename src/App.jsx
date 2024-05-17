import React, {useState, useEffect} from 'react';
import { Button, Spin, Menu, Flex, Layout, Card, Table, Badge } from 'antd';
const { Header, Sider, Content } = Layout;

const headerStyle = {
  textAlign: 'center',
  color: '#fff',
  height: 64,
  paddingInline: 48,
  lineHeight: '64px',
  backgroundColor: '#4096ff',
};
const contentStyle = {
  minHeight: 120,
  lineHeight: '120px',
  color: '#fff',
  backgroundColor: '#0958d9',
};
const siderStyle = {
  lineHeight: '120px',
  color: '#fff',
  backgroundColor: '#1677ff',
};
const layoutStyle = {
  borderRadius: 8,
  overflow: 'hidden',
  width: '90%',
  maxWidth: 'calc(100% - 8px)',
};

const columns = [
  {
    title: 'First Name',
    dataIndex: 'first_name',
    key: 'fname',
  },
  {
    title: 'Middle Name',
    dataIndex: 'middle_name',
    key: 'mname',
  },
  {
    title: 'Last Name',
    dataIndex: 'last_name',
    key: 'lname',
  },
  {
    title: 'Manager',
    dataIndex: 'manager',
    key: 'manager',
    render: (text, record) => {
      if (record.manager.id) {
        return (
          <a onClick={()=>{openEmployeeModal(record.manager.id)}}>Manager</a>
  
        );
      }
      
    },

  },
  {
    title: 'Department',
    dataIndex: 'department',
    key: 'department',
    render: (text, record) => (
        <span>{record.department.name}</span>
    ),
  },
  {
    title: 'Active',
    dataIndex: 'is_active',
    key: 'active',
    render: (text) => {
        let color = 'error';
        if (text) {
          color = 'success';
        }
        return (
          <Badge status={color} text={text} />

        );
      }, 
  },
];

const openEmployeeModal = (id) =>{
  console.log(id);

}

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
  const [employees, setEmployees] = useState([]);
  const [compName, setCompName] = useState("");

  
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
      //console.log(data.legal_name);
      updateForms(data);
    })
    .catch(function(error) {
      console.log(`Download error: ${error.message}`);
    });
  }

  const updateForms = (data) =>{
    setData(data);
    setCompName(data.comp.legal_name);
    setEmployees(data.dir.individuals);
  }
  

  return (
    <div className='App'>
       
      <Layout style={layoutStyle}>
        <Sider width="20%" style={siderStyle}>
          <Menu
            onClick={onClick}
            defaultSelectedKeys={['1']}
            mode="inline"
            items={providers_list}
          />
        </Sider>
        <Layout>
          <Header style={headerStyle}>{compName}</Header>
          <Content width="70%" style={contentStyle}>
            <Card
              title="Information"
              style={{
                width: '100%',
              }}
            >
              {JSON.stringify(data.comp,null,2)}
            </Card>
            <Card
              title="Directory"
              style={{
                width: '100%',
              }}
            >

            <Table dataSource={employees} columns={columns} />

            </Card>
          </Content>
        </Layout>
    </Layout>
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