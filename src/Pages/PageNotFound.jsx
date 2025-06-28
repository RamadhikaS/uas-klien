import React from "react";
import { Link } from "react-router-dom"; 
import Card from "../Components/Card"; 
import Heading from "../Components/Heading";
import Button from "../Components/Button";

const PageNotFound = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center px-4 text-center">
      <Card className="max-w-md w-full">
        <Heading as="h1" className="text-6xl !text-blue-600 !mb-4">404</Heading> 
        <Heading as="h2" className="text-2xl !mb-2">Halaman Tidak Ditemukan</Heading>
        <p className="text-gray-600 mb-6">
          Maaf, halaman yang kamu cari tidak tersedia atau telah dipindahkan.
        </p>
        <Button as={Link} to="/" variant="primary" className="w-auto"> 
          Kembali ke Halaman Login
        </Button>
      </Card>
    </div>
  );
};

export default PageNotFound;