// ============ SEED DATABASE WITH ADMIN USER ============
const mongoose = require('mongoose');
const User = require('./src/models/User');
require('dotenv').config();

const seedAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://mongo:ivKuqCYdEmaQnwAcAJYiJytsArRsHPia@turntable.proxy.rlwy.net:39926', {
      useNewUrlParser: true,
      serverSelectionTimeoutMS: 5000 ,
      useUnifiedTopology: true
    });
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const adminExists = await User.findOne({ email: 'admin@biogas.com' });
    if (adminExists) {
      console.log('⚠️  Admin already exists');
      await mongoose.disconnect();
      return;
    }

    // Create admin user
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@biogas.com',
      password: 'admin123456', // Default password - CHANGE THIS!
      phone: '+123456789',
      role: 'admin',
      age: 30,
      isVerified: true,
      bio: 'System Administrator'
    });

    await adminUser.save();
    console.log('✅ Admin user created successfully');
    console.log('   Email: admin@biogas.com');
    console.log('   Password: admin123456');
    console.log('   ⚠️  CHANGE PASSWORD AFTER FIRST LOGIN!');

    // Create test user
    const testUser = new User({
      name: 'Test User',
      email: 'test@biogas.com',
      password: 'test123456',
      phone: '+987654321',
      role: 'user',
      age: 25,
      isVerified: true,
      bio: 'Test user for development'
    });

    await testUser.save();
    console.log('✅ Test user created successfully');
    console.log('   Email: test@biogas.com');
    console.log('   Password: test123456');

    console.log('\n🎉 Database initialized successfully!');
    await mongoose.disconnect();
  } catch (err) {
    console.error('❌ Error seeding database:', err.message);
    process.exit(1);
  }
};

// Run seed
seedAdmin();
