const mongoose = require('mongoose');

const MONGO_URI = 'mongodb://localhost:27017/outreach-hub';

async function check() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Collections in database:');
    
    for (let col of collections) {
      const count = await mongoose.connection.db.collection(col.name).countDocuments();
      console.log(` - ${col.name}: ${count} documents`);
    }

    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

check();
