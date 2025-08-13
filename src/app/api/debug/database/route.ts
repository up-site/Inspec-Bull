import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const connectionInfo = {
      // Database connection details
      isConnected: mongoose.connection.readyState === 1,
      databaseName: mongoose.connection.name,
      host: mongoose.connection.host,
      port: mongoose.connection.port,
      
      // Environment variable debugging
      envMongoUri: process.env.MONGODB_URI?.replace(/\/\/[^:]*:[^@]*@/, '//***:***@'), // Hide credentials
      actualConnectionString: mongoose.connection.client?.options?.hosts?.[0] || 'unknown',
      
      // Collection counts
      collections: {},
      
      // Connection type
      isAtlas: process.env.MONGODB_URI?.includes('mongodb+srv://'),
      isLocal: process.env.MONGODB_URI?.includes('localhost'),
      
      timestamp: new Date().toISOString()
    };

    // Get collection counts
    const db = mongoose.connection.db;
    if (db) {
      const collections = await db.listCollections().toArray();
      
      for (const collection of collections) {
        try {
          const count = await db.collection(collection.name).countDocuments();
          connectionInfo.collections[collection.name] = count;
        } catch (error) {
          connectionInfo.collections[collection.name] = 'Error counting';
        }
      }
    }

    return NextResponse.json(connectionInfo);
  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
      isConnected: false,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}