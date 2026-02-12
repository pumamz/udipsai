package com.ucacue.udipsai.common.util;

import org.springframework.stereotype.Service;

@Service
public class CedulaValidatorService {

    public boolean validarCedulaEcuatoriana(String cedula) {
        if (cedula == null || cedula.length() != 10) {
            return false;
        }

        int digitoRegion = Integer.parseInt(cedula.substring(0, 2));
        if (digitoRegion < 1 || digitoRegion > 24) {
            return false; 
        }

        int ultimoDigito = Integer.parseInt(cedula.substring(9, 10));

        int sumaPares = Integer.parseInt(cedula.substring(1, 2)) +
                Integer.parseInt(cedula.substring(3, 4)) +
                Integer.parseInt(cedula.substring(5, 6)) +
                Integer.parseInt(cedula.substring(7, 8));

        int sumaImpares = 0;
        sumaImpares += multiplicarPorDosYRestarNueve(Integer.parseInt(cedula.substring(0, 1)));
        sumaImpares += multiplicarPorDosYRestarNueve(Integer.parseInt(cedula.substring(2, 3)));
        sumaImpares += multiplicarPorDosYRestarNueve(Integer.parseInt(cedula.substring(4, 5)));
        sumaImpares += multiplicarPorDosYRestarNueve(Integer.parseInt(cedula.substring(6, 7)));
        sumaImpares += multiplicarPorDosYRestarNueve(Integer.parseInt(cedula.substring(8, 9)));

        int sumaTotal = sumaPares + sumaImpares;

        int decenaInmediata = ((sumaTotal / 10) + 1) * 10;

        int digitoVerificador = decenaInmediata - sumaTotal;
        if (digitoVerificador == 10) {
            digitoVerificador = 0; 
        }

        return digitoVerificador == ultimoDigito;
    }

    private int multiplicarPorDosYRestarNueve(int numero) {
        int resultado = numero * 2;
        return (resultado > 9) ? resultado - 9 : resultado;
    }
}
