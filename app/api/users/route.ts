import { NextResponse } from 'next/server';
import supabase from '@/lib/supabase';
import bcrypt from 'bcrypt';
import { success, failure } from '@/utils/apiResponse';

// POST: Tambah user baru
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nama, username, password } = body;

    const missingFields: Record<string, string> = {};
    if (!nama) missingFields.nama = 'Wajib diisi';
    if (!username) missingFields.username = 'Wajib diisi';
    if (!password) missingFields.password = 'Wajib diisi';

    if (Object.keys(missingFields).length > 0) {
      return NextResponse.json(
        failure(400, 'Validasi gagal', 'Beberapa field wajib diisi', missingFields),
        { status: 400 }
      );
    }

    // Cek apakah username sudah digunakan
    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('username', username)
      .single();

    if (existing) {
      return NextResponse.json(
        failure(409, 'Username sudah digunakan', 'Silakan gunakan username lain'),
        { status: 409 }
      );
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

    return NextResponse.json(success({ message: 'User berhasil ditambahkan' }));
  } catch (error) {
    console.error('POST /api/users error:', error);
    return NextResponse.json(
      failure(500, 'Gagal menambahkan user', error instanceof Error ? error.message : undefined),
      { status: 500 }
    );
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

    return NextResponse.json(success(data));
  } catch (error) {
    console.error('GET /api/users error:', error);
    return NextResponse.json(
      failure(500, 'Gagal mengambil data user', error instanceof Error ? error.message : undefined),
      { status: 500 }
    );
  }
}
