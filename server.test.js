const { validarToqueDefensivo, app } = require('./server');
const request = require('supertest');

describe('Pruebas Unitarias - Lógica Central de Negocio', () => {
    
    // Prueba 1
    test('1. Debe aceptar un toque válido correctamente', () => {
        const toqueValido = { nombre: "Marcha", tempo: 120 };
        expect(validarToqueDefensivo(toqueValido)).toBe(true);
    });

    // Prueba 2
    test('2. Debe rechazar un toque sin nombre (código defensivo)', () => {
        const toqueInvalido = { tempo: 120 };
        expect(validarToqueDefensivo(toqueInvalido)).toBe(false);
    });

    // Prueba 3
    test('3. Debe rechazar un tempo negativo', () => {
        const toqueInvalido = { nombre: "Himno", tempo: -50 };
        expect(validarToqueDefensivo(toqueInvalido)).toBe(false);
    });

    // Prueba 4
    test('4. El endpoint /health debe devolver status 200 (Avance #5)', async () => {
        const response = await request(app).get('/health');
        expect(response.status).toBe(200);
        expect(response.body.status).toBe('ok');
    });

    // Prueba 5
    test('5. El endpoint /health debe incluir un timestamp', async () => {
        const response = await request(app).get('/health');
        expect(response.body.timestamp).toBeDefined();
    });
});