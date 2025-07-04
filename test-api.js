#!/usr/bin/env node

/**
 * API Testing Script for Sebenza Logistics Suite
 * Tests the newly created API endpoints
 */

const API_BASE = 'http://localhost:3001/api';

// Test credentials
const loginData = {
  email: 'admin@sebenza.com',
  password: 'password'
};

let authToken = '';

async function makeRequest(url, options = {}) {
  const fullUrl = url.startsWith('http') ? url : `${API_BASE}${url}`;
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...(authToken && { 'Authorization': `Bearer ${authToken}` }),
  };

  const response = await fetch(fullUrl, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  const data = await response.json();
  return { status: response.status, data };
}

async function testLogin() {
  console.log('🔐 Testing Login...');
  
  const { status, data } = await makeRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(loginData),
  });

  if (status === 200 && data.success) {
    authToken = data.data.token;
    console.log('✅ Login successful');
    console.log(`👤 User: ${data.data.user.name} (${data.data.user.role})`);
    console.log(`🏢 Company: ${data.data.company.name}`);
    return true;
  } else {
    console.log('❌ Login failed:', data.error);
    return false;
  }
}

async function testProjects() {
  console.log('\n📋 Testing Projects API...');
  
  // List projects
  const { status, data } = await makeRequest('/projects');
  
  if (status === 200 && data.success) {
    console.log(`✅ Retrieved ${data.data.length} projects`);
    console.log(`📊 Pagination: ${data.pagination.page}/${data.pagination.totalPages} (${data.pagination.total} total)`);
    
    // Test creating a new project
    const newProject = {
      name: 'API Test Project',
      location: 'Test Location',
      description: 'Created via API test',
      status: 'Active',
      endDate: '2024-12-31',
    };
    
    const createResponse = await makeRequest('/projects', {
      method: 'POST',
      body: JSON.stringify(newProject),
    });
    
    if (createResponse.status === 201 && createResponse.data.success) {
      console.log('✅ Project created successfully');
      console.log(`🆔 Project ID: ${createResponse.data.data.id}`);
      return createResponse.data.data.id;
    } else {
      console.log('❌ Project creation failed:', createResponse.data.error);
    }
  } else {
    console.log('❌ Projects retrieval failed:', data.error);
  }
  
  return null;
}

async function testTasks(projectId) {
  console.log('\n📝 Testing Tasks API...');
  
  // List tasks
  const { status, data } = await makeRequest('/tasks');
  
  if (status === 200 && data.success) {
    console.log(`✅ Retrieved ${data.data.length} tasks`);
    
    // Test creating a new task
    if (projectId) {
      const newTask = {
        projectId,
        name: 'API Test Task',
        status: 'PENDING',
        assignee: 'Test User',
        dueDate: '2024-12-31',
      };
      
      const createResponse = await makeRequest('/tasks', {
        method: 'POST',
        body: JSON.stringify(newTask),
      });
      
      if (createResponse.status === 201 && createResponse.data.success) {
        console.log('✅ Task created successfully');
        console.log(`🆔 Task ID: ${createResponse.data.data.id}`);
      } else {
        console.log('❌ Task creation failed:', createResponse.data.error);
      }
    }
  } else {
    console.log('❌ Tasks retrieval failed:', data.error);
  }
}

async function testClients() {
  console.log('\n👥 Testing Clients API...');
  
  const { status, data } = await makeRequest('/clients');
  
  if (status === 200 && data.success) {
    console.log(`✅ Retrieved ${data.data.length} clients`);
    
    // Test creating a new client
    const newClient = {
      name: 'API Test Client',
      email: 'test@example.com',
      phone: '555-0123',
      address: '123 Test St, Test City, TC 12345',
    };
    
    const createResponse = await makeRequest('/clients', {
      method: 'POST',
      body: JSON.stringify(newClient),
    });
    
    if (createResponse.status === 201 && createResponse.data.success) {
      console.log('✅ Client created successfully');
      console.log(`🆔 Client ID: ${createResponse.data.data.id}`);
    } else {
      console.log('❌ Client creation failed:', createResponse.data.error);
    }
  } else {
    console.log('❌ Clients retrieval failed:', data.error);
  }
}

async function testInvoices() {
  console.log('\n💰 Testing Invoices API...');
  
  const { status, data } = await makeRequest('/invoices');
  
  if (status === 200 && data.success) {
    console.log(`✅ Retrieved ${data.data.length} invoices`);
  } else {
    console.log('❌ Invoices retrieval failed:', data.error);
  }
}

async function testEmployees() {
  console.log('\n👨‍💼 Testing Employees API...');
  
  const { status, data } = await makeRequest('/employees');
  
  if (status === 200 && data.success) {
    console.log(`✅ Retrieved ${data.data.length} employees`);
  } else {
    console.log('❌ Employees retrieval failed:', data.error);
  }
}

async function testInventory() {
  console.log('\n📦 Testing Inventory API...');
  
  const { status, data } = await makeRequest('/inventory');
  
  if (status === 200 && data.success) {
    console.log(`✅ Retrieved ${data.data.length} stock items`);
  } else {
    console.log('❌ Inventory retrieval failed:', data.error);
  }
}

async function testWarehouses() {
  console.log('\n🏭 Testing Warehouses API...');
  
  const { status, data } = await makeRequest('/warehouses');
  
  if (status === 200 && data.success) {
    console.log(`✅ Retrieved ${data.data.length} warehouses`);
  } else {
    console.log('❌ Warehouses retrieval failed:', data.error);
  }
}

async function runTests() {
  console.log('🚀 Starting API Tests for Sebenza Logistics Suite\n');
  
  try {
    // Test authentication first
    const loginSuccess = await testLogin();
    if (!loginSuccess) {
      console.log('\n❌ Authentication failed. Stopping tests.');
      return;
    }
    
    // Test all endpoints
    const projectId = await testProjects();
    await testTasks(projectId);
    await testClients();
    await testInvoices();
    await testEmployees();
    await testInventory();
    await testWarehouses();
    
    console.log('\n🎉 All API tests completed!');
    
  } catch (error) {
    console.error('\n💥 Test failed with error:', error.message);
  }
}

// Run tests if this script is executed directly
if (typeof require !== 'undefined' && require.main === module) {
  runTests();
}

module.exports = { runTests };
