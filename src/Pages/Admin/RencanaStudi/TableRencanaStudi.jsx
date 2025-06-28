
import React from 'react';
import Heading from "../../../Components/Heading"; 
import Button from "../../../Components/Button";
import Select from "../../../Components/Select"; 

const TableRencanaStudi = ({
  kelas,
  dosenList,
  mahasiswaList,
  matakuliahList,
  selectedMhsPerKelas,
  setSelectedMhsPerKelas,
  selectedDsnPerKelas,
  setSelectedDsnPerKelas,
  onUpdateDosenInKelas,
  onAddMahasiswaToKelas,
  onDeleteMahasiswaFromKelas,
  onDeleteKelas,
  getTotalSksDiambilMahasiswa,
  getSksMatakuliah,
  canUpdateKelas,
  canDeleteKelas,
}) => {

  if (!kelas || kelas.length === 0) {
    return <p className="text-center text-gray-500 my-4">Tidak ada kelas yang ditampilkan.</p>;
  }

  const getNamaMatakuliah = (id) => matakuliahList.find(mk => mk.id === id)?.namaMk || 'N/A';
  const getNamaDosen = (id) => dosenList.find(d => d.id === id)?.namaDosen || 'N/A';
  const getNamaMahasiswa = (id) => mahasiswaList.find(m => m.id === id)?.nama || 'N/A';
  const getNimMahasiswa = (id) => mahasiswaList.find(m => m.id === id)?.nim || 'N/A';


  return (
    <div className="space-y-8">
      {kelas.map((kls) => {
        const matakuliahTerkait = matakuliahList.find(mk => mk.id === kls.mata_kuliah_id);
        const dosenPengampu = dosenList.find(d => d.id === kls.dosen_id);
        const mahasiswaDiKelas = (kls.mahasiswa_ids || []).map(id =>
          mahasiswaList.find(m => m.id === id)
        ).filter(Boolean);

        return (
          <div key={kls.id} className="border border-gray-200 rounded-lg shadow-md bg-white">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border-b bg-gray-50 rounded-t-lg">
              <div className="mb-3 sm:mb-0">
                <Heading as="h3" className="!text-lg !font-semibold !mb-1">
                  {matakuliahTerkait?.namaMk || "Mata Kuliah Tidak Ditemukan"}
                  <span className="text-sm font-normal text-gray-500 ml-2">
                    ({matakuliahTerkait?.sks || 0} SKS)
                  </span>
                </Heading>
                <p className="text-sm text-gray-600">
                  Dosen Pengampu: <span className="font-medium">{dosenPengampu?.namaDosen || "Belum Ditentukan"}</span>
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                {canUpdateKelas && (
                  <div className="flex items-center gap-2">
                    <Select
                      value={selectedDsnPerKelas[kls.id] || kls.dosen_id || ""}
                      onChange={(e) => setSelectedDsnPerKelas(prev => ({ ...prev, [kls.id]: e.target.value }))}
                      options={(dosenList || []).map(d => ({ value: d.id, label: d.namaDosen }))}
                      defaultOptionText="-- Ganti Dosen --"
                      size="sm"
                      className="min-w-[150px]"
                      disabled={!canUpdateKelas}
                    />
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => onUpdateDosenInKelas(kls, selectedDsnPerKelas[kls.id])}
                      disabled={!selectedDsnPerKelas[kls.id] || selectedDsnPerKelas[kls.id] === kls.dosen_id || !canUpdateKelas}
                      className="whitespace-nowrap"
                    >
                      Simpan Dosen
                    </Button>
                  </div>
                )}
                {canDeleteKelas && mahasiswaDiKelas.length === 0 && (
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => onDeleteKelas(kls.id)}
                    className="whitespace-nowrap sm:ml-auto"
                  >
                    Hapus Kelas
                  </Button>
                )}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-xs">
                <thead className="bg-blue-50 text-blue-700">
                  <tr>
                    <th className="py-2 px-3 text-left">No</th>
                    <th className="py-2 px-3 text-left">NIM</th>
                    <th className="py-2 px-3 text-left">Nama Mahasiswa</th>
                    <th className="py-2 px-3 text-center">Total SKS Diambil</th>
                    {canUpdateKelas && (
                       <th className="py-2 px-3 text-center">Aksi</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {mahasiswaDiKelas.length > 0 ? (
                    mahasiswaDiKelas.map((mhs, index) => (
                      <tr key={mhs.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                        <td className="py-2 px-3">{index + 1}</td>
                        <td className="py-2 px-3">{mhs.nim}</td>
                        <td className="py-2 px-3">{mhs.nama}</td>
                        <td className="py-2 px-3 text-center">
                          {getTotalSksDiambilMahasiswa(mhs.id)} SKS
                        </td>
                        {canUpdateKelas && (
                          <td className="py-2 px-3 text-center">
                            <Button
                              size="sm" 
                              variant="danger"
                              onClick={() => onDeleteMahasiswaFromKelas(kls, mhs.id)}
                              className="!px-2 !py-1 text-xs"
                            >
                              Keluarkan
                            </Button>
                          </td>
                        )}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={canUpdateKelas ? 5 : 4} className="py-3 px-4 text-center italic text-gray-500">
                        Belum ada mahasiswa di kelas ini.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {canUpdateKelas && (
              <div className="flex items-center gap-2 p-3 border-t bg-gray-50 rounded-b-lg">
                <Select
                    value={selectedMhsPerKelas[kls.id] || ""}
                    onChange={(e) => setSelectedMhsPerKelas(prev => ({ ...prev, [kls.id]: e.target.value }))}
                    size="sm"
                    className="flex-grow"
                    defaultOptionText="-- Pilih Mahasiswa --"
                    disabled={!canUpdateKelas}
                    options={ 
                        (mahasiswaList || [])
                        .filter(m => !(kls.mahasiswa_ids || []).includes(m.id))
                        .map((m) => ({ value: m.id, label: `${m.nama} (${m.nim})` }))
                    }
                    />
                <Button
                  size="sm"
                  onClick={() => onAddMahasiswaToKelas(kls, selectedMhsPerKelas[kls.id])}
                  disabled={!selectedMhsPerKelas[kls.id] || !canUpdateKelas}
                  className="whitespace-nowrap"
                >
                  + Tambah ke Kelas
                </Button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default TableRencanaStudi;