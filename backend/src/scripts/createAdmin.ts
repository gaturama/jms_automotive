import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import User from '../models/User.model';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const createAdmin = async () => {
  try {
    const uri = process.env.MONGODB_URI as string;
    const uriWithDb = uri.includes('/showroom') ? uri : uri.replace('/?', '/showroom?');
    await mongoose.connect(uriWithDb);
    console.log('MongoDB conectado');

    const adminEmail = 'admin@jmsshowroom.com';

    await User.collection.deleteOne({ email: adminEmail });
    console.log('Admin anterior removido');

    const hashedPassword = await bcrypt.hash('Admin@123456', 12);

    await User.collection.insertOne({
      name: 'Administrador',
      email: adminEmail,
      password: hashedPassword,
      role: 'admin',
      biometricEnabled: false,
      notificationsEnabled: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      __v: 0,
    });

    console.log('Admin criado com sucesso!');
    console.log('Email:', adminEmail);
    console.log('Senha: Admin@123456');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Erro ao criar admin:', error);
    process.exit(1);
  }
};

createAdmin();