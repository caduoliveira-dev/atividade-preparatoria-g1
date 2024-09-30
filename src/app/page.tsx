"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

interface Producao {
  titulo: string;
  descricao: string;
  tipo: "filme" | "serie";
  ano: string;
  genero: string;
  duracao?: string;
  temporadas?: string;
  avaliacao?: number; // Adicionando campo de avaliação
}

export default function Home() {
  const [formData, setFormData] = useState<Producao>({
    titulo: "",
    descricao: "",
    tipo: "filme",
    ano: "",
    genero: "",
  });

  const [productions, setProductions] = useState<Producao[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null); // Estado para controlar se estamos editando

  useEffect(() => {
    const storedProductions = localStorage.getItem("productions");
    if (storedProductions) {
      setProductions(JSON.parse(storedProductions));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleTypeChange = (value: "filme" | "serie") => {
    setFormData({ ...formData, tipo: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.titulo || !formData.ano || !formData.genero) {
      alert("Por favor, preencha todos os campos obrigatórios!");
      return;
    }

    if (editingIndex !== null) {
      // Atualiza a produção existente
      const updatedProductions = productions.map((production, index) =>
        index === editingIndex ? { ...formData, avaliacao: production.avaliacao || 0 } : production
      );
      setProductions(updatedProductions);
      localStorage.setItem("productions", JSON.stringify(updatedProductions));
      setEditingIndex(null); // Reseta o índice de edição após a atualização
    } else {
      // Adiciona uma nova produção
      const updatedProductions = [...productions, { ...formData, avaliacao: 0 }];
      setProductions(updatedProductions);
      localStorage.setItem("productions", JSON.stringify(updatedProductions));
    }

    // Reseta o formulário
    setFormData({
      titulo: "",
      descricao: "",
      tipo: "filme",
      ano: "",
      genero: "",
    });
  };

  const handleEdit = (index: number) => {
    const productionToEdit = productions[index];
    setFormData(productionToEdit); // Preenche o formulário com os dados existentes
    setEditingIndex(index); // Define o índice que está sendo editado
  };

  const handleDelete = (index: number) => {
    const updatedProductions = productions.filter((_, i) => i !== index);
    setProductions(updatedProductions);
    localStorage.setItem("productions", JSON.stringify(updatedProductions));
  };

  const handleRating = (index: number, rating: number) => {
    const updatedProductions = productions.map((production, i) =>
      i === index ? { ...production, avaliacao: rating } : production
    );
    setProductions(updatedProductions);
    localStorage.setItem("productions", JSON.stringify(updatedProductions));
  };

  return (
    <main className="p-8 lg:grid lg:grid-cols-2">
      <div className="mr-4">
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <Label>Título</Label>
          <Input
            type="text"
            name="titulo"
            value={formData.titulo}
            onChange={handleChange}
            required
          />

          <Label>Descrição</Label>
          <Textarea
            name="descricao"
            value={formData.descricao}
            onChange={handleChange}
          />

          <Label>Tipo</Label>
          <RadioGroup value={formData.tipo} onValueChange={handleTypeChange}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="filme" id="r1" />
              <Label htmlFor="r1">Filme</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="serie" id="r2" />
              <Label htmlFor="r2">Série</Label>
            </div>
          </RadioGroup>

          <Label>Ano</Label>
          <Input
            type="text"
            name="ano"
            value={formData.ano}
            onChange={handleChange}
            required
          />

          <Label>Gênero</Label>
          <Input
            type="text"
            name="genero"
            value={formData.genero}
            onChange={handleChange}
            required
          />

          {formData.tipo === "filme" ? (
            <>
              <Label>Duração</Label>
              <Input
                type="text"
                name="duracao"
                value={formData.duracao}
                onChange={handleChange}
              />
            </>
          ) : (
            <>
              <Label>Temporadas</Label>
              <Input
                type="text"
                name="temporadas"
                value={formData.temporadas}
                onChange={handleChange}
              />
            </>
          )}

          <div>
            <Button
              className="bg-blue-600 hover:bg-blue-800 mr-4"
              type="submit"
            >
              {editingIndex !== null ? "Atualizar" : "Salvar"}
            </Button>
            <Button
              className="bg-zinc-600 hover:bg-zinc-800"
              type="button"
              onClick={() => setEditingIndex(null)} // Limpa o estado de edição
            >
              Cancelar
            </Button>
          </div>
        </form>
      </div>
      <div className="mt-4 lg:mt-0">
        {productions.map((production, index) => (
          <Card key={index} className="mb-4">
            <CardHeader>
              <p>
                {production.tipo.charAt(0).toUpperCase() + production.tipo.slice(1)}
              </p>
            </CardHeader>
            <Separator />
            <CardContent className="mt-4">
              <CardTitle className="text-lg mb-2">{production.titulo}</CardTitle>
              <p className="font-semibold">
                {production.ano} - {production.genero} -{" "}
                {production.tipo === "filme" ? production.duracao : production.temporadas}
              </p>
              <p className="justify">{production.descricao}</p>
              <div className="mt-2">
                <Button
                  className="bg-blue-600 hover:bg-blue-800 mr-4"
                  onClick={() => handleEdit(index)}
                >
                  Editar
                </Button>
                <Button
                  className="bg-red-600 hover:bg-red-800"
                  onClick={() => handleDelete(index)}
                >
                  Excluir
                </Button>
              </div>
            </CardContent>
            <CardFooter className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleRating(index, star)}
                  className="text-yellow-500"
                >
                  {star <= (production.avaliacao || 0) ? "★" : "☆"}
                </button>
              ))}
            </CardFooter>
          </Card>
        ))}
      </div>
    </main>
  );
}
