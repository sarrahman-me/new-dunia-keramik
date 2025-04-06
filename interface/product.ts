import { ObjectId } from "mongodb"

export interface IProduct {
  _id: ObjectId;
  sku: string;
  nama_barang: string;
  brand: string;
  kategori: string;
  group: string;
  ukuran?: string;
  kualitas?: string;
  motif?: string;
  tekstur?: string;
  berat: number;
  gambar_url: string;
  design_url?: string;
  external_sku?: string;
  created_at: Date;
  updated_at: Date;
  search_field: string;
}
