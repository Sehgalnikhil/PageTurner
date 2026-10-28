import bcrypt from 'bcrypt';
import { User } from '../models/userModel.js';

export const seedDemoUsers = async () => {
  try {
    const salt = await bcrypt.genSalt(10);

    const adminExists = await User.findOne({ email: 'admin@pageturner.io' });
    if (!adminExists) {
      const adminPassword = await bcrypt.hash('admin123', salt);
      await User.create({
        username: 'Admin Demo',
        email: 'admin@pageturner.io',
        password: adminPassword,
        role: 'admin',
      });
      console.log('🌱 Seeded default admin account: admin@pageturner.io / admin123');
    }

    const readerExists = await User.findOne({ email: 'student@pageturner.io' });
    if (!readerExists) {
      const readerPassword = await bcrypt.hash('student123', salt);
      await User.create({
        username: 'Reader Demo',
        email: 'student@pageturner.io',
        password: readerPassword,
        role: 'user',
      });
      console.log('🌱 Seeded default reader demo account: student@pageturner.io / student123');
    }
  } catch (error) {
    console.error('Error auto-seeding demo users:', error.message);
  }
};
