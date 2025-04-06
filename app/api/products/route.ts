import { NextResponse } from 'next/server';
import clientPromise from '@/lib/db';
import generateSku from '@/utils/generator/sku';
import imagekit from '@/lib/imagekit';

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

    const requiredFields = ['nama_barang', 'brand', 'kategori'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `Field '${field}' harus diisi` }, { status: 400 });
      }
    }

    const existingProduct = await collection.findOne({
      nama_barang: body.nama_barang,
      brand: body.brand,
      kategori: body.kategori
    });

    if (existingProduct) {
      return NextResponse.json(
        { error: 'Produk dengan nama, brand, dan kategori yang sama sudah pernah ditambahkan' },
        { status: 409 }
      );
    }

    let sku = generateSku(body.nama_barang, body.brand, body.kategori);
    let attempts = 0;
    while (await collection.findOne({ sku }) && attempts < 5) {
      sku = generateSku(body.nama_barang, body.brand, body.kategori);
      attempts++;
    }

    if (attempts >= 5) {
      return NextResponse.json({ error: 'Gagal menghasilkan SKU unik' }, { status: 500 });
    }

    // ✅ Upload base64 gambar ke ImageKit
    async function uploadBase64(base64: string, fileNamePrefix: string) {
      if (!base64) return null;
      const result = await imagekit.upload({
        file: base64,
        fileName: `${fileNamePrefix}-${sku}`,
      });
      return result.url;
    }

    const [gambarUrl, designUrl] = await Promise.all([
      uploadBase64(body.gambar_url, 'gambar'),
      uploadBase64(body.design_url, 'design')
    ]);


    const now = new Date();
    const product = {
      ...body,
      sku,
      gambar_url: gambarUrl,
      design_url: designUrl,
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
