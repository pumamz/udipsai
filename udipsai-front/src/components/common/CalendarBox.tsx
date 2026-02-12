import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { citasService } from '../../services/citas';
import { especialistasService } from '../../services/especialistas';
import { pasantesService } from '../../services/pasantes';
import CitaInfoModal from '../modals/CitaInfoModal';
import { toast } from 'react-toastify';

const CalendarBox = () => {
    const { userIdentity, userRole } = useAuth();
    const [events, setEvents] = useState<any[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const calendarRef = useRef<FullCalendar>(null);

    const isEspecialista = userRole === "ROLE_ESPECIALISTA";
    const isPasante = userRole === "ROLE_PASANTE";
    const isProfesional = isEspecialista || isPasante;

    useEffect(() => {
        const fetchCitas = async () => {
            try {
                let citasData: any[] = [];
                let profesionalId = null;

                if (isProfesional && userIdentity) {
                    try {
                        let data = null;
                        if (isEspecialista) {
                            data = await especialistasService.filtrar({ search: userIdentity });
                        } else if (isPasante) {
                            data = await pasantesService.filtrar({ search: userIdentity });
                        }

                        if (data) {
                            profesionalId = data.content[0].id;
                        }
                    } catch (e) {
                        console.warn("Error buscando profesional por cedula...", e);
                    }
                }

                if (profesionalId) {
                    const response = await citasService.obtenerPorProfesional(profesionalId);
                    citasData = response.content || [];
                } else if (!isProfesional) {
                    const response = await citasService.listar();
                    citasData = response.content || [];
                } else {
                    console.warn("Profesional no identificado o sin ID, no se pueden cargar citas personalizadas.");
                }

                const parseDate = (dateStr: string) => {
                    if (!dateStr) return '';
                    const parts = dateStr.split('-');
                    if (parts.length === 3) {
                        return `${parts[2]}-${parts[1]}-${parts[0]}`;
                    }
                    return dateStr;
                };

                const formattedEvents = citasData
                    .filter((cita: any) => cita.estado !== 'CANCELADA')
                    .map((cita: any) => {
                        let classNames = ['text-white', 'border-0'];

                        if (cita.estado === 'FINALIZADA' || cita.estado === 'ASISTIDO') {
                            classNames.push('!bg-green-400', '!border-green-400');
                        } else if (cita.estado === 'CANCELADA') {
                            classNames.push('!bg-red-400', '!border-red-400');
                        } else if (cita.estado === 'FALTA_JUSTIFICADA') {
                            classNames.push('!bg-orange-400', '!border-orange-400');
                        } else if (cita.estado === 'FALTA_INJUSTIFICADA' || cita.estado === 'NO_ASISTIDO') {
                            classNames.push('!bg-red-400', '!border-red-400');
                        } else {
                            classNames.push('!bg-blue-400', '!border-blue-400');
                        }

                        const fechaISO = parseDate(cita.fecha);

                        return {
                            id: cita.citaId || cita.id,
                            title: `${cita.horaInicio ? cita.horaInicio.substring(0, 5) : ''} - ${cita.paciente?.nombresApellidos || 'Paciente'} (${cita.especialista?.nombresApellidos || 'Asignado'})`,
                            start: `${fechaISO}T${cita.horaInicio}`,
                            end: `${fechaISO}T${cita.horaFin}`,
                            classNames: classNames,
                            textColor: '#ffffff',
                            extendedProps: {
                                originalId: cita.citaId || cita.id,
                                status: cita.estado,
                                specialty: cita.especialidad?.area || cita.especialidad?.nombre || "General",
                                specialist: cita.especialista?.nombresApellidos || "Sin Asignar",
                                paciente: cita.paciente,
                                fullDate: cita.fecha,
                                fullTimeCheck: `${cita.horaInicio} - ${cita.horaFin}`
                            }
                        };
                    });

                setEvents(formattedEvents);
            } catch (error) {
                console.error("Error loading calendar events:", error);
                toast.error("Error al cargar citas del calendario");
            }
        };

        fetchCitas();
    }, [userIdentity, isModalOpen, isEspecialista, isPasante]);

    const handleEventClick = (info: any) => {
        const eventData = {
            id: info.event.id,
            title: info.event.title,
            start: info.event.start,
            end: info.event.end,
            extendedProps: { ...info.event.extendedProps }
        };
        setSelectedEvent(eventData);
        setIsModalOpen(true);
    };

    const handleMarkAsAttended = async (id: string) => {
        try {
            await citasService.finalizar(id);
            toast.success("Cita finalizada");
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error marking as attended", error);
            toast.error("Error al finalizar cita");
        }
    };

    const handleMarkAsNotAttended = async (id: string) => {
        try {
            await citasService.marcarFalta(id);
            toast.success("Falta marcada");
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error marking as not attended", error);
            toast.error("Error al marcar falta");
        }
    };

    const handleMarkAsJustified = async (id: string) => {
        try {
            await citasService.marcarFaltaJustificada(id);
            toast.success("Falta justificada marcada");
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error marking as justified", error);
            toast.error("Error al marcar falta justificada");
        }
    };

    const renderEventContent = (eventInfo: any) => {
        return (
            <div className={`p-1 overflow-hidden ${eventInfo.event.classNames.join(' ')}`}>
                <div className="text-xs font-bold truncate">{eventInfo.timeText}</div>
                <div className="text-xs truncate">{eventInfo.event.title}</div>
            </div>
        );
    }

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 shadow-sm">
            <h3 className="mb-4 text-xl font-bold text-gray-800 dark:text-white/90">
                Calendario de Citas
            </h3>

            <style>{`
                .fc-timegrid-slot {
                    height: 3.5rem !important; /* Match Citas.tsx height */
                }
            `}</style>

            <div className="calendar-container [&_.fc-button]:bg-blue-600 [&_.fc-button]:border-blue-600 [&_.fc-button:hover]:bg-blue-700 [&_.fc-button-active]:bg-blue-800 [&_.fc-toolbar-title]:text-lg [&_.fc-toolbar-title]:font-bold [&_.fc-col-header-cell]:bg-gray-100 [&_.fc-col-header-cell]:py-3 [&_.fc-col-header-cell]:dark:bg-gray-800 [&_.fc-daygrid-day]:dark:bg-transparent [&_.fc-scrollgrid]:dark:border-gray-700 [&_.fc-theme-standard_td]:dark:border-gray-700 [&_.fc-theme-standard_th]:dark:border-gray-700 [&_.fc-event]:cursor-pointer [&_.fc-event]:shadow-sm [&_.fc-event]:border-0 [&_.fc-event-title]:font-semibold">
                <FullCalendar
                    ref={calendarRef}
                    plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    headerToolbar={{
                        left: 'prev,next today',
                        center: 'title',
                        right: 'dayGridMonth,timeGridWeek',
                    }}
                    height="auto"
                    events={events}
                    editable={false}
                    selectable={true}
                    dayMaxEvents={true}
                    eventClick={handleEventClick}
                    eventContent={renderEventContent}
                    buttonText={{
                        today: 'Hoy',
                        month: 'Mes',
                        week: 'Semana',
                        day: 'Día',
                        list: 'Lista'
                    }}
                    locale="es"
                    locales={[esLocale]}

                    slotDuration="01:00:00"
                    slotLabelInterval="01:00"
                    snapDuration="01:00:00"
                    slotMinTime="08:00:00"
                    slotMaxTime="17:00:00"
                    allDaySlot={false}
                    hiddenDays={[0, 6]}
                    businessHours={[
                        { daysOfWeek: [1, 2, 3, 4, 5], startTime: "08:00", endTime: "12:00" },
                        { daysOfWeek: [1, 2, 3, 4, 5], startTime: "13:00", endTime: "17:00" },
                    ]}
                    selectAllow={(selectInfo) => {
                        const now = new Date();
                        if (selectInfo.start < now && !selectInfo.allDay) return false;
                        if (selectInfo.allDay) return true;

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
                />
            </div>

            <CitaInfoModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedEvent(null);
                }}
                cita={selectedEvent}
                onMarkAsAttended={handleMarkAsAttended}
                onMarkAsNotAttended={handleMarkAsNotAttended}
                onMarkAsJustified={handleMarkAsJustified}
            />
        </div>
    );
};

export default CalendarBox;