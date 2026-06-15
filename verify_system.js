const fs = require('fs');

const GATEWAY_URL = 'http://localhost:8001/api';
const SPRING_URL = 'http://localhost:8080/api';
const NODE_SEARCH_URL = 'http://localhost:5000/api';

const report = {
  apis: [],
  crud: [],
  security: []
};

function logResult(category, name, status, details) {
  console.log(`[${category}] ${name}: ${status ? '✅ PASS' : '❌ FAIL'} - ${details}`);
  report[category].push({ name, status, details });
}

async function verifyEndpoints() {
  // Test Spring Boot Health
  try {
    const res = await fetch(`${SPRING_URL}/plans`);
    logResult('apis', 'Spring Boot Direct (/api/plans)', res.ok, `Status: ${res.status}`);
  } catch (err) {
    logResult('apis', 'Spring Boot Direct', false, err.message);
  }

  // Test FastAPI Gateway Health
  try {
    const res = await fetch(`http://localhost:8001/health`);
    const data = await res.json();
    logResult('apis', 'FastAPI Health (/health)', res.ok, `Status: ${res.status}, Data: ${JSON.stringify(data)}`);
  } catch (err) {
    logResult('apis', 'FastAPI Health', false, err.message);
  }

  // Test Proxy Routing
  try {
    const res = await fetch(`${GATEWAY_URL}/plans`);
    const data = await res.json();
    logResult('apis', 'Gateway Proxy (/api/plans)', res.ok, `Proxied to Spring, returned ${data.length} plans`);
  } catch (err) {
    logResult('apis', 'Gateway Proxy', false, err.message);
  }

  // Test Node Search Service
  try {
    const res = await fetch(`${NODE_SEARCH_URL}/search?q=netflix`);
    logResult('apis', 'Node Search Service (/api/search)', res.ok, `Status: ${res.status}`);
  } catch (err) {
    logResult('apis', 'Node Search Service', false, err.message);
  }
}

async function verifyAuthAndCrud() {
  let adminToken = '';
  let userToken = '';

  // 1. Authenticate Admin
  try {
    const res = await fetch(`${GATEWAY_URL}/auth/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@subscriptionhub.com', password: 'admin123' })
    });
    const data = await res.json();
    if (data.token && data.roles && data.roles.includes('ROLE_ADMIN')) {
      adminToken = data.token;
      logResult('security', 'Admin Login', true, 'JWT Received, Role=ROLE_ADMIN');
    } else {
      logResult('security', 'Admin Login', false, `Invalid credentials or missing ADMIN role. Response: ${JSON.stringify(data)}`);
    }
  } catch (err) {
    logResult('security', 'Admin Login', false, err.message);
  }

  // Register User
  try {
    await fetch(`${GATEWAY_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Test User', email: 'testuser@subscriptionhub.com', password: 'user123' })
    });
  } catch(e) {}

  // 2. Authenticate User
  try {
    const res = await fetch(`${GATEWAY_URL}/auth/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'testuser@subscriptionhub.com', password: 'user123' })
    });
    const data = await res.json();
    if (data.token && data.roles && data.roles.includes('ROLE_USER')) {
      userToken = data.token;
      logResult('security', 'User Login', true, 'JWT Received, Role=ROLE_USER');
    } else {
      logResult('security', 'User Login', false, `Invalid credentials or missing USER role. Response: ${JSON.stringify(data)}`);
    }
  } catch (err) {
    logResult('security', 'User Login', false, err.message);
  }

  // 3. Test Admin Protected Routes
  if (adminToken) {
    try {
      const res = await fetch(`${GATEWAY_URL}/users`, { headers: { 'Authorization': `Bearer ${adminToken}` } });
      logResult('security', 'Admin access to /users', res.ok, `Status: ${res.status}`);
    } catch (err) {}
    
    try {
      const res = await fetch(`${GATEWAY_URL}/payments`, { headers: { 'Authorization': `Bearer ${adminToken}` } });
      logResult('security', 'Admin access to /payments', res.ok, `Status: ${res.status}`);
    } catch (err) {}
  }

  // 4. Test User Protected Routes (Ensure User CANNOT access Admin routes)
  if (userToken) {
    try {
      const res = await fetch(`${GATEWAY_URL}/users`, { headers: { 'Authorization': `Bearer ${userToken}` } });
      logResult('security', 'User access to /users (Should Fail)', res.status === 403 || res.status === 401, `Status: ${res.status} (Expected 403/401)`);
    } catch (err) {}
    
    try {
      const res = await fetch(`${GATEWAY_URL}/payments/me`, { headers: { 'Authorization': `Bearer ${userToken}` } });
      const data = await res.json();
      logResult('security', 'User access to /payments/me', res.ok, `Status: ${res.status}, Records: ${data.length || 0}`);
    } catch (err) {}
  }

  // 5. Test CRUD (Plans)
  if (adminToken) {
    let newPlanId = '';
    // Create Plan
    try {
      const res = await fetch(`${GATEWAY_URL}/plans`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${adminToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Test Plan', category: 'ENTERTAINMENT', price: 9.99, cycle: 'MONTHLY', status: 'ACTIVE' })
      });
      const data = await res.json();
      if (res.ok && data.id) {
        newPlanId = data.id;
        logResult('crud', 'Create Plan', true, `Plan ID: ${data.id}`);
      } else {
        logResult('crud', 'Create Plan', false, `Status: ${res.status}`);
      }
    } catch(err) {
      logResult('crud', 'Create Plan', false, err.message);
    }

    // Read Plan
    try {
      const res = await fetch(`${GATEWAY_URL}/plans/${newPlanId}`);
      logResult('crud', 'Read Plan', res.ok, `Status: ${res.status}`);
    } catch(err) {}

    // Delete Plan
    if (newPlanId) {
      try {
        const res = await fetch(`${GATEWAY_URL}/plans/${newPlanId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${adminToken}` }
        });
        logResult('crud', 'Delete Plan', res.ok, `Status: ${res.status}`);
      } catch(err) {}
    }
  }

  fs.writeFileSync('audit-report.json', JSON.stringify(report, null, 2));
  console.log('\nAudit complete. Results saved to audit-report.json');
}

async function main() {
  console.log('Starting automated API verification...\n');
  await verifyEndpoints();
  await verifyAuthAndCrud();
}

main();
