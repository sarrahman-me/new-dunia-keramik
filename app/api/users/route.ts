import { NextResponse } from 'next/server';
import clientPromise from '@/lib/db';
import bcrypt from "bcrypt";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('duniakeramik');
    const collection = db.collection('users');

    const users = await collection.find({}, { projection: { password: 0 } }).toArray();

    return NextResponse.json({ users });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json({ error: 'Gagal mengambil data pengguna' + error }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const client = await clientPromise;
    const db = client.db('duniakeramik');
    const collection = db.collection('users');

    const { username, password, permissions } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Username dan password harus diisi' }, { status: 400 });
    }

    const existingUser = await collection.findOne({ username });
    if (existingUser) {
      return NextResponse.json({ error: 'Username sudah digunakan' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      username,
      password: hashedPassword,
      permissions: permissions || { canAdd: false, canEdit: false, canDelete: false },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(newUser);
    return NextResponse.json({ message: 'Pengguna berhasil ditambahkan', id: result.insertedId });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json({ error: 'Gagal menambahkan pengguna' + error }, { status: 500 });
  }
}

