import ComponentCard from "../../common/ComponentCard";
import Input from "../input/InputField";
import Label from "../Label";
import Select from "../Select";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { especialistasService } from "../../../services/especialistas";
import { sedesService } from "../../../services";
import Button from "../../ui/button/Button";
import { toast } from "react-toastify";

import { PermisosTable, PermissionsState } from "../../common/PermisosTable";
import { especialidadesService } from "../../../services/especialidades";
import { validarCedulaEcuatoriana, validarSoloNumeros } from "../../../services/validators";

export default function FormularioEspecialistas() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    cedula: "",
    nombresApellidos: "",
    fotoUrl: "",
    contrasenia: "",
    especialidadId: "",
    sedeId: "",
    activo: true,
  });

  const [permisos, setPermisos] = useState<PermissionsState>({
    pacientes: false,
    pasantes: false,
    sedes: false,
    especialistas: false,
    especialidades: false,
    asignaciones: false,
    recursos: false,
    institucionesEducativas: false,
    historiaClinica: false,
    fonoAudiologia: false,
    psicologiaClinica: false,
    psicologiaEducativa: false,
    citas: false,
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isEditing) {
      const fetchEspecialista = async () => {
        try {
          setLoading(true);
          const data = await especialistasService.obtenerPorId(id);

          setFormData({
            cedula: data.cedula,
            nombresApellidos: data.nombresApellidos,
            fotoUrl: data.fotoUrl,
            contrasenia: data.contrasenia,
            especialidadId: data.especialidad?.id || data.especialidadId || 0,
            sedeId: data.sede?.id || data.sedeId || 0,
            activo: data.activo,
          });
          if (data.permisos) {
            setPermisos({
              pacientes: data.permisos.pacientes || false,
              pacientesCrear: data.permisos.pacientesCrear || false,
              pacientesEditar: data.permisos.pacientesEditar || false,
              pacientesEliminar: data.permisos.pacientesEliminar || false,

              pasantes: data.permisos.pasantes || false,
              pasantesCrear: data.permisos.pasantesCrear || false,
              pasantesEditar: data.permisos.pasantesEditar || false,
              pasantesEliminar: data.permisos.pasantesEliminar || false,

              sedes: data.permisos.sedes || false,
              sedesCrear: data.permisos.sedesCrear || false,
              sedesEditar: data.permisos.sedesEditar || false,
              sedesEliminar: data.permisos.sedesEliminar || false,

              especialistas: data.permisos.especialistas || false,
              especialistasCrear: data.permisos.especialistasCrear || false,
              especialistasEditar: data.permisos.especialistasEditar || false,
              especialistasEliminar: data.permisos.especialistasEliminar || false,

              especialidades: data.permisos.especialidades || false,
              especialidadesCrear: data.permisos.especialidadesCrear || false,
              especialidadesEditar: data.permisos.especialidadesEditar || false,
              especialidadesEliminar: data.permisos.especialidadesEliminar || false,

              asignaciones: data.permisos.asignaciones || false,
              asignacionesCrear: data.permisos.asignacionesCrear || false,
              asignacionesEditar: data.permisos.asignacionesEditar || false,
              asignacionesEliminar: data.permisos.asignacionesEliminar || false,

              recursos: data.permisos.recursos || false,
              recursosCrear: data.permisos.recursosCrear || false,
              recursosEditar: data.permisos.recursosEditar || false,
              recursosEliminar: data.permisos.recursosEliminar || false,

              institucionesEducativas: data.permisos.institucionesEducativas || false,
              institucionesEducativasCrear: data.permisos.institucionesEducativasCrear || false,
              institucionesEducativasEditar: data.permisos.institucionesEducativasEditar || false,
              institucionesEducativasEliminar: data.permisos.institucionesEducativasEliminar || false,

              historiaClinica: data.permisos.historiaClinica || false,
              historiaClinicaCrear: data.permisos.historiaClinicaCrear || false,
              historiaClinicaEditar: data.permisos.historiaClinicaEditar || false,
              historiaClinicaEliminar: data.permisos.historiaClinicaEliminar || false,

              fonoAudiologia: data.permisos.fonoAudiologia || false,
              fonoAudiologiaCrear: data.permisos.fonoAudiologiaCrear || false,
              fonoAudiologiaEditar: data.permisos.fonoAudiologiaEditar || false,
              fonoAudiologiaEliminar: data.permisos.fonoAudiologiaEliminar || false,

              psicologiaClinica: data.permisos.psicologiaClinica || false,
              psicologiaClinicaCrear: data.permisos.psicologiaClinicaCrear || false,
              psicologiaClinicaEditar: data.permisos.psicologiaClinicaEditar || false,
              psicologiaClinicaEliminar: data.permisos.psicologiaClinicaEliminar || false,

              psicologiaEducativa: data.permisos.psicologiaEducativa || false,
              psicologiaEducativaCrear: data.permisos.psicologiaEducativaCrear || false,
              psicologiaEducativaEditar: data.permisos.psicologiaEducativaEditar || false,
              psicologiaEducativaEliminar: data.permisos.psicologiaEducativaEliminar || false,

              citas: data.permisos.citas || false,
              citasCrear: data.permisos.citasCrear || false,
              citasEditar: data.permisos.citasEditar || false,
              citasEliminar: data.permisos.citasEliminar || false,
            });
          }
        } catch (error) {
          console.error("Error al obtener especialista:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchEspecialista();
    }
    loadData();
  }, [id, isEditing]);

   const loadData = async () => {
      try {
        const [sedesRes, especialidadesRes] = await Promise.all([
          sedesService.listarActivos(0, 100),
          especialidadesService.listarActivos(0, 100),
        ]);
        setSedes(sedesRes?.content || []);
        setEspecialidades(especialidadesRes?.content || []);
      } catch (error) {
        console.error("Error al cargar datos iniciales:", error);
      }
    };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;

    if (["cedula"].includes(id)) {
      if (!validarSoloNumeros(value) || value.length > 10) {
        return;
      }
    }

    setFormData((prev) => ({ ...prev, [id]: value }));

    if (errors[id]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[id];
        return newErrors;
      });
    }
  };

  const handleSelectChange = (name: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const newErrors: Record<string, string> = {};
    if (!formData.nombresApellidos.trim()) {
      newErrors.nombresApellidos = "El nombre completo es obligatorio";
    }

    if (!formData.cedula.trim()) {
      newErrors.cedula = "La cédula es obligatoria";
    } else if (!validarCedulaEcuatoriana(formData.cedula)) {
      newErrors.cedula = "La cédula ingresada no es válida";
    }

    if (!formData.sedeId.toString().trim()) {
      newErrors.sedeId = "La sede es obligatoria";
    }

    if (!formData.especialidadId.toString().trim()) {
      newErrors.especialidadId = "La especialidad es obligatoria";
    }

    if (!isEditing && !formData.contrasenia.trim()) {
      newErrors.contrasenia = "La contraseña es obligatoria para nuevos especialistas";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Por favor, complete los campos obligatorios");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        cedula: formData.cedula,
        nombresApellidos: formData.nombresApellidos,
        contrasenia: formData.contrasenia,
        especialidadId: Number(formData.especialidadId),
        sedeId: Number(formData.sedeId),
        activo: formData.activo,
        permisos: permisos,
      };
      if (isEditing) {
        await especialistasService.actualizar(id, payload);
      } else {
        await especialistasService.crear(payload);
      }
      navigate("/especialistas");
    } catch (error) {
      toast.error("Error al guardar especialista");
    } finally {
      setLoading(false);
    }
  };

  const [sedes, setSedes] = useState<any[]>([]);
  const [especialidades, setEspecialidades] = useState<any[]>([]);

  const optionsSede = sedes.map((sede) => ({
    value: sede.id,
    label: sede.nombre,
  }));


  const optionsEspecialidad = especialidades.map((e) => ({
    value: e.id,
    label: e.area,
  }));

  if (loading && isEditing && !formData.cedula) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="w-12 h-12 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
        <p className="text-slate-500 font-medium animate-pulse text-lg">
          Cargando datos del especialista...
        </p>
      </div>
    );
  }

  return (
    <div>
      <ComponentCard title="Datos personales del especialista">
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <div>
              <Label htmlFor="cedula">Cédula</Label>
              <Input
                id="cedula"
                type="text"
                placeholder="Ingrese el número de cédula/ruc"
                value={formData.cedula}
                onChange={handleChange}
                error={!!errors.cedula}
                hint={errors.cedula}
              />
            </div>
            <div>
              <Label htmlFor="nombresApellidos">Nombres y Apellidos</Label>
              <Input
                id="nombresApellidos"
                type="text"
                placeholder="Ingrese el nombre completo"
                value={formData.nombresApellidos}
                onChange={handleChange}
                error={!!errors.nombresApellidos}
                hint={errors.nombresApellidos}
              />
            </div>
          </div>
        </div>
      </ComponentCard>
      <br />
      <ComponentCard title="Datos de la especialidad">
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <div>
              <Label htmlFor="sedeId">Sede</Label>
              <Select
                options={optionsSede}
                placeholder="Seleccione una sede"
                onChange={(value) => handleSelectChange("sedeId", value)}
                value={formData.sedeId || ""}
                error={!!errors.sedeId}
                hint={errors.sedeId}
              />
            </div>
            <div>
              <Label htmlFor="especialidad">Especialidad</Label>
              <Select
                options={optionsEspecialidad}
                placeholder="Seleccione una especialidad"
                onChange={(value) =>
                  handleSelectChange("especialidadId", value)
                }
                value={formData.especialidadId || ""}
                error={!!errors.especialidadId}
                hint={errors.especialidadId}
              />
            </div>
          </div>
        </div>
      </ComponentCard>
      <br />
      <PermisosTable
        permissions={permisos}
        onChange={(key, value) =>
          setPermisos((prev) => ({ ...prev, [key]: value }))
        }
      />
      <br />
      <ComponentCard title="Autenticación">
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <div>
              <Label htmlFor="contrasenia">Contraseña</Label>
              <Input
                id="contrasenia"
                type="password"
                placeholder="Ingrese la contraseña"
                value={formData.contrasenia}
                onChange={handleChange}
                error={!!errors.contrasenia}
                hint={errors.contrasenia}
              />
            </div>
          </div>
        </div>
      </ComponentCard>
      <div className="mt-6 flex justify-end gap-3">
        <Button variant="outline" onClick={() => navigate("/especialistas")}>
          Cancelar
        </Button>
        <Button onClick={handleSubmit} disabled={loading} className="dark:bg-gray-600 dark:hover:bg-gray-700">
          {loading ? "Guardando..." : "Guardar Especialista"}
        </Button>
      </div>
    </div>
  );
}
