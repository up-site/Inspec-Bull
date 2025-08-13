import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Client from '@/../../models/Client';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const client = await Client.findById(params.id);
    
    if (!client) {
      return NextResponse.json(
        { success: false, message: 'Client not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: client });
  } catch (error) {
    console.error('Client GET error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch client' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const body = await request.json();
    
    const client = await Client.findByIdAndUpdate(
      params.id,
      body,
      { new: true, runValidators: true }
    );
    
    if (!client) {
      return NextResponse.json(
        { success: false, message: 'Client not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      data: client,
      message: 'Client updated successfully' 
    });
  } catch (error) {
    console.error('Client PUT error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update client' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const client = await Client.findByIdAndUpdate(
      params.id,
      { isActive: false },
      { new: true }
    );
    
    if (!client) {
      return NextResponse.json(
        { success: false, message: 'Client not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Client deleted successfully' 
    });
  } catch (error) {
    console.error('Client DELETE error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete client' },
      { status: 500 }
    );
  }
}