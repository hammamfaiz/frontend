'use client';

import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';

interface Penilaian {
  id_konversi_nilai: number;
  id_berkas_penilaian: number;
  nilai_akhir: number;
  grade: string;
  nama_berkas: string;
}

export default function PenilaianProgramMBKM() {
  const [penilaians, setPenilaians] = useState<Penilaian[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPenilaian, setSelectedPenilaian] = useState<Penilaian | null>(null);
  const [nilaiAkhir, setNilaiAkhir] = useState<number>(0);
  const [grade, setGrade] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = Cookies.get('token');

    if (!token) {
      setError('Token tidak ditemukan');
      return;
    }

    try {
      const decodedToken = jwtDecode<{ NIP_dosbing: string }>(token);
      console.log('NIP dari token:', decodedToken.NIP_dosbing);

      const fetchPenilaianData = async () => {
        try {
          const response = await fetch(
            'https://backend-si-mbkm.vercel.app/api/konversi-nilai',
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.ok) {
            const data = await response.json();
            setPenilaians(data);
          } else {
            console.error('Failed to fetch data:', response.statusText);
            setError('Gagal mengambil data penilaian');
          }
        } catch (error) {
          console.error('Error:', error);
          setError('Terjadi kesalahan saat mengambil data');
        }
      };

      fetchPenilaianData();
    } catch (err) {
      console.error('Kesalahan decoding token:', err);
      setError('Token tidak valid');
    }
  }, []);

  const handleEditPenilaian = (penilaian: Penilaian) => {
    setSelectedPenilaian(penilaian);
    setNilaiAkhir(penilaian.nilai_akhir);
    setGrade(penilaian.grade);
    setIsModalOpen(true);
  };

  const handleSavePenilaian = () => {
    // Implement saving logic if needed
    setIsModalOpen(false);
    alert('Penilaian berhasil disimpan!');
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredPenilaians = penilaians.filter((penilaian) =>
    penilaian.nama_berkas.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!Cookies.get('token')) {
    return <p>Memeriksa autentikasi...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-semibold">Penilaian Program MBKM</h1>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Cari berkas..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full rounded border border-gray-300 p-2"
        />
      </div>

      <section>
  <h2 className="mb-4 text-xl font-semibold">Tabel Penilaian</h2>
  <table className="w-full border-collapse border border-gray-300">
    <thead>
      <tr>
        <th className="border border-gray-300 px-4 py-2">No</th>
        <th className="border border-gray-300 px-4 py-2">Nama Berkas</th>
        <th className="border border-gray-300 px-4 py-2">Nilai Akhir</th>
        <th className="border border-gray-300 px-4 py-2">Grade</th>
        <th className="border border-gray-300 px-4 py-2">Aksi</th>
      </tr>
    </thead>
    <tbody>
      {filteredPenilaians.map((penilaian, index) => (
        <tr key={penilaian.id_konversi_nilai}>
          <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
          <td className="border border-gray-300 px-4 py-2">
            <button
              className="rounded bg-blue-500 px-4 py-2 text-white"
              
              onClick={() => window.open(penilaian.nama_berkas, '_blank')}
            >
              Detail
            </button>
          </td>
          <td className="border border-gray-300 px-4 py-2">{penilaian.nilai_akhir}</td>
          <td className="border border-gray-300 px-4 py-2">{penilaian.grade}</td>
          <td className="border border-gray-300 px-4 py-2">
            <button
              className="rounded bg-blue-500 px-4 py-2 text-white"
              onClick={() => handleEditPenilaian(penilaian)}
            >
              Edit
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</section>



      {isModalOpen && selectedPenilaian && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-96 rounded bg-white p-6 shadow-md">
            <h3 className="mb-4 text-xl font-semibold">Edit Penilaian</h3>
            <div className="mb-4">
              <label className="mb-2 block">Nilai Akhir:</label>
              <input
                type="number"
                value={nilaiAkhir}
                onChange={(e) => setNilaiAkhir(Number(e.target.value))}
                className="w-full rounded border border-gray-300 p-2"
              />
            </div>
            <div className="mb-4">
              <label className="mb-2 block">Grade:</label>
              <input
                type="text"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full rounded border border-gray-300 p-2"
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleSavePenilaian}
                className="mr-2 rounded bg-green-500 px-4 py-2 text-white"
              >
                Simpan
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded bg-gray-300 px-4 py-2 text-black"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
