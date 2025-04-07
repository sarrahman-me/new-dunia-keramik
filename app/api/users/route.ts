import { NextResponse } from 'next/server';
import supabase from '@/lib/supabase';
import bcrypt from 'bcrypt';

// POST: Tambah user baru
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nama, username, password } = body;

    if (!nama || !username || !password) {
      return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 });
    }

    // Cek apakah username sudah ada
    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('username', username)
      .single();

    if (existing) {
      return NextResponse.json({ error: 'Username sudah digunakan' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const now = new Date().toISOString();

    const { error } = await supabase.from('users').insert({
      nama,
      username,
      password: hashedPassword,
      created_at: now,
      updated_at: now,
      last_login: now,
    });

    if (error) throw error;

    return NextResponse.json({ message: 'User berhasil ditambahkan' });
  } catch (error) {
    console.error('POST /api/users error:', error);
    return NextResponse.json({ error: 'Gagal menambahkan user' }, { status: 500 });
  }
}

// GET: Ambil semua user (tanpa password)
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, nama, username, created_at, updated_at, last_login')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('GET /api/users error:', error);
    return NextResponse.json({ error: 'Gagal mengambil data user' }, { status: 500 });
  }
}
