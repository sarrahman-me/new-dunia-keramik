import { NextResponse } from 'next/server';
import clientPromise from '@/lib/db';
import imagekit from '@/lib/imagekit';
import { success, failure } from '@/utils/apiResponse';

// GET produk by SKU
export async function GET(_: Request, { params }: { params: Promise<{ sku: string }> }) {
  try {
    const { sku } = await params;

    const client = await clientPromise;
    const db = client.db('duniakeramik');
    const collection = db.collection('products');

    const product = await collection.findOne({ sku });

    if (!product) {
      return NextResponse.json(
        failure(404, 'Produk tidak ditemukan', `SKU ${sku} tidak tersedia`),
        { status: 404 }
      );
    }

    return NextResponse.json(success(product));
  } catch (error) {
    console.error('GET /api/products/[sku] error:', error);
    return NextResponse.json(
      failure(500, 'Gagal mengambil produk', error instanceof Error ? error.message : undefined),
      { status: 500 }
    );
  }
}

// PATCH produk
export async function PATCH(req: Request, { params }: { params: Promise<{ sku: string }> }) {
  try {
    const { sku } = await params;
    const client = await clientPromise;
    const db = client.db('duniakeramik');
    const collection = db.collection('products');
    const body = await req.json();

    const existing = await collection.findOne({ sku });
    if (!existing) {
      return NextResponse.json(
        failure(404, 'Produk tidak ditemukan', `SKU ${sku} tidak tersedia`),
        { status: 404 }
      );
    }

    async function uploadBase64(base64: string | undefined, prefix: string) {
      if (!base64 || base64.startsWith('http')) return base64;
      const result = await imagekit.upload({ file: base64, fileName: `${prefix}-${sku}` });
      return result.url;
    }

    const gambarUrl = await uploadBase64(body.gambar_url, 'gambar');
    const designUrl = await uploadBase64(body.design_url, 'design');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: Record<string, any> = {
      ...body,
      updated_at: new Date()
    };

    if (gambarUrl) updateData.gambar_url = gambarUrl;
    if (designUrl) updateData.design_url = designUrl;

    if (
      body.nama_barang || body.kategori || body.group || body.brand ||
      body.ukuran || body.motif || body.tekstur || body.kualitas
    ) {
      updateData.search_field = [
        body.nama_barang ?? existing.nama_barang,
        body.kategori ?? existing.kategori,
        body.group ?? existing.group,
        body.brand ?? existing.brand,
        body.ukuran ?? existing.ukuran,
        body.motif ?? existing.motif,
        body.tekstur ?? existing.tekstur,
        body.kualitas ?? existing.kualitas
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
    }

    await collection.updateOne({ sku }, { $set: updateData });

    return NextResponse.json(success({ message: 'Produk berhasil diupdate' }));
  } catch (error) {
    console.error('PATCH /api/products/[sku] error:', error);
    return NextResponse.json(
      failure(500, 'Gagal mengupdate produk', error instanceof Error ? error.message : undefined),
      { status: 500 }
    );
  }
}

// DELETE produk
export async function DELETE(_: Request, { params }: { params: Promise<{ sku: string }> }) {
  try {
    const { sku } = await params;
    const client = await clientPromise;
    const db = client.db('duniakeramik');
    const collection = db.collection('products');

    const existing = await collection.findOne({ sku });
    if (!existing) {
      return NextResponse.json(
        failure(404, 'Produk tidak ditemukan', `SKU ${sku} tidak tersedia`),
        { status: 404 }
      );
    }

    async function deleteImageByUrl(url: string | undefined) {
      if (!url) return;

      const fileName = url.split('/').pop();
      if (!fileName) return;

      try {
        const files = await imagekit.listFiles({ searchQuery: `name="${fileName}"` });

        const file = files.find(f => 'fileId' in f && f.name === fileName);
        if (file && 'fileId' in file) {
          await imagekit.deleteFile(file.fileId);
        }
      } catch (err) {
        console.warn('Gagal menghapus gambar dari ImageKit:', err);
      }
    }

    await Promise.all([
      deleteImageByUrl(existing.gambar_url),
      deleteImageByUrl(existing.design_url),
    ]);

    await collection.deleteOne({ sku });

    return NextResponse.json(success({ message: 'Produk dan gambar terkait berhasil dihapus' }));
  } catch (error) {
    console.error('DELETE /api/products/[sku] error:', error);
    return NextResponse.json(
      failure(500, 'Gagal menghapus produk', error instanceof Error ? error.message : undefined),
      { status: 500 }
    );
  }
}
