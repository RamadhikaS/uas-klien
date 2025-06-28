import React from 'react';
import Card from '../../../Components/Card'; 
import Heading from '../../../Components/Heading';

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell,
  LineChart, Line
} from 'recharts';

import { useGetChartData } from '../../../utils/Hooks/useChart';

const PIE_CHART_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const Dashboard = () => {
  const { data: chartData = {}, isLoading, isError } = useGetChartData();

  const {
    students = [],
    genderRatio = [],
    registrations = [],
  } = chartData;

  if (isLoading) {
    return (
      <Card>
        <div className="p-6 text-center text-gray-500">Memuat data chart...</div>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card>
        <div className="p-6 text-center text-red-500">Gagal memuat data chart. Silakan coba lagi nanti.</div>
      </Card>
    );
  }

  if (Object.keys(chartData).length === 0 && !isLoading) {
      return (
          <Card>
              <div className="p-6 text-center text-gray-500">Data chart tidak tersedia saat ini.</div>
          </Card>
      );
  }


  return (
    <div className="p-6 space-y-8">
      <Heading as="h1" className="text-3xl font-bold text-gray-800">Dashboard Visualisasi Data</Heading>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {students.length > 0 && (
          <Card className="col-span-1 lg:col-span-1"> 
            <Heading as="h2" className="text-xl font-semibold text-gray-700 mb-4">Mahasiswa per Fakultas</Heading>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={students} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="faculty" angle={-15} textAnchor="end" interval={0} height={50} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8884d8" name="Jumlah Mahasiswa" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        )}

        {genderRatio.length > 0 && (
          <Card className="col-span-1">
            <Heading as="h2" className="text-xl font-semibold text-gray-700 mb-4">Rasio Gender Mahasiswa</Heading>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={genderRatio}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="count"
                  nameKey="gender" 
                >
                  {genderRatio.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_CHART_COLORS[index % PIE_CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [value, name]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        )}

        {registrations.length > 0 && (
          <Card className="col-span-1 lg:col-span-2"> 
            <Heading as="h2" className="text-xl font-semibold text-gray-700 mb-4">Tren Pendaftaran Mahasiswa per Tahun</Heading>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={registrations} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="total" stroke="#82ca9d" name="Total Pendaftar" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        )}

      </div>
    </div>
  );
};

export default Dashboard;