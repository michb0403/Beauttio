//Prueba Unitaria
// backend/tests/corte.test.js

function validarCorte(corte) {
  const validos = ["degradado", "clásico", "fade", "undercut"];
  return validos.includes(corte.toLowerCase());
}

test('Corte válido', () => {
  expect(validarCorte('fade')).toBe(true);
});

test('Corte inválido', () => {
  expect(validarCorte('punk')).toBe(false);
});
