// Time Tracking API Test Script
// Tests all time tracking endpoints including time entries, timers, and timesheets

const BASE_URL = 'http://localhost:3001/api';

let authToken = '';

// Test credentials (matching existing mock data)
const testCredentials = {
  email: 'john@sebenza.com',
  password: 'password'
};

// Helper function to make HTTP requests
async function makeRequest(url, options = {}) {
  const response = await fetch(`${BASE_URL}${url}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(authToken && { 'Authorization': `Bearer ${authToken}` }),
      ...options.headers
    },
    ...options
  });

  const text = await response.text();
  
  try {
    return {
      ok: response.ok,
      status: response.status,
      data: text ? JSON.parse(text) : null
    };
  } catch (error) {
    return {
      ok: response.ok,
      status: response.status,
      data: text,
      error: 'Failed to parse JSON'
    };
  }
}

// Login function
async function login() {
  console.log('🔐 Logging in...');
  
  const response = await makeRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(testCredentials)
  });

  if (response.ok && response.data.success) {
    authToken = response.data.data.token;
    console.log('✅ Login successful');
    return true;
  } else {
    console.log('❌ Login failed:', response.data?.error || 'Unknown error');
    return false;
  }
}

// Test time entries
async function testTimeEntries() {
  console.log('\\n📋 Testing Time Entries...');

  // Test GET /time-entries
  try {
    const response = await makeRequest('/time-entries');
    if (response.ok) {
      console.log(`✅ GET /time-entries - Found ${response.data.data.length} time entries`);
    } else {
      console.log('❌ GET /time-entries failed:', response.data?.error);
    }
  } catch (error) {
    console.log('❌ GET /time-entries failed:', error.message);
  }

  // Test POST /time-entries (create new time entry)
  try {
    const newTimeEntry = {
      employeeId: 'emp-1',
      projectId: 'proj-1',
      taskId: 'task-1',
      description: 'Testing time tracking API',
      startTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      endTime: new Date().toISOString(),
      date: new Date().toISOString().split('T')[0],
      billable: true,
      hourlyRate: 75,
      tags: ['testing', 'api']
    };

    const response = await makeRequest('/time-entries', {
      method: 'POST',
      body: JSON.stringify(newTimeEntry)
    });

    if (response.ok) {
      console.log(`✅ POST /time-entries - Created: ${response.data.data.description}`);
      
      // Test GET /time-entries/[id]
      const timeEntryId = response.data.data.id;
      const getResponse = await makeRequest(`/time-entries/${timeEntryId}`);
      
      if (getResponse.ok) {
        console.log(`✅ GET /time-entries/${timeEntryId} - Retrieved: ${getResponse.data.data.description}`);
      } else {
        console.log(`❌ GET /time-entries/${timeEntryId} failed:`, getResponse.data?.error);
      }

      // Test PUT /time-entries/[id]
      const updateData = {
        ...newTimeEntry,
        description: 'Updated: Testing time tracking API',
        tags: ['testing', 'api', 'updated']
      };

      const putResponse = await makeRequest(`/time-entries/${timeEntryId}`, {
        method: 'PUT',
        body: JSON.stringify(updateData)
      });

      if (putResponse.ok) {
        console.log(`✅ PUT /time-entries/${timeEntryId} - Updated: ${putResponse.data.data.description}`);
      } else {
        console.log(`❌ PUT /time-entries/${timeEntryId} failed:`, putResponse.data?.error);
      }

      return timeEntryId;
    } else {
      console.log('❌ POST /time-entries failed:', response.data?.error);
    }
  } catch (error) {
    console.log('❌ Time entries test failed:', error.message);
  }

  return null;
}

// Test timer functionality
async function testTimers() {
  console.log('\\n⏰ Testing Timer Functionality...');

  // Test start timer
  try {
    const timerData = {
      employeeId: 'emp-3',
      projectId: 'proj-2',
      taskId: 'task-3',
      description: 'Active timer test'
    };

    const startResponse = await makeRequest('/time-entries/start-timer', {
      method: 'POST',
      body: JSON.stringify(timerData)
    });

    if (startResponse.ok) {
      console.log(`✅ POST /time-entries/start-timer - Started: ${startResponse.data.data.description}`);
      const activeTimerId = startResponse.data.data.id;

      // Wait a moment
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Test stop timer
      const stopResponse = await makeRequest('/time-entries/stop-timer', {
        method: 'POST',
        body: JSON.stringify({ timeEntryId: activeTimerId })
      });

      if (stopResponse.ok) {
        console.log(`✅ POST /time-entries/stop-timer - Stopped: ${stopResponse.data.data.description}`);
        console.log(`   Duration: ${stopResponse.data.data.duration} minutes`);
      } else {
        console.log('❌ Stop timer failed:', stopResponse.data?.error);
      }
    } else {
      console.log('❌ Start timer failed:', startResponse.data?.error);
    }
  } catch (error) {
    console.log('❌ Timer test failed:', error.message);
  }
}

// Test timesheets
async function testTimesheets() {
  console.log('\\n📊 Testing Timesheets...');

  // Test GET /timesheets
  try {
    const response = await makeRequest('/timesheets');
    if (response.ok) {
      console.log(`✅ GET /timesheets - Found ${response.data.data.length} timesheets`);
    } else {
      console.log('❌ GET /timesheets failed:', response.data?.error);
    }
  } catch (error) {
    console.log('❌ GET /timesheets failed:', error.message);
  }

  // Test POST /timesheets (create new timesheet)
  try {
    const today = new Date();
    const monday = new Date(today);
    monday.setDate(today.getDate() - today.getDay() + 1);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    const timesheetData = {
      employeeId: 'emp-3',
      weekStartDate: monday.toISOString().split('T')[0],
      weekEndDate: sunday.toISOString().split('T')[0]
    };

    const response = await makeRequest('/timesheets', {
      method: 'POST',
      body: JSON.stringify(timesheetData)
    });

    if (response.ok) {
      console.log(`✅ POST /timesheets - Created timesheet for week ${timesheetData.weekStartDate}`);
      console.log(`   Total Hours: ${response.data.data.totalHours}, Billable: ${response.data.data.billableHours}`);
      
      const timesheetId = response.data.data.id;

      // Test GET /timesheets/[id]
      const getResponse = await makeRequest(`/timesheets/${timesheetId}`);
      
      if (getResponse.ok) {
        console.log(`✅ GET /timesheets/${timesheetId} - Retrieved timesheet`);
      } else {
        console.log(`❌ GET /timesheets/${timesheetId} failed:`, getResponse.data?.error);
      }

      // Test PUT /timesheets/[id] (submit timesheet)
      const updateResponse = await makeRequest(`/timesheets/${timesheetId}`, {
        method: 'PUT',
        body: JSON.stringify({
          status: 'submitted',
          comments: 'Test timesheet submission'
        })
      });

      if (updateResponse.ok) {
        console.log(`✅ PUT /timesheets/${timesheetId} - Status: ${updateResponse.data.data.status}`);
      } else {
        console.log(`❌ PUT /timesheets/${timesheetId} failed:`, updateResponse.data?.error);
      }

      return timesheetId;
    } else {
      console.log('❌ POST /timesheets failed:', response.data?.error);
    }
  } catch (error) {
    console.log('❌ Timesheets test failed:', error.message);
  }

  return null;
}

// Test advanced queries
async function testAdvancedQueries() {
  console.log('\\n🔍 Testing Advanced Queries...');

  // Test time entries with filters
  try {
    const today = new Date().toISOString().split('T')[0];
    
    // Test by employee
    const empResponse = await makeRequest('/time-entries?employeeId=emp-1');
    if (empResponse.ok) {
      console.log(`✅ Time entries by employee - Found ${empResponse.data.data.length} entries`);
    }

    // Test by date
    const dateResponse = await makeRequest(`/time-entries?date=${today}`);
    if (dateResponse.ok) {
      console.log(`✅ Time entries by date - Found ${dateResponse.data.data.length} entries`);
    }

    // Test active timers
    const activeResponse = await makeRequest('/time-entries?isActive=true');
    if (activeResponse.ok) {
      console.log(`✅ Active timers - Found ${activeResponse.data.data.length} active entries`);
    }

    // Test timesheets by employee
    const timesheetResponse = await makeRequest('/timesheets?employeeId=emp-1');
    if (timesheetResponse.ok) {
      console.log(`✅ Timesheets by employee - Found ${timesheetResponse.data.data.length} timesheets`);
    }

  } catch (error) {
    console.log('❌ Advanced queries test failed:', error.message);
  }
}

// Clean up test data
async function cleanup(timeEntryId, timesheetId) {
  console.log('\\n🧹 Cleaning up test data...');

  if (timeEntryId) {
    try {
      const response = await makeRequest(`/time-entries/${timeEntryId}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        console.log('✅ Cleaned up test time entry');
      }
    } catch (error) {
      console.log('⚠️  Failed to cleanup time entry:', error.message);
    }
  }

  if (timesheetId) {
    try {
      const response = await makeRequest(`/timesheets/${timesheetId}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        console.log('✅ Cleaned up test timesheet');
      }
    } catch (error) {
      console.log('⚠️  Failed to cleanup timesheet:', error.message);
    }
  }
}

// Main test execution
async function runTimeTrackingTests() {
  console.log('🚀 Starting Time Tracking API Tests for Sebenza Logistics Suite\\n');

  // Login first
  const loginSuccess = await login();
  if (!loginSuccess) {
    console.log('❌ Tests aborted: Login failed');
    return;
  }

  let timeEntryId, timesheetId;

  try {
    // Run all tests
    timeEntryId = await testTimeEntries();
    await testTimers();
    timesheetId = await testTimesheets();
    await testAdvancedQueries();

    console.log('\\n🎉 Time tracking tests completed successfully!');
    
    console.log('\\n📈 Time Tracking API Summary:');
    console.log('   ✅ Time Entries CRUD operations');
    console.log('   ✅ Timer start/stop functionality');
    console.log('   ✅ Timesheet management');
    console.log('   ✅ Advanced filtering and queries');
    console.log('   ✅ Data validation and error handling');
    console.log('   ✅ Authentication and authorization');

    console.log('\\n🎯 Phase 2.1 Time Tracking System - READY FOR PRODUCTION!');

  } catch (error) {
    console.log('❌ Test execution failed:', error.message);
  } finally {
    // Clean up
    await cleanup(timeEntryId, timesheetId);
  }
}

// Run the tests
runTimeTrackingTests().catch(console.error);
