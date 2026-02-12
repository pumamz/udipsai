import { useState, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventInput, DateSelectArg, EventClickArg } from "@fullcalendar/core";
import esLocale from '@fullcalendar/core/locales/es';
import { useModal } from "../../hooks/useModal";
import PageMeta from "../../components/common/PageMeta";
import CitaModal from "../../components/modals/CitaModal";
import CitaInfoModal from "../../components/modals/CitaInfoModal";
import { especialidadesService, citasService } from "../../services";
import { toast } from "react-toastify";

interface CalendarEvent extends EventInput {
  extendedProps: {
    calendar: string;
  };
}

const Calendar: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [currentView, setCurrentView] = useState("dayGridMonth");
  const [modalInitialDate, setModalInitialDate] = useState("");
  const [modalInitialTime, setModalInitialTime] = useState("");
  const [modalInitialDuration, setModalInitialDuration] = useState(1);

  const [specialties, setSpecialties] = useState<any[]>([]);
  const [selectedSpecialtyId, setSelectedSpecialtyId] = useState<number | string>("");
  const [loading, setLoading] = useState(false);

  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [showInfoModal, setShowInfoModal] = useState(false);

  const [reschedulingId, setReschedulingId] = useState<string | number | undefined>(undefined);
  const [initialPatient, setInitialPatient] = useState<any>(null);
  const [initialSpecialist, setInitialSpecialist] = useState<any>(null);

  const calendarRef = useRef<FullCalendar>(null);
  const { isOpen, openModal, closeModal } = useModal();

  useEffect(() => {
    loadSpecialties();
    loadEvents();
  }, []);

  useEffect(() => {
    loadEvents();
  }, [selectedSpecialtyId]);

  useEffect(() => {
    if (!selectedSpecialtyId) return;

    const intervalId = setInterval(() => {
      loadEvents();
    }, 4 * 60 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, [selectedSpecialtyId]);

  const loadSpecialties = async () => {
    try {
      const data = await especialidadesService.listarActivos();
      setSpecialties(Array.isArray(data) ? data : data.content || []);
    } catch (error) {
      console.error("Error loading specialties", error);
    }
  };

  const loadEvents = async () => {
    setLoading(true);
    try {
      let data;

      if (selectedSpecialtyId) {
        const response = await citasService.obtenerPorEspecialidad(Number(selectedSpecialtyId), 0, 500);
        console.log("Raw response (Specialty):", response);
        data = response.content || [];
      } else {
        setEvents([]);
        setLoading(false);
        return;
      }

      console.log("Data to map:", data);

      if (data && data.length > 0) {
        console.log("SAMPLE ITEM STATUS:", data[0].estado);
        data.forEach((d: any) => console.log(`Cita ${d.citaId} status: ${d.estado}`));
      }

      const mappedEvents: CalendarEvent[] = data
        .filter((cita: any) => cita.estado !== 'CANCELADA')
        .map((cita: any) => {
          if (!cita.fecha) {
            console.warn("Cita missing fecha:", cita);
            return null;
          }
          const [day, month, year] = cita.fecha.split('-').map(Number);
          const dateStr = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

          return {
            id: cita.id?.toString(),
            title: cita.paciente?.nombresApellidos || "Sin Nombre",
            start: `${dateStr}T${cita.horaInicio}:00`,
            end: `${dateStr}T${cita.horaFin}:00`,
            extendedProps: {
              calendar: getStatusColor(cita.estado),
              specialty: cita.especialidad?.area || cita.especialidad?.nombre || "General",
              specialist: cita.especialista?.nombresApellidos || "Sin Asignar",
              status: cita.estado
            }
          };
        })
        .filter((e: any) => e !== null) as CalendarEvent[]; // Filter out failed parses
      setEvents(mappedEvents);
    } catch (error) {
      console.error("Error loading events", error);
      toast.error("Error al cargar citas");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDIENTE': return 'Warning';
      case 'FINALIZADA': return 'Success';
      case 'FALTA_INJUSTIFICADA': return 'Danger';
      case 'FALTA_JUSTIFICADA': return 'Info';
      case 'CANCELADA': return 'Danger';
      default: return 'Primary';
    }
  };

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    if (selectInfo.view.type === 'dayGridMonth') {
      const calendarApi = selectInfo.view.calendar;
      calendarApi.changeView('timeGridWeek', selectInfo.startStr);
      return;
    }

    setModalInitialDate(selectInfo.startStr.split("T")[0]);
    const timePart = selectInfo.startStr.includes("T") ? selectInfo.startStr.split("T")[1].substring(0, 5) : "08:00";
    setModalInitialTime(timePart);

    const durationMs = selectInfo.end.getTime() - selectInfo.start.getTime();
    const durationHours = Math.round(durationMs / 3600000);
    setModalInitialDuration(durationHours > 0 ? durationHours : 1);

    setReschedulingId(undefined);
    setInitialPatient(null);
    setInitialSpecialist(null);

    openModal();
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    const plainEvent = {
      id: clickInfo.event.id,
      title: clickInfo.event.title,
      start: clickInfo.event.start,
      end: clickInfo.event.end,
      extendedProps: { ...clickInfo.event.extendedProps }
    };
    setSelectedEvent(plainEvent);
    setShowInfoModal(true);
  };

  const handleSaveCita = () => {
    closeModal();
    loadEvents();
  };

  const handleDeleteCita = async (id: string) => {
    try {
      await citasService.eliminar(id);
      toast.success("Cita cancelada exitosamente");
      loadEvents();
    } catch (error) {
      console.error("Error deleting cita", error);
      toast.error("No se pudo cancelar la cita");
      throw error;
    }
  };

  const handleRescheduleCita = async (id: string) => {
    try {
      setLoading(true);
      const cita = await citasService.obtenerPorId(id);

      setShowInfoModal(false);
      setReschedulingId(id);

      const [day, month, year] = cita.fecha.split('-').map(Number);
      const dateStr = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

      setModalInitialDate(dateStr);
      setModalInitialTime(cita.horaInicio.substring(0, 5));

      const startH = parseInt(cita.horaInicio.split(':')[0]);
      const endH = parseInt(cita.horaFin.split(':')[0]);
      const duration = endH - startH;
      setModalInitialDuration(duration > 0 ? duration : 1);

      setInitialPatient(cita.paciente);
      setInitialSpecialist(cita.especialista);

      openModal();
    } catch (error) {
      console.error("Error fetching cita for reschedule", error);
      toast.error("Error al cargar datos para reagendar");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsAttended = async (id: string) => {
    try {
      await citasService.finalizar(id);
      toast.success("Cita finalizada exitosamente");
      setShowInfoModal(false);
      loadEvents();
    } catch (error) {
      console.error("Error finalizing cita", error);
      toast.error("No se pudo finalizar la cita");
    }
  };

  const handleMarkAsNotAttended = async (id: string) => {
    try {
      await citasService.marcarFalta(id);
      toast.success("Falta marcada exitosamente");
      setShowInfoModal(false);
      loadEvents();
    } catch (error) {
      console.error("Error marking cita as not attended", error);
      toast.error("No se pudo marcar la falta");
    }
  };

  const handleMarkAsJustified = async (id: string) => {
    try {
      await citasService.marcarFaltaJustificada(id);
      toast.success("Falta justificada marcada exitosamente");
      setShowInfoModal(false);
      loadEvents();
    } catch (error) {
      console.error("Error marking cita as justified", error);
      toast.error("No se pudo marcar la falta justificada");
    }
  };

  return (
    <>
      <PageMeta
        title="Gestión de Citas | UDIPSAI"
        description="Calendario de citas para especialistas y pacientes"
      />
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] min-w-0">
        <div className="w-fit min-w-full rounded-xl border border-gray-200 bg-white p-4">

          <div className="mb-4 flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Filtrar por Especialidad:
            </label>
            <div className="relative">
              <select
                value={selectedSpecialtyId}
                onChange={(e) => setSelectedSpecialtyId(e.target.value)}
                className="appearance-none rounded-xl border border-gray-300 bg-white px-4 py-3 pr-10 text-base font-medium text-gray-700 shadow-sm transition hover:border-gray-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
              >
                <option value="">Todas las Especialidades</option>
                {specialties.map((spec) => (
                  <option key={spec.id} value={spec.id}>
                    {spec.area || spec.nombre}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            {loading && <span className="text-sm text-gray-500">Cargando...</span>}
          </div>

        </div>

        <style>{`
          .fc-timegrid-slot {
            height: 3.5rem !important; /* Aumentar altura de celdas (aprox 56px) */
          }
        `}</style>

        <div className={`transition-all duration-300`}>
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            locale={esLocale}
            headerToolbar={{
              left: currentView === 'timeGridWeek' ? "prev,next" : "prev,next addEventButton",
              center: "title",
              right: "dayGridMonth,timeGridWeek",
            }}
            datesSet={(arg) => setCurrentView(arg.view.type)}
            events={events}
            selectable
            select={handleDateSelect}
            selectAllow={(selectInfo) => {
              if (!selectedSpecialtyId) {
                toast.dismiss();
                toast.info("Seleccione una especialidad primero para agendar");
                return false;
              }

              if (selectInfo.allDay) return true;

              const now = new Date();
              if (selectInfo.start < now) return false;
              const startDay = selectInfo.start.getDate();
              const endDay = selectInfo.end.getDate();
              if (startDay !== endDay && !selectInfo.allDay) return false;

              const startHour = selectInfo.start.getHours();
              const startMin = selectInfo.start.getMinutes();
              const endHour = selectInfo.end.getHours();
              const endMin = selectInfo.end.getMinutes();

              const startDec = startHour + startMin / 60;
              const endDec = endHour + endMin / 60;

              const isMorning = startDec >= 8 && endDec <= 12;
              const isAfternoon = startDec >= 13 && endDec <= 17;

              if (!isMorning && !isAfternoon) return false;

              return true;
            }}
            eventClick={handleEventClick}
            eventContent={renderEventContent}
            slotDuration="01:00:00"
            slotLabelInterval="01:00"
            snapDuration="01:00:00"
            slotMinTime="08:00:00"
            slotMaxTime="17:00:00"
            allDaySlot={false}
            contentHeight="auto"
            height="auto"
            hiddenDays={[0, 6]}
            businessHours={[
              { daysOfWeek: [1, 2, 3, 4, 5], startTime: "08:00", endTime: "12:00" },
              { daysOfWeek: [1, 2, 3, 4, 5], startTime: "13:00", endTime: "17:00" },
            ]}
            customButtons={{
              addEventButton: {
                text: "Agendar Cita +",
                click: () => {


                  const calendarApi = calendarRef.current?.getApi();
                  calendarApi?.changeView("timeGridWeek");
                },
              },
            }}
          />
        </div>
      </div>
      <CitaModal
        isOpen={isOpen}
        onClose={closeModal}
        initialDate={modalInitialDate}
        initialTime={modalInitialTime}
        initialDuration={modalInitialDuration}
        onSave={handleSaveCita}
        fixedSpecialtyId={selectedSpecialtyId ? Number(selectedSpecialtyId) : undefined}
        appointmentId={reschedulingId}
        initialPatient={initialPatient}
        initialSpecialist={initialSpecialist}
      />

      <CitaInfoModal
        isOpen={showInfoModal}
        onClose={() => setShowInfoModal(false)}
        cita={selectedEvent}
        onDelete={handleDeleteCita}
        onReschedule={handleRescheduleCita}
        onMarkAsAttended={handleMarkAsAttended}
        onMarkAsNotAttended={handleMarkAsNotAttended}
        onMarkAsJustified={handleMarkAsJustified}
      />
    </>
  );
};

const renderEventContent = (eventInfo: any) => {
  const status = eventInfo.event.extendedProps.status;

  const statusStyles: Record<string, string> = {
    'PENDIENTE': 'bg-amber-100 border-l-4 border-amber-500 text-amber-900',
    'FINALIZADA': 'bg-emerald-100 border-l-4 border-emerald-500 text-emerald-900',
    'FALTA_INJUSTIFICADA': 'bg-red-100 border-l-4 border-red-500 text-red-900',
    'FALTA_JUSTIFICADA': 'bg-violet-100 border-l-4 border-violet-500 text-violet-900',
    'CANCELADA': 'bg-gray-100 border-l-4 border-gray-500 text-gray-900',
  };

  const currentStyle = statusStyles[status] || 'bg-blue-100 border-l-4 border-blue-500 text-blue-900';

  return (
    <div
      className={`w-full h-full flex flex-col justify-start px-2 py-1 rounded-r-md text-xs leading-tight overflow-hidden ${currentStyle}`}
    >
      {/* Hora */}
      <div className="flex items-center gap-1 mb-0.5">
        <div className="w-1.5 h-1.5 rounded-full bg-current opacity-50"></div>
        <span className="font-bold opacity-90">{eventInfo.timeText}</span>
      </div>

      {/* Paciente */}
      <div className="font-semibold truncate text-[11px] md:text-xs">
        {eventInfo.event.title}
      </div>

      {/* Estado */}
      <div className="text-[9px] uppercase tracking-wider opacity-75 mt-auto truncate font-medium">
        {status?.replace('_', ' ')}
      </div>
    </div>
  );
};

export default Calendar;
