const { validarToqueDefensivo } = require('./server');

describe('Suite de Pruebas - Avance #4 (Validación de Toque Defensivo)', () => {

    test('1. Debe retornar true si los datos del toque defensivo son válidos', () => {
        const payloadValido = {
            coordenadaX: 10,
            coordenadaY: 25,
            tipoGolpe: 'Ataque de Redoblante'
        };
        expect(validarToqueDefensivo(payloadValido)).toBe(true);
    });

    test('2. Debe retornar false si coordenadaX no es un número', () => {
        const payloadInvalido = {
            coordenadaX: "10",
            coordenadaY: 25,
            tipoGolpe: 'Ataque de Redoblante'
        };
        expect(validarToqueDefensivo(payloadInvalido)).toBe(false);
    });

    test('3. Debe retornar false si coordenadaY no es un número', () => {
        const payloadInvalido = {
            coordenadaX: 10,
            coordenadaY: "25",
            tipoGolpe: 'Ataque de Redoblante'
        };
        expect(validarToqueDefensivo(payloadInvalido)).toBe(false);
    });

    test('4. Debe retornar false si tipoGolpe es un texto vacío', () => {
        const payloadInvalido = {
            coordenadaX: 10,
            coordenadaY: 25,
            tipoGolpe: '   '
        };
        expect(validarToqueDefensivo(payloadInvalido)).toBe(false);
    });

    test('5. Debe retornar false si se envía un objeto vacío', () => {
        expect(validarToqueDefensivo({})).toBe(false);
    });

    test('6. Debe retornar false si el argumento enviado es null o undefined', () => {
        expect(validarToqueDefensivo(null)).toBe(false);
        expect(validarToqueDefensivo(undefined)).toBe(false);
    });

});