/**
 * Menghasilkan SKU dari nama_barang, brand, dan kategori dengan tambahan angka acak 4 digit.
 * Semua huruf diubah ke lowercase, spasi diganti dengan tanda strip (-).
 *
 * Contoh hasil: daiva-white-arna-granit-8697
 */
export default function generateSku(nama_barang: string, brand: string, kategori: string): string {
  const nRandom = Math.floor(Math.random() * 9000) + 1000; // angka acak 1000-9999

  const raw = `${nama_barang}-${brand}-${kategori}-${nRandom}`;

  return raw
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-'); // ganti semua spasi dengan -
}
