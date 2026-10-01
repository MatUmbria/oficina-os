import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tipo = searchParams.get('tipo') || 'marcas'; // marcas, modelos, anos
  const marcaId = searchParams.get('marcaId');
  const modeloId = searchParams.get('modeloId');

  try {
    // 1. Lista Marcas
    if (tipo === 'marcas') {
      const res = await fetch('https://parallelum.com.br/fipe/api/v1/carros/marcas');
      const marcas = await res.json();
      return NextResponse.json(marcas);
    }

    // 2. Lista Modelos da Marca
    if (tipo === 'modelos' && marcaId) {
      const res = await fetch(`https://parallelum.com.br/fipe/api/v1/carros/marcas/${marcaId}/modelos`);
      const data = await res.json();
      return NextResponse.json(data.modelos || []);
    }

    // 3. Lista Anos/Combustível do Modelo
    if (tipo === 'anos' && marcaId && modeloId) {
      const res = await fetch(`https://parallelum.com.br/fipe/api/v1/carros/marcas/${marcaId}/modelos/${modeloId}/anos`);
      const anos = await res.json();
      return NextResponse.json(anos || []);
    }

    return NextResponse.json({ error: 'Parâmetros inválidos' }, { status: 400 });
  } catch (error) {
    console.error('Erro ao consultar API FIPE:', error);
    return NextResponse.json({ error: 'Falha ao buscar dados na FIPE' }, { status: 500 });
  }
}