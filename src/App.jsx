import React, {useState, useEffect} from 'react';
import { Button, Spin, Menu, Flex, Layout, Card, Table, Badge, Drawer, Space } from 'antd';
const { Column } = Table;

//import style from './style.module.css';
const { Header, Sider, Content } = Layout;

const headerStyle = {
  textAlign: 'center',
  fontSize:'18px',
  fontWeight: '600',
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
  const [compData, setCompData] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [compName, setCompName] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [individual, setIndividual] = useState([]);

  const onClose = () => {
    setDrawerOpen(false);
  };
  
  const onSelectProvider = (e) => {
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

  const getEmployeeData = (eid) => {
    fetch("/api/employer/individual", {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        "individual_id":eid,
      }), // body data type must match "Content-Type" header
    }).then(function(response){
      return response.json();
    }).then(function(data){
      console.log(data);
      setIndividual(data);
      //updateForms(data);
    })
    .catch(function(error) {
      console.log(`Download error: ${error.message}`);
    });
  }

  const updateForms = (data) =>{
    setCompData(data);
    setCompName(compData.comp.legal_name);
    setEmployees(compData.dir.individuals);
  }
  
  const openEmployeeDrawer = (id) => {
    getEmployeeData(id);
    setDrawerOpen(true);
  }
  

  return (
    <div className='App'>
       
      <Layout style={layoutStyle}>
        <Sider width="20%" style={siderStyle}>
          <Menu
            onClick={onSelectProvider}
            defaultSelectedKeys={['1']}
            mode="inline"
            items={providers_list}
          />
        </Sider>
        <Layout>
          <Header style={headerStyle}>{compName}</Header>
          <Content width="70%" style={contentStyle}>
          <Space
            direction="vertical"
            size="middle"
            style={{
              display: 'flex',
              padding: '1em'
            }}
          >
            <Card
              title="Information"
              style={{
                width: '100%',
              }}
            >
              {JSON.stringify(compData.comp,null,2)}
            </Card>
            <Card
              title="Directory"
              style={{
                width: '100%',
              }}
            >

            <Table dataSource={employees}>
              <Column title="First Name" dataIndex="first_name" key="fname" />
              <Column title="Middle Name" dataIndex="middle_name" key="mname" />
              <Column title="Last Name" dataIndex="last_name" key="lname" />
              <Column
                title="Manager"
                dataIndex="manager"
                key="manager"
                render={(text, record) => {
                  if (record.manager.id) {
                    return (
                      <a onClick={()=>{openEmployeeDrawer(record.manager.id)}}>Manager</a>
              
                    );
                  }
                  
                }}
              />
              <Column
                title="Department"
                dataIndex="department"
                key="department"
                render={(text, record) => (
                  <span>{record.department.name}</span>
              )}
              />
              <Column
                title="Active"
                dataIndex="is_active"
                key="is_active"
                render={(text) => {
                  let color = 'error';
                  if (text) {
                    color = 'success';
                  }
                  return (
                    <Badge status={color} text={text} />
          
                  );
                }}
              />
              <Column
                title=""
                dataIndex="details"
                key="details"
                render={(text, record) => (
                  <a onClick={()=>{openEmployeeDrawer(record.id)}}>Details</a>
                )}
              />
            </Table>
            </Card>
            </Space>
          </Content>
          <Drawer
            title={'Employee'}
            placement="right"
            size={'large'}
            onClose={onClose}
            open={drawerOpen}
            extra={
              <Space>
                <Button onClick={onClose}>Close</Button>
                <Button type="primary" onClick={onClose}>
                  OK
                </Button>
              </Space>
            }
          >
            <Card
              title="Information"
              style={{
                width: '100%',
              }}
            >
              {JSON.stringify(individual.ind,null,2)}
            </Card>
            <Card
              title="Employment Data"
              style={{
                width: '100%',
              }}
            >
              {JSON.stringify(individual.emp,null,2)}
            </Card>
          </Drawer>
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