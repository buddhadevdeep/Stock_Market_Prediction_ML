import mongoose from 'mongoose';

let isConnected = false;

export const connectDB = async () => {
  let uri = process.env.MONGO_URI;
  if (!uri || uri.includes('YOUR_USERNAME')) {
    console.warn('⚠️  MONGO_URI is not configured in backend/.env. Running in in-memory / fallback storage mode.');
    return;
  }

  // Ensure default database name if URI terminates with trailing slash
  if (uri.endsWith('/')) {
    uri = `${uri}stock_prediction_db?retryWrites=true&w=majority`;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000,
    });
    isConnected = true;
    console.log(`✅ MongoDB Connected Successfully: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`⚠️  MongoDB Connection Notice: ${error.message}. Backend will continue running with in-memory caching fallback.`);
    isConnected = false;
  }
};

export const getDBStatus = () => isConnected;
