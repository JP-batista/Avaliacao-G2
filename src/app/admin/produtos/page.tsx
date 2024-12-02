"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Produto = {
  id: number;
  nome: string;
  preco: number;
  quantidadeEmEstoque: number;
};

export default function ProdutosPage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);

  useEffect(() => {
    const savedProdutos = localStorage.getItem("produtos");
    if (savedProdutos) {
      setProdutos(JSON.parse(savedProdutos));
    } else {
      fetch("/produtos.json")
        .then((res) => res.json())
        .then((data) => {
          setProdutos(data);
          localStorage.setItem("produtos", JSON.stringify(data));
        });
    }
  }, []);

  const diminuirEstoque = (id: number) => {
    const updated = produtos.map((p) =>
      p.id === id && p.quantidadeEmEstoque > 0
        ? { ...p, quantidadeEmEstoque: p.quantidadeEmEstoque - 1 }
        : p
    );
    setProdutos(updated);
    localStorage.setItem("produtos", JSON.stringify(updated));
  };

  const totalProdutos = produtos.length;
  const produtoMaisCaro = produtos.reduce((prev, curr) =>
    curr.preco > prev.preco ? curr : prev
  , produtos[0]);
  const menorEstoque = Math.min(...produtos.map((p) => p.quantidadeEmEstoque));
  const produtosMenorEstoque = produtos.filter(
    (p) => p.quantidadeEmEstoque === menorEstoque
  );

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Lista de Produtos</h1>
      <table className="w-full border text-sm">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-4 py-2 border">Nome</th>
            <th className="px-4 py-2 border">Preço</th>
            <th className="px-4 py-2 border">Estoque</th>
            <th className="px-4 py-2 border">Ações</th>
          </tr>
        </thead>
        <tbody>
          {produtos.map((produto) => (
            <tr
              key={produto.id}
              className={
                produto.quantidadeEmEstoque < 5
                  ? "bg-yellow-300"
                  : produto.quantidadeEmEstoque >= 20
                  ? "bg-green-300"
                  : "bg-gray-200"
              }
            >
              <td className="px-4 py-2 border">{produto.nome}</td>
              <td className="px-4 py-2 border">R$ {produto.preco.toFixed(2)}</td>
              <td className="px-4 py-2 border">{produto.quantidadeEmEstoque}</td>
              <td className="px-4 py-2 border">
                <button
                  className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  onClick={() => diminuirEstoque(produto.id)}
                >
                  Diminuir
                </button>
                <Link
                  href={`/admin/produtos/${produto.id}`}
                  className="ml-2 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Ver Produto
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 p-4 border bg-gray-100">
        <h2 className="text-lg font-bold mb-2">Resumo</h2>
        <p>Total de Produtos: {totalProdutos}</p>
        <p>Mais Caro: {produtoMaisCaro?.nome} (R$ {produtoMaisCaro?.preco.toFixed(2)})</p>
        <p>
          Menor Estoque:{" "}
          {produtosMenorEstoque.map((p) => `${p.nome} (${p.quantidadeEmEstoque})`).join(", ")}
        </p>
      </div>
      <div className="mt-4">
        <Link
            href="/"
            className="mt-4 ml-4 px-4 py-2 bg-gray-500 text-white rounded"
        >
            Voltar
        </Link>
      </div>
    </div>
  );
}