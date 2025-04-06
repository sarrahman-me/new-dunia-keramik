import { NextResponse } from 'next/server';
import clientPromise from '@/lib/db';
import bcrypt from 'bcrypt';
import { IUser } from '@/interface/user';

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

export async function PATCH(req: Request) {
  try {
    const client = await clientPromise;
    const db = client.db('duniakeramik');
    const collection = db.collection('users');

    const { username, permissions, password } = await req.json();

    if (!username) {
      return NextResponse.json({ error: 'Username harus diisi' }, { status: 400 });
    }

    const updateFields: IUser = { updatedAt: new Date() };

    if (permissions) {
      updateFields.permissions = permissions;
    }

    if (password) {
      if (password.length < 6) {
        return NextResponse.json({ error: 'Password minimal 6 karakter' }, { status: 400 });
      }
      updateFields.password = await bcrypt.hash(password, 10);
    }

    const result = await collection.updateOne({ username }, { $set: updateFields });

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Pengguna tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({ message: `Data pengguna '${username}' berhasil diperbarui` });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal memperbarui pengguna: ' + error }, { status: 500 });
  }
}

