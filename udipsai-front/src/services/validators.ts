export const validarCedulaEcuatoriana = (cedula: string): boolean => {
  if (!cedula || cedula.length !== 10) {
    return false;
  }

  if (!/^\d+$/.test(cedula)) {
    return false;
  }

  const digitoRegion = parseInt(cedula.substring(0, 2), 10);
  if (digitoRegion < 1 || digitoRegion > 24) {
    return false;
  }

  const ultimoDigito = parseInt(cedula.substring(9, 10), 10);

  const sumaPares =
    parseInt(cedula.substring(1, 2), 10) +
    parseInt(cedula.substring(3, 4), 10) +
    parseInt(cedula.substring(5, 6), 10) +
    parseInt(cedula.substring(7, 8), 10);

  const multiplicarPorDosYRestarNueve = (numero: number): number => {
    const resultado = numero * 2;
    return resultado > 9 ? resultado - 9 : resultado;
  };

  let sumaImpares = 0;
  sumaImpares += multiplicarPorDosYRestarNueve(parseInt(cedula.substring(0, 1), 10));
  sumaImpares += multiplicarPorDosYRestarNueve(parseInt(cedula.substring(2, 3), 10));
  sumaImpares += multiplicarPorDosYRestarNueve(parseInt(cedula.substring(4, 5), 10));
  sumaImpares += multiplicarPorDosYRestarNueve(parseInt(cedula.substring(6, 7), 10));
  sumaImpares += multiplicarPorDosYRestarNueve(parseInt(cedula.substring(8, 9), 10));

  const sumaTotal = sumaPares + sumaImpares;
  const decenaInmediata = Math.ceil(sumaTotal / 10) * 10;

  let digitoVerificador = decenaInmediata - sumaTotal;
  if (digitoVerificador === 10) {
    digitoVerificador = 0;
  }

  return digitoVerificador === ultimoDigito;
};

export const validarEmail = (email: string): boolean => {
  if (!email) return true;
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(email);
};

export const validarSoloNumeros = (valor: string): boolean => {
  if (!valor) return true;
  return /^\d+$/.test(valor);
};
