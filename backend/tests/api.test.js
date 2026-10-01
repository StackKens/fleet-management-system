const API_BASE = process.env.API_URL || 'http://localhost:8000/api';

let token = null;
let userId = null;
let testEmail = null;
let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  PASS: ${message}`);
    passed++;
  } else {
    console.error(`  FAIL: ${message}`);
    failed++;
  }
}

async function test(name, fn) {
  console.log(`\n${name}`);
  try {
    await fn();
  } catch (error) {
    console.error(`  ERROR: ${error.message}`);
    failed++;
  }
}

async function runTests() {
  console.log('=== Fleet Management API Tests ===\n');

  await test('Health Check', async () => {
    const res = await fetch(`${API_BASE.replace('/api', '')}`);
    const data = await res.json();
    assert(res.ok, 'Server is responding');
    assert(data.success === true, 'Response has success: true');
  });

  await test('Register User', async () => {
    // Keep the generated email so the login test below uses the SAME address.
    // (Calling Date.now() twice produced two different emails and made the
    //  valid-login test fail even though the API was working correctly.)
    testEmail = `test-${Date.now()}@fleet.ug`;
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        email: testEmail,
        password: 'testpass123',
        role: 'Staff',
        phone: '+256 772 000 000',
      }),
    });
    const data = await res.json();
    assert(res.status === 201, 'Returns 201 Created');
    assert(data.success === true, 'Registration successful');
    assert(data.data.token, 'Returns JWT token');
    assert(data.data.id, 'Returns user ID');
    token = data.data.token;
    userId = data.data.id;
  });

  await test('Login with Valid Credentials', async () => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: 'testpass123',
      }),
    });
    const data = await res.json();
    assert(res.ok, 'Login successful');
    assert(data.data.token, 'Returns JWT token');
  });

  await test('Login with Invalid Credentials', async () => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'nonexistent@fleet.ug',
        password: 'wrongpassword',
      }),
    });
    const data = await res.json();
    assert(res.status === 401, 'Returns 401 for invalid credentials');
    assert(data.success === false, 'Returns success: false');
  });

  await test('Access Protected Route Without Token', async () => {
    const res = await fetch(`${API_BASE}/protected`);
    const data = await res.json();
    assert(res.status === 401, 'Returns 401 without token');
    assert(data.success === false, 'Access denied');
  });

  await test('Access Protected Route With Token', async () => {
    const res = await fetch(`${API_BASE}/protected`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    assert(res.ok, 'Access granted with valid token');
    assert(data.success === true, 'Returns success: true');
    assert(data.user.id === userId, 'Returns correct user ID');
  });

  await test('Get Current User Profile', async () => {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    assert(res.ok, 'Profile retrieved');
    assert(data.data.id === userId, 'Returns correct user');
    assert(data.data.email.includes('@'), 'Returns user email');
  });

  await test('Role-Based Access — Staff blocked from user list', async () => {
    // The test user is a Staff member. Listing all users is restricted to
    // Admin / Fleet Manager / Supervisor, so a 403 here proves RBAC is working.
    const res = await fetch(`${API_BASE}/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    assert(res.status === 403, 'Returns 403 for a Staff user');
    assert(data.success === false, 'Access denied');
  });

  await test('Get Users List (as Admin)', async () => {
    // Log in with the seeded administrator account for a permitted request.
    const loginRes = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@fleet.ug', password: 'password123' }),
    });
    const loginData = await loginRes.json();
    assert(loginRes.ok, 'Admin login successful');
    const adminToken = loginData.data.token;

    const res = await fetch(`${API_BASE}/users`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const data = await res.json();
    assert(res.ok, 'Users list retrieved');
    assert(Array.isArray(data.data), 'Returns array of users');
  });

  await test('Get Vehicles List (with auth)', async () => {
    const res = await fetch(`${API_BASE}/vehicles`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    assert(res.ok, 'Vehicles list retrieved');
    assert(Array.isArray(data.data), 'Returns array of vehicles');
  });

  await test('Get Vehicle Summary', async () => {
    const res = await fetch(`${API_BASE}/vehicles/summary`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    assert(res.ok, 'Summary retrieved');
    assert(data.data.total >= 0, 'Returns total count');
  });

  await test('Get Reports List', async () => {
    const res = await fetch(`${API_BASE}/reports`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    assert(res.ok, 'Reports list retrieved');
    assert(Array.isArray(data.data), 'Returns array of report types');
  });

  console.log(`\n=== Results: ${passed} passed, ${failed} failed ===\n`);
  process.exit(failed > 0 ? 1 : 0);
}

runTests();
