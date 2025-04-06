import { NextResponse } from 'next/server';
import clientPromise from '@/lib/db';
import generateSku from '@/utils/generator/sku';

// GET products
export async function GET(req: Request) {
  try {
    const client = await clientPromise;
    const db = client.db('duniakeramik');
    const collection = db.collection('products');

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const search = searchParams.get('search') || '';

    const query = search
      ? { search_field: { $regex: search, $options: 'i' } }
      : {};

    const totalItems = await collection.countDocuments(query);
    const totalPages = Math.ceil(totalItems / limit);

    const data = await collection
      .find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ created_at: -1 })
      .toArray();

    return NextResponse.json({ data, totalPages, currentPage: page });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal mengambil data: ' + error }, { status: 500 });
  }
}

// POST product
export async function POST(req: Request) {
  try {
    const client = await clientPromise;
    const db = client.db('duniakeramik');
    const collection = db.collection('products');

    const body = await req.json();

    // Validasi field minimal
    const requiredFields = ['nama_barang', 'brand', 'kategori'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `Field '${field}' harus diisi` }, { status: 400 });
      }
    }

    // Generate SKU otomatis
    let sku = generateSku(body.nama_barang, body.brand, body.kategori);

    // Cek SKU bentrok, ulangi kalau sudah ada
    let attempts = 0;
    while (await collection.findOne({ sku }) && attempts < 5) {
      sku = generateSku(body.nama_barang, body.brand, body.kategori);
      attempts++;
    }

    if (attempts >= 5) {
      return NextResponse.json({ error: 'Gagal menghasilkan SKU unik' }, { status: 500 });
    }

    const now = new Date();
    const product = {
      ...body,
      sku,
      created_at: now,
      updated_at: now,
      search_field: [
        body.nama_barang,
        body.kategori,
        body.group,
        body.brand,
        body.ukuran,
        body.motif,
        body.tekstur,
        body.kualitas
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
    };

    const result = await collection.insertOne(product);

    return NextResponse.json({ message: 'Produk berhasil ditambahkan', id: result.insertedId, sku });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal menambahkan produk: ' + error }, { status: 500 });
  }
}
