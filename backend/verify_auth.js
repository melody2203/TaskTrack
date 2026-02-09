
const RANDOM_EMAIL = `test_${Date.now()}@example.com`;
const PASSWORD = 'password123';
const API_URL = 'http://localhost:5000/api/auth';

async function verifyAuth() {
    console.log(`Testing with email: ${RANDOM_EMAIL}`);

    // Register
    console.log('--- Registering ---');
    try {
        const regRes = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Test User',
                email: RANDOM_EMAIL,
                password: PASSWORD,
                role: 'MEMBER'
            })
        });
        const regData = await regRes.json();
        console.log('Status:', regRes.status);
        console.log('Response:', regData);

        if (!regRes.ok) throw new Error('Registration failed');

        // Login
        console.log('\n--- Logging in ---');
        const loginRes = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: RANDOM_EMAIL,
                password: PASSWORD
            })
        });
        const loginData = await loginRes.json();
        console.log('Status:', loginRes.status);
        console.log('Response:', loginData);

        if (!loginRes.ok) throw new Error('Login failed');

        console.log('\nSUCCESS: Backend auth flows are working!');
    } catch (err) {
        console.error('\nFAILURE:', err.message);
    }
}

verifyAuth();
