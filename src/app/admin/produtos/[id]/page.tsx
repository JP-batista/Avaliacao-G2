"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

type Produto = {
  id: number;
  nome: string;
  preco: number;
  quantidadeEmEstoque: number;
};

export default function ProdutoPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const [produto, setProduto] = useState<Produto | null>(null);

  useEffect(() => {
    const produtos = JSON.parse(localStorage.getItem("produtos") || "[]") as Produto[];
    setProduto(produtos.find((p) => p.id === parseInt(id)) || null);
  }, [id]);

  const atualizarEstoque = (quantidade: number) => {
    if (produto) {
      const atualizado = { ...produto, quantidadeEmEstoque: produto.quantidadeEmEstoque + quantidade };
      setProduto(atualizado);
      const produtos = (JSON.parse(localStorage.getItem("produtos") || "[]") as Produto[]).map(
        (p: Produto) => (p.id === atualizado.id ? atualizado : p)
      );
      localStorage.setItem("produtos", JSON.stringify(produtos));
    }
  };
  

  if (!produto) return <p>Produto não encontrado.</p>;

  const status =
    produto.quantidadeEmEstoque < 5
      ? { mensagem: "ESTOQUE INSUFICIENTE", cor: "bg-yellow-500" }
      : produto.quantidadeEmEstoque >= 20
      ? { mensagem: "ESTOQUE SUFICIENTE", cor: "bg-green-500" }
      : { mensagem: "ESTOQUE NORMAL", cor: "bg-gray-500" };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{produto.nome}</h1>
      <p>Preço: R$ {produto.preco.toFixed(2)}</p>
      <p>Estoque: {produto.quantidadeEmEstoque}</p>
      <div className={`inline-block p-2 text-white rounded ${status.cor}`}>{status.mensagem}</div>
      <div>
        <button
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
            onClick={() => atualizarEstoque(1)}
        >
            Aumentar Estoque
        </button>
        <button
            className="mt-4 ml-4 px-4 py-2 bg-gray-500 text-white rounded"
            onClick={() => router.push("/admin/produtos")}
        >
            Voltar
        </button>
      </div>
    </div>
  );
}