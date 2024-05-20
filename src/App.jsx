import React, {useState, useEffect} from 'react';
import Form from '@rjsf/antd';
import validator from '@rjsf/validator-ajv8';
import { Button, Spin, Menu, Flex, Layout, Card, Table, Badge, Drawer, Space, InputNumber } from 'antd';
const { Column } = Table;
const { Header, Sider, Content } = Layout;

import {headerStyle, contentStyle, siderStyle,layoutStyle, providers_list} from './constants.js';

import compSchema from  './forms/company_form.json';
import indSchema from  './forms/ind_form.json';
import empSchema from  './forms/emp_form.json';



const App = () => {

  const [compData, setCompData] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [compName, setCompName] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [individual, setIndividual] = useState([]);
  const [employeeCount, setEmployeeCount] = useState("10");

  const onClose = () => {
  };
  
  const onSelectProvider = (e) => {
    fetch("/api/sandbox/create", {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        "provider_id": e.key,
        "products": ["company", "directory", "individual", "employment"],
        "employee_size": employeeCount
      }), // body data type must match "Content-Type" header
    }).then(function(response){
      return response.json();
    }).then(function(data){
      updateForms(data);
    })
    .catch(function(error) {
      console.log(`Download error: ${error.message}`);
    });
  }

  const FormDataCheck = (p) =>{
      const code = p.fData;
      console.log(code);
      if (typeof code == "undefined") {
        return <h3></h3>
      }else if (code.id) {
        return <Form 
            schema={compSchema}
            formData={compData.comp}
            validator={validator} 
            uiSchema={{
              "ui:submitButtonOptions": { norender: true },
              'ui:style': { borderWidth: 0 },
              "departments": {
                "ui:options": {
                  "addable": false,
                  "orderable": false,
                  "removable": false
                }
              },
              "locations": {
                "ui:options": {
                  "addable": false,
                  "orderable": false,
                  "removable": false
                }
              },
              "accounts": {
                "ui:options": {
                  "addable": false,
                  "orderable": false,
                  "removable": false
                }
              },
            }}
          />;
      }

      return <h3>Endpoint Not Implemented</h3>;
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
    })
    .catch(function(error) {
      console.log(`Download error: ${error.message}`);
    });
  }

  const updateForms = (data) =>{
    setCompData(data);
    setCompName(data.comp.legal_name);
    setEmployees(data.dir.individuals);
  }
  
  const openEmployeeDrawer = (id) => {
    getEmployeeData(id);
    setDrawerOpen(true);
  }
  

  return (
    <div className='App'>
       
      <Layout style={layoutStyle}>
        <Sider width="20%" style={siderStyle}>
          <Space direction='horizontal' >
              <Space style={{paddingLeft: '6px', fontWeight:500}}>Directory Size</Space>
          <InputNumber min={1} max={200} defaultValue={10} size="large" variant="filled" onChange={(e)=>{setEmployeeCount(e)}} />
          </Space>
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
              <FormDataCheck fData={compData.comp} />
              
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
                <Button onClick={()=>{setDrawerOpen(false)}}>Close</Button>
              </Space>
            }
          >
            <Card
              title="Information"
              style={{
                width: '100%',
              }}
            >
              <Form 
                schema={indSchema}
                formData={individual.ind}
                validator={validator} 
                uiSchema={{
                  "ui:submitButtonOptions": { norender: true },
                  "responses":{
                    "ui:options": {
                      "addable": false,
                      "orderable": false,
                      "removable": false
                    },
                    "items":{
                      "body":{
                        "phone_numbers": {
                          "ui:options": {
                            "addable": false,
                            "orderable": false,
                            "removable": false
                          }
                        },
                        "emails": {
                          "ui:options": {
                            "addable": false,
                            "orderable": false,
                            "removable": false
                          }
                        },
                        "accounts": {
                          "ui:options": {
                            "addable": false,
                            "orderable": false,
                            "removable": false
                          }
                        },
                      }
                        
                    }
                  }
                  
                }}
               />
            </Card>
            <Card
              title="Employment Data"
              style={{
                width: '100%',
              }}
            > 
              <Form 
                schema={empSchema}
                formData={individual.emp}
                validator={validator} 
                uiSchema={{
                  "ui:submitButtonOptions": { norender: true },
                  "responses":{
                    "ui:options": {
                      "addable": false,
                      "orderable": false,
                      "removable": false
                    },
                    'ui:style': { borderWidth: 0 },

                  }
                }}
               />
            </Card>
          </Drawer>
        </Layout>
      </Layout>
    </div>
    );
};

export default App;