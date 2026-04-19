const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGO_URI = 'mongodb://localhost:27017/outreach-hub';

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    await mongoose.connection.dropDatabase();
    console.log('Dropped existing database');

    const hashedPassword = await bcrypt.hash('password123', 10);

    const getRandomDate = (daysAgo) => {
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo));
      return date;
    };

    // 1. Admins
    const Admin = mongoose.model('Admin', new mongoose.Schema({
      name: String, password: String, contactInfo: { email: String, phoneNo: Number, countryCode: String },
      joinDate: Date, isDeleted: { type: Boolean, default: false }
    }, { collection: 'admins' }));

    const admins = await Admin.insertMany([
      { name: 'Super Admin', password: hashedPassword, contactInfo: { email: 'admin@example.com', phoneNo: 1234567890, countryCode: '+91' }, joinDate: getRandomDate(180) },
      { name: 'System Admin', password: hashedPassword, contactInfo: { email: 'sysadmin@example.com', phoneNo: 9876543210, countryCode: '+91' }, joinDate: getRandomDate(150) },
    ]);

    // 2. Workspaces
    const Workspace = mongoose.model('Workspace', new mongoose.Schema({
      name: String, isDeleted: { type: Boolean, default: false }
    }, { collection: 'workspaces' }));

    const workspaces = await Workspace.insertMany([
      { name: 'Marketing' }, { name: 'Sales' }, { name: 'HR' }, { name: 'Product' }, { name: 'Development' },
    ]);

    // 3. Users
    const User = mongoose.model('User', new mongoose.Schema({
      name: String, password: String, contactInfo: { email: String, phoneNumber: Number, countryCode: String },
      joinDate: Date, currentWorkspace: mongoose.Schema.Types.ObjectId, isDeleted: { type: Boolean, default: false }
    }, { collection: 'users' }));

    const users = [];
    for (let i = 1; i <= 30; i++) {
      users.push({
        name: `User ${i}`, password: hashedPassword,
        contactInfo: { email: `user${i}@example.com`, phoneNumber: 9000000000 + i, countryCode: '+91' },
        joinDate: getRandomDate(120), currentWorkspace: workspaces[i % workspaces.length]._id,
      });
    }
    const insertedUsers = await User.insertMany(users);

    // 4. Workspace Users (Simplified permissions based on what I saw in some areas)
    const workspaceUsersData = insertedUsers.map((user, index) => ({
      workspaceId: user.currentWorkspace, 
      userId: user._id,
      write: index % 2 === 0,
      allowAdd: index % 4 === 0,
      joinedAt: user.joinDate,
      isDeleted: false
    }));

    await mongoose.connection.db.collection('workspaceusers').insertMany(workspaceUsersData);
    await mongoose.connection.db.collection('workspace-users').insertMany(workspaceUsersData);

    // 5. Message Templates
    const templatesData = [];
    workspaces.forEach(ws => {
      templatesData.push({
        workspaceId: ws._id, type: 'text', title: 'Welcome Message', template: 'Hello {{name}}, welcome!', isDeleted: false
      });
      templatesData.push({
        workspaceId: ws._id, type: 'text-image', title: 'Promotion', template: 'Latest offer, {{name}}!', 
        templateImage: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', isDeleted: false
      });
    });
    await mongoose.connection.db.collection('messagetemplates').insertMany(templatesData);
    await mongoose.connection.db.collection('message-templates').insertMany(templatesData);
    const insertedTemplates = await mongoose.connection.db.collection('messagetemplates').find().toArray();

    // 6. Contacts
    const Contact = mongoose.model('Contact', new mongoose.Schema({
      workspaceId: mongoose.Schema.Types.ObjectId, creator: mongoose.Schema.Types.ObjectId, name: String,
      contactInfo: { email: String, phoneNumber: Number, countryCode: String }, company: String, jobTitle: String,
      tags: [String], isDeleted: { type: Boolean, default: false }
    }, { collection: 'contacts' }));

    const contacts = [];
    for (let i = 1; i <= 150; i++) {
      const ws = workspaces[i % workspaces.length];
      const creator = insertedUsers.find(u => u.currentWorkspace.equals(ws._id)) || insertedUsers[0];
      contacts.push({
        workspaceId: ws._id, creator: creator._id, name: `Contact ${i}`,
        contactInfo: { countryCode: '+1', phoneNumber: 1234567890 + i, email: `contact${i}@company${i % 10}.com` },
        company: `Company ${i % 10}`, jobTitle: i % 2 === 0 ? 'Manager' : 'Developer',
        tags: [`tag${i % 5}`, 'imported'],
      });
    }
    const insertedContacts = await Contact.insertMany(contacts);

    // 7. Campaigns
    const Campaign = mongoose.model('Campaign', new mongoose.Schema({
      workspaceId: mongoose.Schema.Types.ObjectId, creator: mongoose.Schema.Types.ObjectId, 
      templateId: mongoose.Schema.Types.ObjectId, name: String, tags: [String], status: String,
      creationDate: Date, startDate: Date, endDate: Date, isDeleted: { type: Boolean, default: false }
    }, { collection: 'campaigns' }));

    const campaignsData = [];
    for (let i = 1; i <= 60; i++) {
      const ws = workspaces[i % workspaces.length];
      const template = insertedTemplates.find(t => t.workspaceId.equals(ws._id));
      const creator = insertedUsers.find(u => u.currentWorkspace.equals(ws._id)) || insertedUsers[0];
      const creationDate = getRandomDate(90); 
      const status = i % 3 === 0 ? 'Completed' : (i % 3 === 1 ? 'Running' : 'Draft');
      let startDate = new Date(creationDate), endDate = new Date(creationDate);
      if (status === 'Running') { startDate = new Date(); startDate.setDate(startDate.getDate()-3); endDate.setDate(endDate.getDate()+4); }
      else if (status === 'Draft') { startDate.setDate(startDate.getDate()+5); endDate.setDate(endDate.getDate()+12); }
      else { startDate.setDate(startDate.getDate()+1); endDate.setDate(endDate.getDate()+7); }

      campaignsData.push({
        workspaceId: ws._id, creator: creator._id, templateId: template._id, name: `Campaign ${i}`,
        tags: [`tag${i % 5}`], status, creationDate, startDate, endDate, isDeleted: false
      });
    }
    const insertedCampaigns = await Campaign.insertMany(campaignsData);

    // 8. Campaign Messages
    const campaignMessagesData = [];
    insertedCampaigns.filter(c => c.status !== 'Draft').forEach(campaign => {
        const campaignContacts = insertedContacts.filter(contact => 
            contact.workspaceId.equals(campaign.workspaceId) && contact.tags.some(tag => campaign.tags.includes(tag))
        ).slice(0, 5);
        campaignContacts.forEach(contact => {
            campaignMessagesData.push({
                campaignId: campaign._id, contactId: contact._id, template: { title: 'Seeded', body: ['Line 1'] }, isDeleted: false
            });
        });
    });
    if (campaignMessagesData.length > 0) {
        await mongoose.connection.db.collection('campaignmessages').insertMany(campaignMessagesData);
        await mongoose.connection.db.collection('campaign-messages').insertMany(campaignMessagesData);
    }

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seed();
