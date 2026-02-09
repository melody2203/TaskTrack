
const API_URL = 'http://localhost:5000/api/auth';

async function verifySpecificLogin() {
    const email = 'merertuphilip@gmail.com';
    const password = 'password123';

    console.log(`Testing login for: ${email}`);

    try {
        const loginRes = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const loginData = await loginRes.json();

        console.log('Status:', loginRes.status);
        console.log('Response:', loginData);

        if (!loginRes.ok) throw new Error('Login failed');

        console.log('\nSUCCESS: User logged in successfully with new password!');
    } catch (err) {
        console.error('\nFAILURE:', err.message);
    }
}

verifySpecificLogin();
