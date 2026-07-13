import mongoose from 'mongoose';
import { config } from '../config';
import { Admin, Category, Setting } from '../models';

const categories = [
  { name: 'PVC Wallpaper', order: 1 },
  { name: 'Vinyl Wallpaper', order: 2 },
  { name: 'Luxury Wallpaper', order: 3 },
  { name: 'Korean Wallpaper', order: 4 },
  { name: '3D Wallpaper', order: 5 },
  { name: 'Kids Wallpaper', order: 6 },
  { name: 'Brick Wallpaper', order: 7 },
  { name: 'Marble Wallpaper', order: 8 },
  { name: 'Wood Wallpaper', order: 9 },
  { name: 'Floral Wallpaper', order: 10 },
  { name: 'Wall Panels', order: 11 },
  { name: 'PVC Marble Sheets', order: 12 },
  { name: 'Accessories', order: 13 },
];

const defaultSettings: Record<string, any> = {
  siteName: 'WALLSCAPE BANGLADESH',
  siteDescription: 'Premium Wallpaper & Interior Solutions in Bangladesh',
  logo: '',
  favicon: '',
  contactPhone: '+880 1700-000000',
  contactEmail: 'info@wallscapebd.com',
  contactAddress: 'Dhaka, Bangladesh',
  whatsapp: '+8801700000000',
  facebook: 'https://facebook.com/wallscapebd',
  instagram: 'https://instagram.com/wallscapebd',
  youtube: 'https://youtube.com/@wallscapebd',
  deliveryCharge: 100,
  freeDeliveryMin: 2000,
  bkashNumber: '01XXXXXXXXX',
  nagadNumber: '01XXXXXXXXX',
  bankDetails: 'Bank Name, Account Name, Account Number, Branch',
};

async function seed() {
  try {
    await mongoose.connect(config.mongoUri);
    console.log('Connected to MongoDB');

    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      await Admin.create({
        name: 'Super Admin',
        email: 'admin@wallscapebd.com',
        password: 'admin123',
        role: 'super_admin',
      });
      console.log('Admin created: admin@wallscapebd.com / admin123');
    } else {
      console.log('Admin already exists, skipping...');
    }

    const categoryCount = await Category.countDocuments();
    if (categoryCount === 0) {
      for (const cat of categories) {
        await Category.create({
          name: cat.name,
          slug: cat.name.toLowerCase().replace(/\s+/g, '-'),
          order: cat.order,
          isActive: true,
        });
      }
      console.log(`${categories.length} categories created`);
    } else {
      console.log('Categories already exist, skipping...');
    }

    for (const [key, value] of Object.entries(defaultSettings)) {
      await Setting.updateOne({ key }, { $set: { key, value } }, { upsert: true });
    }
    console.log('Default settings created');

    console.log('Seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seed();
