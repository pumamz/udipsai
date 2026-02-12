import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";

import Label from "../form/Label";
import { toast } from "react-toastify";
import { citasService } from "../../services";
import { pasantesService } from "../../services/pasantes";
import PatientSearchModal from "./PatientSearchModal";
import ProfessionalSearchModal from "./ProfessionalSearchModal";
import DatePicker from "../form/date-picker";
import {
  Search,
  User,
  X,
  GraduationCap,
  Stethoscope,
  UserPlus,
} from "lucide-react";

interface CitaModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDate?: string;
  initialTime?: string;
  initialDuration?: number;
  onSave: () => void;
  fixedSpecialtyId?: number;
  appointmentId?: string | number;
  initialPatient?: any;
  initialSpecialist?: any; // Can be specialist or pasante
}

type ProfessionalType = "ESPEC" | "PASANTE";

const CitaModal: React.FC<CitaModalProps> = ({
  isOpen,
  onClose,
  initialDate = "",
  initialTime = "08:00",
  initialDuration = 1,
  onSave,
  fixedSpecialtyId,
  appointmentId,
  initialPatient,
  initialSpecialist,
}) => {
  const [date, setDate] = useState(initialDate);
  const [time, setTime] = useState(initialTime);
  const [duration, setDuration] = useState(initialDuration);

  const navigate = useNavigate();

  const [patient, setPatient] = useState<any>(null);

  const [profType, setProfType] = useState<ProfessionalType>("ESPEC");
  const [selectedProfessional, setSelectedProfessional] = useState<any>(null);
  const [selectedSpecialistForPasante, setSelectedSpecialistForPasante] =
    useState<any>(null);

  const [showPatientSearch, setShowPatientSearch] = useState(false);
  const [showProfessionalSearch, setShowProfessionalSearch] = useState(false);
  const [searchMode, setSearchMode] = useState<"TARGET" | "FILTER">("TARGET");

  const [loading, setLoading] = useState(false);
  const [occupiedSlots, setOccupiedSlots] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      setDate(initialDate);
      setTime(initialTime);
      setDuration(initialDuration || 1);
      setPatient(initialPatient || null);

      if (initialSpecialist) {
        setSelectedProfessional(initialSpecialist);

        if (initialSpecialist.semestre || initialSpecialist.carrera) {
          setProfType("PASANTE");
          if (initialSpecialist.especialista) {
            setSelectedSpecialistForPasante(initialSpecialist.especialista);
          }
        } else {
          setProfType("ESPEC");
          setSelectedSpecialistForPasante(null);
        }
      } else {
        setSelectedProfessional(null);
        setSelectedSpecialistForPasante(null);
        setProfType("ESPEC");
      }
    }
  }, [
    isOpen,
    initialDate,
    initialTime,
    initialDuration,
    initialPatient,
    initialSpecialist,
  ]);

  useEffect(() => {
    const verifyProfessionalType = async () => {
      if (isOpen && initialSpecialist && initialSpecialist.id) {
        if (!initialSpecialist.semestre && !initialSpecialist.carrera) {
          try {
            const fullPasante = await pasantesService.obtenerPorId(
              initialSpecialist.id,
            );
            if (
              fullPasante &&
              (fullPasante.semestre ||
                fullPasante.carrera ||
                fullPasante.especialista)
            ) {
              console.log("Detected Pasante from generic object!", fullPasante);
              setProfType("PASANTE");
              setSelectedProfessional(fullPasante);
              if (fullPasante.especialista) {
                setSelectedSpecialistForPasante(fullPasante.especialista);
              }
            }
          } catch (e) { }
        }
      }
    };
    verifyProfessionalType();
  }, [isOpen, initialSpecialist]);

  useEffect(() => {
    if (!selectedProfessional?.id || !date) {
      setOccupiedSlots([]);
      return;
    }

    const fetchAvailability = async () => {
      try {
        const tipoForCheck = profType === "ESPEC" ? "ESPECIALISTA" : "PASANTE";
        const response = await citasService.obtenerPorProfesional(
          selectedProfessional.id,
          0,
          100,
          tipoForCheck,
        );
        const citas = response.content || [];

        const occupied: string[] = [];

        citas.forEach((c: any) => {
          if (c.estado === "CANCELADA") return;
          if (appointmentId && String(c.id) === String(appointmentId)) return;

          const parts = c.fecha.split("-");
          let citaDateISO = c.fecha;
          if (parts[0].length === 2) {
            citaDateISO = `${parts[2]}-${parts[1]}-${parts[0]}`;
          }

          if (citaDateISO !== date) return;

          const [hStart] = c.horaInicio.split(":").map(Number);
          const [hEnd] = c.horaFin.split(":").map(Number);
          const dura = hEnd - hStart;

          for (let i = 0; i < dura; i++) {
            const hh = hStart + i;
            const slotStr = `${String(hh).padStart(2, "0")}:00`;
            if (!occupied.includes(slotStr)) occupied.push(slotStr);
          }
        });
        setOccupiedSlots(occupied);
      } catch (err) {
        console.error("Error fetching availability", err);
      }
    };

    fetchAvailability();
  }, [selectedProfessional, date, appointmentId]);

  const handleSubmit = async () => {
    if (!patient || !date || !time) {
      toast.error("Por favor complete todos los campos requeridos");
      return;
    }

    if (!selectedProfessional?.especialidad?.id && profType === "ESPEC") {
      toast.error("Debe seleccionar una especialidad (desde el calendario)");
      return;
    }

    const [hVal, mVal] = time.split(":").map(Number);
    const timeDecimal = hVal + mVal / 60;

    const isMorning = timeDecimal >= 8 && timeDecimal < 12;
    const isAfternoon = timeDecimal >= 13 && timeDecimal < 17;

    if (!isMorning && !isAfternoon) {
      toast.error(
        "La hora debe estar dentro del horario laboral: 08:00 - 12:00 o 13:00 - 17:00",
      );
      return;
    }

    const durationMinutes = Number(duration) * 60;

    if (selectedProfessional?.id) {
      setLoading(true);
      try {
        const tipoForCheck = profType === "ESPEC" ? "ESPECIALISTA" : "PASANTE";
        const citasDia = await citasService.obtenerPorProfesional(
          selectedProfessional.id,
          0,
          100,
          tipoForCheck,
        );
        const citas = citasDia.content || [];

        const [h, m] = time.split(":").map(Number);
        const newStart = h * 60 + m;
        const newEnd = newStart + durationMinutes;

        const fechaSeleccionada = date;

        const tieneConflicto = citas.some((c: any) => {
          if (c.fecha !== fechaSeleccionada || c.estado === "CANCELADA")
            return false;
          if (appointmentId && c.id === Number(appointmentId)) return false;

          const [ch, cm] = c.horaInicio.split(":").map(Number);
          const start = ch * 60 + cm;
          const [eh, em] = c.horaFin.split(":").map(Number);
          const end = eh * 60 + em;

          return newStart < end && newEnd > start;
        });

        if (tieneConflicto) {
          toast.error(
            `El profesional ${selectedProfessional.nombresApellidos} ya tiene una cita en ese horario.`,
          );
          setLoading(false);
          return;
        }
      } catch (valError) {
        console.error("Error validando disponibilidad", valError);
        toast.warn(
          "No se pudo verificar la disponibilidad del profesional. Intentando agendar de todas formas.",
        );
      }
    }

    setLoading(true);

    const [year, month, day] = date.split("-");
    const formattedDate = `${day}-${month}-${year}`;

    const citaDTO = {
      idPaciente: patient.id,
      idProfesional: selectedProfessional?.id,
      idEspecialidad: selectedProfessional.especialidad?.id,
      fecha: formattedDate,
      hora: time,
      duracionMinutes: durationMinutes,
      tipoProfesional: profType === "ESPEC" ? "ESPECIALISTA" : "PASANTE",
    };

    try {
      if (appointmentId) {
        await citasService.reagendar(appointmentId, citaDTO);
        toast.success("Cita reagendada exitosamente");
      } else {
        await citasService.registrarCita(citaDTO);
        toast.success("Cita agendada exitosamente");
      }
      onSave();
      onClose();
    } catch (error: any) {
      console.error("Error saving cita", error);
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "Error al guardar la cita";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleProfessionalSelect = (prof: any) => {
    setSelectedProfessional(prof);
  };

  const handleSpecialistFilterSelect = (prof: any) => {
    setSelectedSpecialistForPasante(prof);
    if (profType === "PASANTE") {
      setSelectedProfessional(null);
    }
  };

  const getMaxDuration = () => {
    if (!time) return 4;
    const [h] = time.split(":").map(Number);

    if (h >= 8 && h < 12) {
      return 12 - h;
    } else if (h >= 13 && h < 17) {
      return 17 - h;
    }
    return 4;
  };

  const maxDuration = getMaxDuration();

  useEffect(() => {
    if (duration > maxDuration) {
      setDuration(maxDuration);
    }
  }, [time, maxDuration, duration]);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} className="max-w-[850px] p-6">
        <div className="mb-6 flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            {appointmentId ? "Reagendar Cita" : "Agendar Nueva Cita"}
          </h3>
        </div>

        <div className="space-y-6">
          {/* Patient Selection */}
          <div>
            <Label className="block text-md font-bold">Paciente</Label>
            <div className="flex gap-2">
              <div className="flex-1 p-2.5 border rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700 flex items-center justify-between">
                {patient ? (
                  <span className="text-gray-900 dark:text-white font-medium">
                    {patient.nombresApellidos ||
                      patient.nombres + " " + patient.apellidos}
                    <span className="text-sm text-gray-500 ml-2">
                      ({patient.cedula})
                    </span>
                  </span>
                ) : (
                  <span className="text-gray-400">No seleccionado</span>
                )}
                {patient && !appointmentId && (
                  <Button
                    onClick={() => setPatient(null)}
                    variant="outline"
                    size="sm"
                  >
                    <X size={16} />
                  </Button>
                )}
              </div>
              {!appointmentId && (
                <Button
                  onClick={() => setShowPatientSearch(true)}
                  variant="outline"
                  className="whitespace-nowrap"
                >
                  <Search size={18} className="mr-2" />
                  Buscar
                </Button>
              )}
              {!appointmentId && (
                <Button
                  onClick={() => navigate("/pacientes/nuevo")}
                  variant="outline"
                  className="whitespace-nowrap"
                  title="Registrar Nuevo Paciente"
                >
                  <UserPlus size={18} className="mr-2" />
                  Registrar
                </Button>
              )}
            </div>
          </div>

          {/* Professional Type Selection */}
          <div>
            <Label>Tipo de Profesional</Label>
            <div className="flex gap-4 mt-2 mb-4">
              <label
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${profType === "ESPEC"
                  ? "bg-brand-50 border-brand-500 text-brand-700"
                  : "border-gray-200 "
                  } ${appointmentId ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-gray-50"}`}
              >
                <input
                  type="radio"
                  name="profType"
                  checked={profType === "ESPEC"}
                  onChange={() => {
                    if (!appointmentId) {
                      setProfType("ESPEC");
                      setSelectedProfessional(null);
                    }
                  }}
                  className="hidden"
                  disabled={!!appointmentId}
                />
                <Stethoscope size={20} />
                <span className="font-medium">Especialista</span>
              </label>

              <label
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${profType === "PASANTE"
                  ? "bg-purple-50 border-purple-500 text-purple-700"
                  : "border-gray-200 "
                  } ${appointmentId ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-gray-50"}`}
              >
                <input
                  type="radio"
                  name="profType"
                  checked={profType === "PASANTE"}
                  onChange={() => {
                    if (!appointmentId) {
                      setProfType("PASANTE");
                      setSelectedProfessional(null);
                    }
                  }}
                  className="hidden"
                  disabled={!!appointmentId}
                />
                <GraduationCap size={20} />
                <span className="font-medium">Pasante</span>
              </label>
            </div>

            {/* Specialist Filter for Pasantes */}
            {profType === "PASANTE" && (
              <div className="mb-4">
                <Label>Especialista (Supervisor)</Label>
                <div className="flex gap-2">
                  <div className="flex-1 p-2.5 border rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700 flex items-center justify-between">
                    {selectedSpecialistForPasante ? (
                      <div className="flex flex-col">
                        <span className="text-gray-900 dark:text-white font-medium">
                          {selectedSpecialistForPasante.nombresApellidos ||
                            selectedSpecialistForPasante.nombres +
                            " " +
                            selectedSpecialistForPasante.apellidos}
                        </span>
                        <span className="text-xs text-gray-500">
                          {selectedSpecialistForPasante.especialidad?.area ||
                            selectedSpecialistForPasante.especialidad?.nombre ||
                            "General"}
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-400">
                        Seleccione Especialista primero
                      </span>
                    )}
                    {selectedSpecialistForPasante && !appointmentId && (
                      <button
                        onClick={() => {
                          setSelectedSpecialistForPasante(null);
                          setSelectedProfessional(null);
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                  {!appointmentId && (
                    <Button
                      onClick={() => {
                        setSearchMode("FILTER");
                        setShowProfessionalSearch(true);
                      }}
                      variant="outline"
                      className="whitespace-nowrap"
                    >
                      <Search size={18} className="mr-2" />
                      Buscar
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* Professional Selection */}
            <Label>{profType === "ESPEC" ? "Especialista" : "Pasante"}</Label>
            <div className="flex gap-2">
              <div className="flex-1 p-2.5 border rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700 flex items-center justify-between">
                {selectedProfessional ? (
                  <div className="flex flex-col">
                    <span className="text-gray-900 dark:text-white font-medium">
                      {selectedProfessional.nombresApellidos ||
                        selectedProfessional.nombres +
                        " " +
                        selectedProfessional.apellidos}
                    </span>
                    <span className="text-xs text-gray-500">
                      {profType === "ESPEC"
                        ? selectedProfessional.especialidad?.area ||
                        selectedProfessional.especialidad?.nombre ||
                        "General"
                        : selectedProfessional.carrera || "Pasante"}
                    </span>
                  </div>
                ) : (
                  <span className="text-gray-400">
                    {profType === "PASANTE" && !selectedSpecialistForPasante
                      ? "Seleccione Especialista primero"
                      : "No seleccionado"}
                  </span>
                )}
                {selectedProfessional && (
                  <button
                    onClick={() => setSelectedProfessional(null)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
              <Button
                onClick={() => {
                  if (profType === "PASANTE" && !selectedSpecialistForPasante) {
                    toast.warn(
                      "Debe seleccionar un especialista primero para filtrar los pasantes.",
                    );
                    return;
                  }
                  setSearchMode("TARGET");
                  setShowProfessionalSearch(true);
                }}
                variant="outline"
                className="whitespace-nowrap"
                disabled={
                  profType === "PASANTE" && !selectedSpecialistForPasante
                }
              >
                <User size={18} className="mr-2" />
                Buscar
              </Button>
            </div>
            {fixedSpecialtyId &&
              profType === "ESPEC" &&
              !selectedProfessional && (
                <p className="text-xs text-gray-500 mt-1">
                  Filtrando por especialidad seleccionada
                </p>
              )}
          </div>

          {/* Time and Duration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="cita-datepicker-container">
              <Label>Fecha</Label>
              <DatePicker
                id="fecha-cita"
                placeholder="Seleccione fecha"
                defaultDate={date}
                disabled={!appointmentId}
                onChange={(_, dateStr) => setDate(dateStr)}
                options={{
                  disable: [
                    (date: Date) => {
                      // Return true to disable
                      // Disable weekends (0=Sun, 6=Sat)
                      if (date.getDay() === 0 || date.getDay() === 6) return true;

                      // Disable past dates
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      return date < today;
                    }
                  ],
                  locale: {
                    firstDayOfWeek: 1
                  }
                }}
              />
              {!appointmentId && (
                <p className="text-[10px] text-gray-500 mt-1 italic">
                  * La fecha se selecciona desde el calendario
                </p>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <Label>Hora (Inicio)</Label>
                <div className="grid grid-cols-4 gap-2 mt-1">
                  {["08:00", "09:00", "10:00", "11:00"].map((slot) => {
                    // Logic to determine if this slot is part of the selected range
                    const [h] = slot.split(":").map(Number);
                    const [selectedH] = time
                      ? time.split(":").map(Number)
                      : [null];

                    // Check if date is today and slot is in the past
                    let isPast = false;
                    if (date) {
                      const now = new Date();
                      const [y, m, d] = date.split('-').map(Number);
                      const selectedDate = new Date(y, m - 1, d);
                      const todayChecker = new Date();
                      todayChecker.setHours(0, 0, 0, 0);
                      if (selectedDate.getTime() === todayChecker.getTime()) {
                        if (h < now.getHours()) {
                          isPast = true;
                        } else if (h === now.getHours() && now.getMinutes() > 0) {
                          isPast = true;
                        }
                      }
                    }

                    let isSelected = false;
                    if (selectedH !== null) {
                      // Highlight if it falls within [start, start + duration)
                      // Example: Start 8:00, Duration 2h -> 8, 9 are selected.
                      const endH = selectedH + duration;
                      if (h >= selectedH && h < endH) {
                        isSelected = true;
                      }
                    }

                    return (
                      <button
                        key={slot}
                        onClick={() =>
                          !occupiedSlots.includes(slot) && !isPast && setTime(slot)
                        }
                        disabled={occupiedSlots.includes(slot) || isPast}
                        title={
                          occupiedSlots.includes(slot) ? "Hora ocupada" : (isPast ? "Hora pasada" : "")
                        }
                        className={`px-2 py-2 text-sm font-medium rounded-md border transition-all
                                                ${isSelected
                            ? "bg-red-600 text-white border-red-600"
                            : (occupiedSlots.includes(slot) || isPast)
                              ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed decoration-slice line-through"
                              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600"
                          }`}

                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {["13:00", "14:00", "15:00", "16:00"].map((slot) => {
                    const [h] = slot.split(":").map(Number);
                    const [selectedH] = time
                      ? time.split(":").map(Number)
                      : [null];

                    // Check if date is today and slot is in the past
                    let isPast = false;
                    if (date) {
                      const now = new Date();
                      const [y, m, d] = date.split('-').map(Number);
                      const selectedDate = new Date(y, m - 1, d);
                      const todayChecker = new Date();
                      todayChecker.setHours(0, 0, 0, 0);
                      if (selectedDate.getTime() === todayChecker.getTime()) {
                        if (h < now.getHours()) {
                          isPast = true;
                        } else if (h === now.getHours() && now.getMinutes() > 0) {
                          isPast = true;
                        }
                      }
                    }

                    let isSelected = false;
                    if (selectedH !== null) {
                      const endH = selectedH + duration;
                      if (h >= selectedH && h < endH) {
                        isSelected = true;
                      }
                    }

                    return (
                      <button
                        key={slot}
                        onClick={() =>
                          !occupiedSlots.includes(slot) && !isPast && setTime(slot)
                        }
                        disabled={occupiedSlots.includes(slot) || isPast}
                        title={
                          occupiedSlots.includes(slot) ? "Hora ocupada" : (isPast ? "Hora pasada" : "")
                        }
                        className={`px-2 py-2 text-sm font-medium rounded-md border transition-all
                                                ${isSelected
                            ? "bg-red-600 text-white border-red-600"
                            : (occupiedSlots.includes(slot) || isPast)
                              ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed decoration-slice line-through"
                              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600"
                          }`}

                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <Label>Duración (máx. {maxDuration}h)</Label>
                <div className="flex gap-2 mt-1">
                  {[1, 2, 3, 4].map((h) => (
                    <button
                      key={h}
                      onClick={() => setDuration(h)}
                      disabled={h > maxDuration}
                      className={`flex-1 py-2 text-sm font-medium rounded-md border transition-all
                                                ${duration === h
                          ? "bg-red-600 text-white border-red-600"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600"
                        } ${h > maxDuration ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      {h}h
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Guardando..." : "Guardar Cita"}
          </Button>
        </div>
      </Modal>

      {/* Nested Modals */}
      <PatientSearchModal
        isOpen={showPatientSearch}
        onClose={() => setShowPatientSearch(false)}
        onSelect={setPatient}
      />

      <ProfessionalSearchModal
        isOpen={showProfessionalSearch}
        onClose={() => setShowProfessionalSearch(false)}
        onSelect={
          searchMode === "FILTER"
            ? handleSpecialistFilterSelect
            : handleProfessionalSelect
        }
        type={searchMode === "FILTER" ? "ESPEC" : profType}
        filterId={
          searchMode === "TARGET"
            ? profType === "PASANTE"
              ? selectedSpecialistForPasante?.id
              : fixedSpecialtyId
            : undefined
        }
      />
    </>
  );
};

export default CitaModal;
