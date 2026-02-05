const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testRegistration() {
  try {
    console.log('🧪 Testing User Registration...\n');
    
    const userData = {
      name: 'Test User',
      email: `user-${Date.now()}@test.com`,
      password: 'Test@123456',
      phone: '+1234567890',
      age: 25
    };

    console.log('📤 Sending registration request with:', userData);
    
    const response = await axios.post(`${BASE_URL}/auth/register`, userData);
    
    console.log('\n✅ Registration successful!');
    console.log('Response status:', response.status);
    console.log('User:', JSON.stringify(response.data.user, null, 2));
    console.log('Token:', response.data.token ? response.data.token.substring(0, 20) + '...' : 'No token');
    
    return response.data;
  } catch (err) {
    console.error('\n❌ Registration failed!');
    console.error('Error:', err.message);
    if (err.response) {
      console.error('Status:', err.response.status);
      console.error('Data:', JSON.stringify(err.response.data, null, 2));
    } else {
      console.error('Full error:', err);
    }
  }
}

testRegistration();
