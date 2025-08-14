import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Client from '@/../../models/Client';

export async function GET() {
  try {
    await connectDB();
    const clients = await Client.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    return NextResponse.json({ success: true, data: clients });
  } catch (error) {
    console.error('Clients GET error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch clients' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    
    const { name, logo, website, description, order = 0, isActive = true } = body;
    
    if (!name || !logo) {
      return NextResponse.json(
        { success: false, message: 'Name and logo are required' },
        { status: 400 }
      );
    }
    
    const client = new Client({
      name,
      logo,
      website,
      description,
      order,
      isActive
    });
    
    await client.save();
    
    return NextResponse.json({ 
      success: true, 
      data: client,
      message: 'Client created successfully' 
    }, { status: 201 });
  } catch (error) {
    console.error('Clients POST error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create client' },
      { status: 500 }
    );
  }
}