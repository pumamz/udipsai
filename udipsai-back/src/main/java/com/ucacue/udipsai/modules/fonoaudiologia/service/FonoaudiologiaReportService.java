package com.ucacue.udipsai.modules.fonoaudiologia.service;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ucacue.udipsai.common.report.ExcelGenerator;
import com.ucacue.udipsai.modules.fonoaudiologia.dto.FonoaudiologiaDTO;
import com.ucacue.udipsai.modules.fonoaudiologia.domain.components.*;

@Service
public class FonoaudiologiaReportService {

    @Autowired
    private FonoaudiologiaService fonoaudiologiaService;

    private final SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");

    public ByteArrayInputStream exportarExcel(Integer pacienteId) throws IOException {
        List<FonoaudiologiaDTO> fichas;
        if (pacienteId != null) {
            FonoaudiologiaDTO ficha = fonoaudiologiaService.obtenerFichaFonoaudiologiaPorPacienteId(pacienteId);
            fichas = ficha != null ? List.of(ficha) : List.of();
        } else {
            fichas = fonoaudiologiaService.listarFichasFonoaudiologia();
        }

        String[] headers = {
                // DATOS BÁSICOS
                "ID", "Paciente", "Cédula", "Estado",
                // HABLA
                "HABLA: Dificultad pronunciar palabras", "HABLA: Se traba al hablar", "HABLA: Se entiende lo que dice",
                "HABLA: Sabe nombre objetos", "HABLA: Comprende lo que se le dice", "HABLA: Reconoce fuente sonora",
                "HABLA: Forma comunicación preferente", "HABLA: Trastorno específico pronunciación",
                "HABLA: Trastorno lenguaje expresivo", "HABLA: Afasia adquirida epilepsia",
                "HABLA: Otros trastornos desarrollo habla", "HABLA: Trastorno desarrollo habla/lenguaje",
                "HABLA: Trastorno recepción lenguaje", "HABLA: Alteraciones habla", "HABLA: Disfasia/Afasia",
                "HABLA: Disartria/Anartria", "HABLA: Otras alteraciones habla",
                // AUDICIÓN
                "AUDICIÓN: Examen audiológico realizado", "AUDICIÓN: Pérdida conductiva/neurosensorial",
                "AUDICIÓN: Audición normal", "AUDICIÓN: Hipoacusia conductiva bilateral",
                "AUDICIÓN: Hipoacusia conductiva unilateral", "AUDICIÓN: Hipoacusia neurosensorial bilateral",
                "AUDICIÓN: Hipoacusia neurosensorial unilateral", "AUDICIÓN: Detalles audición",
                "AUDICIÓN: Infecciones oído fuertes", "AUDICIÓN: Cuál infección",
                "AUDICIÓN: Edad infecciones", "AUDICIÓN: Pérdida auditiva", "AUDICIÓN: Oído derecho",
                "AUDICIÓN: Oído izquierdo", "AUDICIÓN: Bilateral", "AUDICIÓN: Grado pérdida",
                "AUDICIÓN: Permanencia", "AUDICIÓN: Otitis", "AUDICIÓN: Tipo otitis",
                "AUDICIÓN: Duración otitis inicio", "AUDICIÓN: Duración otitis fin",
                "AUDICIÓN: Antecedentes familiares", "AUDICIÓN: Exposición ruidos", "AUDICIÓN: Ototóxicos",
                "AUDICIÓN: Infecciones", "AUDICIÓN: Uso audífonos", "AUDICIÓN: Implante coclear",
                "AUDICIÓN: Vibrador óseo", "AUDICIÓN: Inicio ayudas auditivas", "AUDICIÓN: Fin ayudas auditivas",
                // FONACIÓN
                "FONACIÓN: Tono voz apropiado", "FONACIÓN: Respiración normal", "FONACIÓN: Situaciones altera tono",
                "FONACIÓN: Desde cuándo alteraciones", "FONACIÓN: Tono de voz", "FONACIÓN: Respiración",
                "FONACIÓN: Ronca", "FONACIÓN: Ronca desde cuándo", "FONACIÓN: Juego vocal",
                "FONACIÓN: Juego vocal desde cuándo", "FONACIÓN: Vocalización", "FONACIÓN: Vocalización desde cuándo",
                "FONACIÓN: Balbuceo", "FONACIÓN: Balbuceo desde cuándo", "FONACIÓN: Silabeo",
                "FONACIÓN: Silabeo desde cuándo", "FONACIÓN: Primeras palabras",
                "FONACIÓN: Primeras palabras desde cuándo", "FONACIÓN: Oraciones 2 palabras",
                "FONACIÓN: Oraciones 2 palabras desde cuándo", "FONACIÓN: Oraciones 3 palabras",
                "FONACIÓN: Oraciones 3 palabras desde cuándo", "FONACIÓN: Formación lingüística completa",
                "FONACIÓN: Formación lingüística completa desde cuándo", "FONACIÓN: Número total palabras",
                // HISTORIA AUDITIVA
                "HISTORIA: Otalgia", "HISTORIA: Otalgia Unilateral", "HISTORIA: Otalgia OD", "HISTORIA: Otalgia OI",
                "HISTORIA: Otalgia Bilateral", "HISTORIA: Otalgia Continua", "HISTORIA: Otalgia Intermitente",
                "HISTORIA: Grado Otalgia", "HISTORIA: Otalgia asociada IRA", "HISTORIA: Otalgia Punzante",
                "HISTORIA: Otalgia Pulsátil", "HISTORIA: Otalgia Progresivo", "HISTORIA: Otalgia Opresivo",
                "HISTORIA: Pruriginoso", "HISTORIA: Aumenta masticar", "HISTORIA: Disminuye calor local",
                "HISTORIA: Aumenta calor local", "HISTORIA: Otorrea", "HISTORIA: Otorrea Unilateral",
                "HISTORIA: Otorrea OD", "HISTORIA: Otorrea OI", "HISTORIA: Otorrea Bilateral",
                "HISTORIA: Otorrea Continua", "HISTORIA: Otorrea Intermitente", "HISTORIA: Grado Otorrea",
                "HISTORIA: Otorrea Claro", "HISTORIA: Otorrea Seroso", "HISTORIA: Otorrea Mucoso",
                "HISTORIA: Otorrea Mucopurulento", "HISTORIA: Otorrea Purulento", "HISTORIA: Otorrea Sanguinolento",
                "HISTORIA: Otorrea asociada IRA", "HISTORIA: Otorrea asociada Infección Aguda",
                "HISTORIA: Presentó Otalgia", "HISTORIA: Presentó Otalgia Bilateral", "HISTORIA: Presentó Otalgia OD",
                "HISTORIA: Presentó Otalgia OI", "HISTORIA: Sensación oído tapado",
                "HISTORIA: Sensación tapado Bilateral", "HISTORIA: Sensación tapado OD",
                "HISTORIA: Sensación tapado OI",
                "HISTORIA: Autofonía", "HISTORIA: Autofonía Bilateral", "HISTORIA: Autofonía OD",
                "HISTORIA: Autofonía OI", "HISTORIA: Presentó Otorrea", "HISTORIA: Presentó Otorrea Bilateral",
                "HISTORIA: Presentó Otorrea OD", "HISTORIA: Presentó Otorrea OI", "HISTORIA: Aumenta volumen TV",
                "HISTORIA: Tinnitus", "HISTORIA: Expuesto ruidos fuertes", "HISTORIA: Dificultad oír voz baja",
                "HISTORIA: Habla más fuerte/despacio", "HISTORIA: Utiliza ayuda auditiva", "HISTORIA: Cuál ayuda",
                "HISTORIA: Percibe sonido igual ambos oídos", "HISTORIA: Oído escucha mejor",
                "HISTORIA: Tiempo síntomas auditivos",
                // VESTIBULAR
                "VESTIBULAR: Falta equilibrio caminar", "VESTIBULAR: Mareos", "VESTIBULAR: Cuándo mareos",
                "VESTIBULAR: Vértigo",
                // OTOSCOPIA
                "OTOSCOPIA OD: Palpación pabellón", "OTOSCOPIA OD: Palpación mastoides", "OTOSCOPIA OD: CAE",
                "OTOSCOPIA OD: Obstrucción", "OTOSCOPIA OD: Apariencia membrana", "OTOSCOPIA OD: Perforación",
                "OTOSCOPIA OD: Burbuja", "OTOSCOPIA OD: Coloración", "OTOSCOPIA OI: Palpación pabellón",
                "OTOSCOPIA OI: Palpación mastoides", "OTOSCOPIA OI: CAE", "OTOSCOPIA OI: Obstrucción",
                "OTOSCOPIA OI: Apariencia membrana", "OTOSCOPIA OI: Perforación", "OTOSCOPIA OI: Burbuja",
                "OTOSCOPIA OI: Coloración"
        };

        return ExcelGenerator.generateExcel("Fichas Fonoaudiología", headers, fichas, (row, f) -> {
            int col = 0;
            // DATOS BÁSICOS
            row.createCell(col++).setCellValue(fmt(f.getId()));
            row.createCell(col++).setCellValue(f.getPaciente() != null ? f.getPaciente().getNombresApellidos() : "N/A");
            row.createCell(col++).setCellValue(f.getPaciente() != null ? f.getPaciente().getCedula() : "N/A");
            row.createCell(col++).setCellValue(f.getActivo() ? "Activa" : "Inactiva");

            // HABLA
            Habla h = f.getHabla();
            if (h != null) {
                row.createCell(col++).setCellValue(fmt(h.getDificultadPronunciarPalabras()));
                row.createCell(col++).setCellValue(fmt(h.getSeTrabaCuandoHabla()));
                row.createCell(col++).setCellValue(fmt(h.getSeEntiendeLoQueDice()));
                row.createCell(col++).setCellValue(fmt(h.getSabeComoLlamanObjetosEntorno()));
                row.createCell(col++).setCellValue(fmt(h.getComprendeLoQueSeLeDice()));
                row.createCell(col++).setCellValue(fmt(h.getReconoceFuenteSonora()));
                row.createCell(col++).setCellValue(fmt(h.getComunicacionPreferentementeForma()));
                row.createCell(col++).setCellValue(fmt(h.getTrastornoEspecificoPronunciacion()));
                row.createCell(col++).setCellValue(fmt(h.getTrastornoLenguajeExpresivo()));
                row.createCell(col++).setCellValue(fmt(h.getAfasiaAdquiridaEpilepsia()));
                row.createCell(col++).setCellValue(fmt(h.getOtrosTrastornosDesarrolloHabla()));
                row.createCell(col++).setCellValue(fmt(h.getTrastornoDesarrolloHablaLenguaje()));
                row.createCell(col++).setCellValue(fmt(h.getTrastornoRecepcionLenguaje()));
                row.createCell(col++).setCellValue(fmt(h.getAlteracionesHabla()));
                row.createCell(col++).setCellValue(fmt(h.getDisfasiaAfasia()));
                row.createCell(col++).setCellValue(fmt(h.getDisartriaAnartria()));
                row.createCell(col++).setCellValue(fmt(h.getOtrasAlteracionesHabla()));
            } else {
                col += 17;
            }

            // AUDICIÓN
            Audicion a = f.getAudicion();
            if (a != null) {
                row.createCell(col++).setCellValue(fmt(a.getSeARealizadoExamenAudiologico()));
                row.createCell(col++).setCellValue(fmt(a.getPerdidaAuditivaConductivaNeurosensorial()));
                row.createCell(col++).setCellValue(fmt(a.getAudicionNormal()));
                row.createCell(col++).setCellValue(fmt(a.getHipoacusiaConductivaBilateral()));
                row.createCell(col++).setCellValue(fmt(a.getHipoacusiaConductivaUnilateral()));
                row.createCell(col++).setCellValue(fmt(a.getHipoacusiaNeurosensorialBilateral()));
                row.createCell(col++).setCellValue(fmt(a.getHipoacusiaNeurosensorialUnilateral()));
                row.createCell(col++).setCellValue(fmt(a.getDetallesAudicion()));
                row.createCell(col++).setCellValue(fmt(a.getInfeccionesOidoFuertes()));
                row.createCell(col++).setCellValue(fmt(a.getCualInfeccionesOidoFuertes()));
                row.createCell(col++).setCellValue(fmt(a.getEdadInfeccionesOidoFuertes()));
                row.createCell(col++).setCellValue(fmt(a.getPerdidaAuditiva()));
                row.createCell(col++).setCellValue(fmt(a.getOidoDerecho()));
                row.createCell(col++).setCellValue(fmt(a.getOidoIzquierdo()));
                row.createCell(col++).setCellValue(fmt(a.getBilateral()));
                row.createCell(col++).setCellValue(fmt(a.getGradoPerdida()));
                row.createCell(col++).setCellValue(fmt(a.getPermanecia()));
                row.createCell(col++).setCellValue(fmt(a.getOtitis()));
                row.createCell(col++).setCellValue(fmt(a.getTipoOtitis()));
                row.createCell(col++).setCellValue(fmt(a.getDuracionOtitisInicio()));
                row.createCell(col++).setCellValue(fmt(a.getDuracionOtitisFin()));
                row.createCell(col++).setCellValue(fmt(a.getAntecedentesFamiliares()));
                row.createCell(col++).setCellValue(fmt(a.getExposisionRuidos()));
                row.createCell(col++).setCellValue(fmt(a.getOtotoxicos()));
                row.createCell(col++).setCellValue(fmt(a.getInfecciones()));
                row.createCell(col++).setCellValue(fmt(a.getUsoAudifonos()));
                row.createCell(col++).setCellValue(fmt(a.getImplanteCoclear()));
                row.createCell(col++).setCellValue(fmt(a.getVibradorOseo()));
                row.createCell(col++).setCellValue(fmt(a.getInicioAyudasAuditivas()));
                row.createCell(col++).setCellValue(fmt(a.getFinAyudasAuditivas()));
            } else {
                col += 30;
            }

            // FONACIÓN
            Fonacion fon = f.getFonacion();
            if (fon != null) {
                row.createCell(col++).setCellValue(fmt(fon.getCreeTonoVozEstudianteApropiado()));
                row.createCell(col++).setCellValue(fmt(fon.getRespiracionNormal()));
                row.createCell(col++).setCellValue(fmt(fon.getSituacionesAlteraTonoVoz()));
                row.createCell(col++).setCellValue(fmt(fon.getDesdeCuandoAlteracionesVoz()));
                row.createCell(col++).setCellValue(fmt(fon.getTonoDeVoz()));
                row.createCell(col++).setCellValue(fmt(fon.getRespiracion()));
                row.createCell(col++).setCellValue(fmt(fon.getRonca()));
                row.createCell(col++).setCellValue(fmt(fon.getRoncaDesdeCuando()));
                row.createCell(col++).setCellValue(fmt(fon.getJuegoVocal()));
                row.createCell(col++).setCellValue(fmt(fon.getJuegoVocalDesdeCuando()));
                row.createCell(col++).setCellValue(fmt(fon.getVocalizacion()));
                row.createCell(col++).setCellValue(fmt(fon.getVocalizacionDesdeCuando()));
                row.createCell(col++).setCellValue(fmt(fon.getBalbuceo()));
                row.createCell(col++).setCellValue(fmt(fon.getBalbuceoDesdeCuando()));
                row.createCell(col++).setCellValue(fmt(fon.getSilabeo()));
                row.createCell(col++).setCellValue(fmt(fon.getSilabeoDesdeCuando()));
                row.createCell(col++).setCellValue(fmt(fon.getPrimerasPalabras()));
                row.createCell(col++).setCellValue(fmt(fon.getPrimerasPalabrasDesdeCuando()));
                row.createCell(col++).setCellValue(fmt(fon.getOracionesDosPalabras()));
                row.createCell(col++).setCellValue(fmt(fon.getOracionesDosPalabrasDesdeCuando()));
                row.createCell(col++).setCellValue(fmt(fon.getOracionesTresPalabras()));
                row.createCell(col++).setCellValue(fmt(fon.getOracionesTresPalabrasDesdeCuando()));
                row.createCell(col++).setCellValue(fmt(fon.getFormacionLinguisticaCompleta()));
                row.createCell(col++).setCellValue(fmt(fon.getFormacionLinguisticaCompletaDesdeCuando()));
                row.createCell(col++).setCellValue(fmt(fon.getNumeroTotalPalabras()));
            } else {
                col += 25;
            }

            // HISTORIA AUDITIVA
            HistoriaAuditiva ha = f.getHistoriaAuditiva();
            if (ha != null) {
                row.createCell(col++).setCellValue(fmt(ha.getOtalgia()));
                row.createCell(col++).setCellValue(fmt(ha.getOtalgiaUnilateral()));
                row.createCell(col++).setCellValue(fmt(ha.getOtalgiaOidoDerecho()));
                row.createCell(col++).setCellValue(fmt(ha.getOtalgiaOidoIzquierdo()));
                row.createCell(col++).setCellValue(fmt(ha.getOtalgiaBilateral()));
                row.createCell(col++).setCellValue(fmt(ha.getPermanenciaOtalgiaContinua()));
                row.createCell(col++).setCellValue(fmt(ha.getPermanenciaOtalgiaIntermitente()));
                row.createCell(col++).setCellValue(fmt(ha.getGradoPermanenciaOtalgia()));
                row.createCell(col++).setCellValue(fmt(ha.getAsociadaOtalgiaInfeccionRespiratoriaAlta()));
                row.createCell(col++).setCellValue(fmt(ha.getInfeccionRespiratoriaPunzante()));
                row.createCell(col++).setCellValue(fmt(ha.getInfeccionRespiratoriaPulsatil()));
                row.createCell(col++).setCellValue(fmt(ha.getInfeccionRespiratoriaProgresivo()));
                row.createCell(col++).setCellValue(fmt(ha.getInfeccionRespiratoriaOpresivo()));
                row.createCell(col++).setCellValue(fmt(ha.getPruriginoso()));
                row.createCell(col++).setCellValue(fmt(ha.getAumentaMasticar()));
                row.createCell(col++).setCellValue(fmt(ha.getDisminuyeConCalorLocal()));
                row.createCell(col++).setCellValue(fmt(ha.getAumentaConCalorLocal()));
                row.createCell(col++).setCellValue(fmt(ha.getOtorrea()));
                row.createCell(col++).setCellValue(fmt(ha.getOtorreaUnilateral()));
                row.createCell(col++).setCellValue(fmt(ha.getOtorreaOidoDerecho()));
                row.createCell(col++).setCellValue(fmt(ha.getOtorreaOidoIzquierdo()));
                row.createCell(col++).setCellValue(fmt(ha.getOtorreaBilateral()));
                row.createCell(col++).setCellValue(fmt(ha.getPermanenciaOtorreaContinua()));
                row.createCell(col++).setCellValue(fmt(ha.getPermanenciaOtorreaIntermitente()));
                row.createCell(col++).setCellValue(fmt(ha.getGradoPermanenciaOtorrea()));
                row.createCell(col++).setCellValue(fmt(ha.getAspectoClaroOtorrea()));
                row.createCell(col++).setCellValue(fmt(ha.getAspectoSerosoOtorrea()));
                row.createCell(col++).setCellValue(fmt(ha.getAspectoMucosoOtorrea()));
                row.createCell(col++).setCellValue(fmt(ha.getAspectoMucopurulentoOtorrea()));
                row.createCell(col++).setCellValue(fmt(ha.getAspectoPurulentoOtorrea()));
                row.createCell(col++).setCellValue(fmt(ha.getAspectoSanguinolentoOtorrea()));
                row.createCell(col++).setCellValue(fmt(ha.getAsosiadaOtorreaInfeccionRespiratoriaAlta()));
                row.createCell(col++).setCellValue(fmt(ha.getAsosiadaotorreaInfeccionAgudaOido()));
                row.createCell(col++).setCellValue(fmt(ha.getPresentoOtalgia()));
                row.createCell(col++).setCellValue(fmt(ha.getPresentoOtalgiaBilateral()));
                row.createCell(col++).setCellValue(fmt(ha.getPresentoOtalgiaOidoDerecho()));
                row.createCell(col++).setCellValue(fmt(ha.getPresentoOtalgiaOidoIzquierdo()));
                row.createCell(col++).setCellValue(fmt(ha.getPresentoSensacionOidoTapado()));
                row.createCell(col++).setCellValue(fmt(ha.getPresentoSensacionOidoTapadoBilateral()));
                row.createCell(col++).setCellValue(fmt(ha.getPresentoSensacionOidoTapadoOidoDerecho()));
                row.createCell(col++).setCellValue(fmt(ha.getPresentoSensacionOidoTapadoOidoIzquierdo()));
                row.createCell(col++).setCellValue(fmt(ha.getPresentoAutofonia()));
                row.createCell(col++).setCellValue(fmt(ha.getPresentoAutofoniaBilateral()));
                row.createCell(col++).setCellValue(fmt(ha.getPresentoAutofoniaOidoDerecho()));
                row.createCell(col++).setCellValue(fmt(ha.getPresentoAutofoniaOidoIzquierdo()));
                row.createCell(col++).setCellValue(fmt(ha.getPresentoOtorrea()));
                row.createCell(col++).setCellValue(fmt(ha.getPresentoOtorreaBilateral()));
                row.createCell(col++).setCellValue(fmt(ha.getPresentoOtorreaOidoDerecho()));
                row.createCell(col++).setCellValue(fmt(ha.getPresentoOtorreaOidoIzquierdo()));
                row.createCell(col++).setCellValue(fmt(ha.getAumentaVolumenTV()));
                row.createCell(col++).setCellValue(fmt(ha.getSensacionPercibirTinnitus()));
                row.createCell(col++).setCellValue(fmt(ha.getExpuestoRuidosFuertes()));
                row.createCell(col++).setCellValue(fmt(ha.getDificultadOidVozBaja()));
                row.createCell(col++).setCellValue(fmt(ha.getHablaMasFuerteOMasDespacio()));
                row.createCell(col++).setCellValue(fmt(ha.getUtilizaAyudaAuditiva()));
                row.createCell(col++).setCellValue(fmt(ha.getEspecficarAyudaAuditiva()));
                row.createCell(col++).setCellValue(fmt(ha.getPercibeSonidoIgualAmbosOidos()));
                row.createCell(col++).setCellValue(fmt(ha.getConQueOidoEscuchaMejor()));
                row.createCell(col++).setCellValue(fmt(ha.getHaceCuantoTiempoPresentaSintomasAuditivos()));
            } else {
                col += 59;
            }

            // VESTIBULAR
            Vestibular v = f.getVestibular();
            if (v != null) {
                row.createCell(col++).setCellValue(fmt(v.getFaltaEquilibrioCaminar()));
                row.createCell(col++).setCellValue(fmt(v.getMareos()));
                row.createCell(col++).setCellValue(fmt(v.getCuandoMareos()));
                row.createCell(col++).setCellValue(fmt(v.getVertigo()));
            } else {
                col += 4;
            }

            // OTOSCOPIA
            Otoscopia o = f.getOtoscopia();
            if (o != null) {
                row.createCell(col++).setCellValue(fmt(o.getPalpacionPabellonOidoDerecho()));
                row.createCell(col++).setCellValue(fmt(o.getPalpacionMastoidesOidoDerecho()));
                row.createCell(col++).setCellValue(fmt(o.getCaeOidoDerecho()));
                row.createCell(col++).setCellValue(fmt(o.getObstruccionOidoDerecho()));
                row.createCell(col++).setCellValue(fmt(o.getAparienciaMenbranaTimpanicaOidoDerecho()));
                row.createCell(col++).setCellValue(fmt(o.getPerforacionOidoDerecho()));
                row.createCell(col++).setCellValue(fmt(o.getBurbujaOidoDerecho()));
                row.createCell(col++).setCellValue(fmt(o.getColoracionOidoDerecho()));

                row.createCell(col++).setCellValue(fmt(o.getPalpacionPabellonOidoIzquierdo()));
                row.createCell(col++).setCellValue(fmt(o.getPalpacionMastoidesOidoIzquierdo()));
                row.createCell(col++).setCellValue(fmt(o.getCaeOidoIzquierdo()));
                row.createCell(col++).setCellValue(fmt(o.getObstruccionOidoIzquierdo()));
                row.createCell(col++).setCellValue(fmt(o.getAparienciaMenbranaTimpanicaOidoIzquierdo()));
                row.createCell(col++).setCellValue(fmt(o.getPerforacionOidoIzquierdo()));
                row.createCell(col++).setCellValue(fmt(o.getBurbujaOidoIzquierdo()));
                row.createCell(col++).setCellValue(fmt(o.getColoracionOidoIzquierdo()));
            } else {
                col += 16;
            }
        });
    }

    private String fmt(Object value) {
        if (value == null)
            return "N/A";
        if (value instanceof Boolean)
            return (Boolean) value ? "SÍ" : "NO";
        if (value instanceof java.util.Date)
            return dateFormat.format((java.util.Date) value);
        return value.toString();
    }
}
