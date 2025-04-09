"use client";
import Button from "@/components/button";
import { FormEvent, useState } from "react";
import InputGroup from "@/layouts/inputGroup";

const Kalkulator = () => {
  const [payload, setPayload] = useState({
    nama: "",
    brand: "",
    kategori: "",
    group: "",
    ukuran: "",
    kualitas: "",
    motif: "",
    tekstur: "",
    berat: 0
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log(payload)
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <form onSubmit={handleSubmit} className={`space-y-5`}>
        <InputGroup
          forms={[
            {
              type: "text",
              label: "Nama Barang",
              name: "nama",
            },
            {
              type: "select",
              staticData: true,
              lists: [{ brand: "Arwana" }, { brand: "Arna" }],
              label: "Brand",
              name: "brand",
              placeholder: "Pilih Brand...",
              keyValue: {
                key: "brand",
                value: "brand",
              },
            },
            {
              type: "select",
              staticData: true,
              lists: [{ kategori: "Granit" }, { kategori: "Keramik" }],
              label: "Kategori",
              name: "kategori",
              placeholder: "Pilih Kategori...",
              keyValue: {
                key: "kategori",
                value: "kategori",
              },
            },
            {
              type: "text",
              label: "Group",
              name: "group",
            },
            {
              type: "select",
              staticData: true,
              lists: [
                { nama: "20x20" },
                { nama: "20x25" },
                { nama: "25x25" },
                { nama: "30x30" },
                { nama: "40x40" },
                { nama: "50x50" },
                { nama: "60x60" },
                { nama: "20x40" },
                { nama: "25x40" },
                { nama: "25x50" },
                { nama: "30x60" },
                { nama: "60x120" },
              ],
              label: "Ukuran",
              name: "ukuran",
              placeholder: "Pilih Ukuran...",
              keyValue: {
                key: "nama",
                value: "nama",
              },
            },
            {
              type: "select",
              staticData: true,
              lists: [
                { nama: "A" },
                { nama: "KW 1" },
              ],
              label: "Kualitas",
              name: "kualitas",
              placeholder: "Pilih Kualitas...",
              keyValue: {
                key: "nama",
                value: "nama",
              },
            },
            {
              type: "select",
              staticData: true,
              lists: [
                { nama: "Marble" },
                { nama: "Wood" },
                { nama: "Stone" },
              ],
              label: "Motif",
              name: "motif",
              placeholder: "Pilih Motif...",
              keyValue: {
                key: "nama",
                value: "nama",
              },
            },
            {
              type: "select",
              staticData: true,
              lists: [
                { nama: "Glossy" },
                { nama: "Matt" },
              ],
              label: "Tekstur",
              name: "tekstur",
              placeholder: "Pilih tekstur...",
              keyValue: {
                key: "nama",
                value: "nama",
              },
            },
            {
              type: "number",
              label: "Berat",
              name: "berat",
            },
            {
              type: "text",
              label: "Eksternal SKU",
              name: "external_sku",
            },

          ]}
          setData={(values) => setPayload({ ...payload, ...values })}
          data={payload}
        />
        <Button fullWidth type="submit">
          Hitung
        </Button>
      </form>
    </div>
  );
};

export default Kalkulator;
