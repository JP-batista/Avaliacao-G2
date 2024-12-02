import Link from "next/link";

export default function HomePage() {
  return (
    <div  className="text-center flex items-center justify-center min-h-screen bg-gray-100">
      <div>
        <h1 className="text-xl font-bold mb-4">Gerenciador de Produtos</h1>
        <Link
          href="/admin/produtos"
          className="px-3 py-2 bg-blue-500 text-white rounded"
        >
          Acessar Lista de Produtos
        </Link>
      </div>
    </div>
  );
}
