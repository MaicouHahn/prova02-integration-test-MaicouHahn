// test/api.integration.test.ts

describe('Testes de Integração com API Pública (Reqres.in)', () => {
  const BASE_URL = 'https://reqres.in/api';

  // TESTE 1: GET - Sucesso
  it('1. deve buscar um usuário específico com sucesso (GET)', async () => {
    const response = await fetch(`${BASE_URL}/users/2`);
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(result.data).toBeDefined();
    expect(result.data.id).toBe(2);
    expect(result.data.email).toContain('@reqres.in');
  });

  // TESTE 2: GET - Falha tratada (Not Found)
  it('2. deve retornar erro 404 ao buscar um usuário inexistente (GET)', async () => {
    // Requisita um ID que não existe (9999)
    const response = await fetch(`${BASE_URL}/users/9999`);

    // A API deve tratar e retornar 404 Not Found
    expect(response.status).toBe(404);

    // O corpo da resposta para 404 nessa API é um objeto vazio
    const result = await response.json();
    expect(result).toEqual({});
  });

  // TESTE 3: POST - Sucesso na Criação
  it('3. deve criar um novo usuário com sucesso (POST)', async () => {
    const payload = {
      name: 'Maria Silva',
      job: 'Engenheira de Dados',
    };

    const response = await fetch(`${BASE_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    expect(response.status).toBe(201); // 201 Created
    expect(data).toHaveProperty('id');
    expect(data).toHaveProperty('createdAt');
    expect(data.name).toBe(payload.name);
    expect(data.job).toBe(payload.job);
  });

  // TESTE 4: POST - Falha tratada (Bad Request)
  it('4. deve retornar erro 400 ao tentar registrar usuário sem senha (POST)', async () => {
    // Payload incompleto de propósito (faltando a senha)
    const payload = {
      email: 'sydney@fife',
    };

    const response = await fetch(`${BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    // A API deve negar a requisição por falta de dados
    expect(response.status).toBe(400);
    expect(data).toHaveProperty('error');
    expect(data.error).toBe('Missing password');
  });

  // TESTE 5: PUT - Sucesso na Atualização
  it('5. deve atualizar os dados de um usuário existente (PUT)', async () => {
    const payloadAtualizado = {
      name: 'Maria Silva Atualizada',
      job: 'Arquiteta de Software',
    };

    const response = await fetch(`${BASE_URL}/users/2`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payloadAtualizado),
    });

    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty('updatedAt');
    expect(data.name).toBe(payloadAtualizado.name);
    expect(data.job).toBe(payloadAtualizado.job);
  });

  // TESTE 6: DELETE - Sucesso na Exclusão
  it('6. deve remover um usuário com sucesso (DELETE)', async () => {
    const response = await fetch(`${BASE_URL}/users/2`, {
      method: 'DELETE',
    });

    // O padrão HTTP para deleção com sucesso é 204 (No Content)
    expect(response.status).toBe(204);

    // Como é 204 (sem conteúdo), não podemos usar .json(), então validamos o texto vazio
    const text = await response.text();
    expect(text).toBe('');
  });
});