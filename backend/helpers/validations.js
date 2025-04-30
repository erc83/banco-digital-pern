
// Validación básica de formato de RUT chileno sin calculo de digito verificador
const validateRut = (rut) => /^[0-9]+-[0-9kK]{1}$/.test(rut);

export { validateRut };


