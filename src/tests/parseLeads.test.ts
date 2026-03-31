import { describe, it, expect } from 'vitest';
import { extractLeads, extractResponseMeta } from '@/lib/parseLeads';

// ─── extractLeads ────────────────────────────────────────────────────────────

describe('extractLeads', () => {
  it('retorna array vazio para entrada nula ou undefined', () => {
    expect(extractLeads(null)).toEqual([]);
    expect(extractLeads(undefined)).toEqual([]);
  });

  it('retorna array vazio para string ou número', () => {
    expect(extractLeads('texto')).toEqual([]);
    expect(extractLeads(42)).toEqual([]);
  });

  it('extrai leads de um array direto', () => {
    const input = [
      { name: 'Padaria Central', place_id: 'abc123' },
      { name: 'Farmácia Popular', place_id: 'def456' },
    ];
    const resultado = extractLeads(input);
    expect(resultado).toHaveLength(2);
    expect(resultado[0].name).toBe('Padaria Central');
  });

  it('extrai leads de wrapper com chave "leads"', () => {
    const input = {
      message: 'ok',
      leads: [{ name: 'Loja A' }, { name: 'Loja B' }],
    };
    expect(extractLeads(input)).toHaveLength(2);
  });

  it('extrai leads de wrapper com chave "results"', () => {
    const input = { results: [{ name: 'Oficina X' }] };
    expect(extractLeads(input)).toHaveLength(1);
  });

  it('extrai leads de wrapper com chave "data"', () => {
    const input = { data: [{ name: 'Mercado Y' }] };
    expect(extractLeads(input)).toHaveLength(1);
  });

  it('extrai lead único de objeto com campo "name"', () => {
    const input = { name: 'Salão Z', website: 'https://salao.com' };
    const resultado = extractLeads(input);
    expect(resultado).toHaveLength(1);
    expect(resultado[0].name).toBe('Salão Z');
  });

  it('extrai lead único de objeto com campo "place_id"', () => {
    const input = { place_id: 'xyz789', formatted_address: 'Rua A, 123' };
    expect(extractLeads(input)).toHaveLength(1);
  });

  it('não trata objeto sem campos de lead como lead', () => {
    const input = { foo: 'bar', baz: 123 };
    expect(extractLeads(input)).toEqual([]);
  });

  it('achata arrays aninhados', () => {
    const input = [[{ name: 'Lead A' }], [{ name: 'Lead B' }]];
    expect(extractLeads(input)).toHaveLength(2);
  });

  it('ignora itens não-objeto dentro do array', () => {
    const input = [null, undefined, 'texto', { name: 'Lead válido' }];
    const resultado = extractLeads(input);
    expect(resultado).toHaveLength(1);
    expect(resultado[0].name).toBe('Lead válido');
  });

  it('retorna array vazio para objeto wrapper com array vazio', () => {
    const input = { leads: [] };
    expect(extractLeads(input)).toEqual([]);
  });
});

// ─── extractResponseMeta ─────────────────────────────────────────────────────

describe('extractResponseMeta', () => {
  it('retorna objeto vazio para entrada nula', () => {
    expect(extractResponseMeta(null)).toEqual({});
  });

  it('retorna objeto vazio para array', () => {
    expect(extractResponseMeta([{ name: 'Lead' }])).toEqual({});
  });

  it('extrai request_id, found e message quando presentes', () => {
    const input = {
      request_id: 'uuid-123',
      found: 15,
      message: 'Busca concluída',
    };
    const meta = extractResponseMeta(input);
    expect(meta.requestId).toBe('uuid-123');
    expect(meta.found).toBe(15);
    expect(meta.message).toBe('Busca concluída');
  });

  it('retorna undefined para campos ausentes', () => {
    const meta = extractResponseMeta({ leads: [] });
    expect(meta.requestId).toBeUndefined();
    expect(meta.found).toBeUndefined();
    expect(meta.message).toBeUndefined();
  });

  it('ignora request_id vazio', () => {
    const meta = extractResponseMeta({ request_id: '' });
    expect(meta.requestId).toBeUndefined();
  });

  it('ignora message vazia', () => {
    const meta = extractResponseMeta({ message: '' });
    expect(meta.message).toBeUndefined();
  });

  it('ignora found se não for número', () => {
    const meta = extractResponseMeta({ found: '15' });
    expect(meta.found).toBeUndefined();
  });
});
