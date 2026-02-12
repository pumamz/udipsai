import ComponentCard from "../../common/ComponentCard";
import Input from "../input/InputField";
import Label from "../Label";
import Select from "../Select";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { pasantesService } from "../../../services/pasantes";
import { especialistasService, sedesService } from "../../../services";
import Button from "../../ui/button/Button";
import { toast } from "react-toastify";
import DatePicker from "../date-picker";

import { PermisosTable, PermissionsState } from "../../common/PermisosTable";
import { especialidadesService } from "../../../services/especialidades";
import { Camera, User } from "lucide-react";
import { validarCedulaEcuatoriana, validarEmail, validarSoloNumeros } from "../../../services/validators";

export default function FormularioPasantes() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    cedula: "",
    nombresApellidos: "",
    email: "",
    ciudad: "",
    fechaNacimiento: new Date().toISOString(),
    inicioPasantia: new Date().toISOString(),
    finPasantia: new Date().toISOString(),
    domicilio: "",
    numeroTelefono: "",
    numeroCelular: "",
    sedeId: "",
    especialidadId: "",
    especialistaId: "",
    contrasenia: "",
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [sedes, setSedes] = useState<any[]>([]);
  const [especialistas, setEspecialistas] = useState<any[]>([]);
  const [especialidades, setEspecialidades] = useState<any[]>([]);

  useEffect(() => {
    if (isEditing) {
      const fetchPasante = async () => {
        try {
          setLoading(true);
          const data = await pasantesService.obtenerPorId(id);

          setFormData({
            cedula: data.cedula,
            nombresApellidos: data.nombresApellidos,
            email: data.email,
            ciudad: data.ciudad,
            fechaNacimiento: data.fechaNacimiento
              ? data.fechaNacimiento.split("T")[0]
              : "",
            inicioPasantia: data.inicioPasantia
              ? data.inicioPasantia.split("T")[0]
              : "",
            finPasantia: data.finPasantia ? data.finPasantia.split("T")[0] : "",
            domicilio: data.domicilio,
            numeroTelefono: data.numeroTelefono,
            numeroCelular: data.numeroCelular,
            sedeId: data.sede?.id || "",
            especialistaId: data.especialista?.id || "",
            especialidadId: data.especialidad?.id || "",
            contrasenia: data.contrasenia,
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
              especialistasEliminar:
                data.permisos.especialistasEliminar || false,

              especialidades: data.permisos.especialidades || false,
              especialidadesCrear: data.permisos.especialidadesCrear || false,
              especialidadesEditar: data.permisos.especialidadesEditar || false,
              especialidadesEliminar:
                data.permisos.especialidadesEliminar || false,

              asignaciones: data.permisos.asignaciones || false,
              asignacionesCrear: data.permisos.asignacionesCrear || false,
              asignacionesEditar: data.permisos.asignacionesEditar || false,
              asignacionesEliminar: data.permisos.asignacionesEliminar || false,

              recursos: data.permisos.recursos || false,
              recursosCrear: data.permisos.recursosCrear || false,
              recursosEditar: data.permisos.recursosEditar || false,
              recursosEliminar: data.permisos.recursosEliminar || false,

              institucionesEducativas:
                data.permisos.institucionesEducativas || false,
              institucionesEducativasCrear:
                data.permisos.institucionesEducativasCrear || false,
              institucionesEducativasEditar:
                data.permisos.institucionesEducativasEditar || false,
              institucionesEducativasEliminar:
                data.permisos.institucionesEducativasEliminar || false,

              historiaClinica: data.permisos.historiaClinica || false,
              historiaClinicaCrear: data.permisos.historiaClinicaCrear || false,
              historiaClinicaEditar:
                data.permisos.historiaClinicaEditar || false,
              historiaClinicaEliminar:
                data.permisos.historiaClinicaEliminar || false,

              fonoAudiologia: data.permisos.fonoAudiologia || false,
              fonoAudiologiaCrear: data.permisos.fonoAudiologiaCrear || false,
              fonoAudiologiaEditar: data.permisos.fonoAudiologiaEditar || false,
              fonoAudiologiaEliminar:
                data.permisos.fonoAudiologiaEliminar || false,

              psicologiaClinica: data.permisos.psicologiaClinica || false,
              psicologiaClinicaCrear:
                data.permisos.psicologiaClinicaCrear || false,
              psicologiaClinicaEditar:
                data.permisos.psicologiaClinicaEditar || false,
              psicologiaClinicaEliminar:
                data.permisos.psicologiaClinicaEliminar || false,

              psicologiaEducativa: data.permisos.psicologiaEducativa || false,
              psicologiaEducativaCrear:
                data.permisos.psicologiaEducativaCrear || false,
              psicologiaEducativaEditar:
                data.permisos.psicologiaEducativaEditar || false,
              psicologiaEducativaEliminar:
                data.permisos.psicologiaEducativaEliminar || false,

              citas: data.permisos.citas || false,
              citasCrear: data.permisos.citasCrear || false,
              citasEditar: data.permisos.citasEditar || false,
              citasEliminar: data.permisos.citasEliminar || false,
            });
          }

          if (data.fotoUrl) {
            try {
              const fotoUrl = await pasantesService.obtenerFoto(data.fotoUrl);
              setPreviewUrl(fotoUrl);
            } catch (error) {
              console.error("Error al obtener foto del pasante:", error);
            }
          }
        } catch (error) {
          console.error("Error al obtener pasante:", error);
          toast.error("Error al obtener pasante");
        } finally {
          setLoading(false);
        }
      };
      fetchPasante();
    }
    loadData();
  }, [id, isEditing]);

  const loadData = async () => {
    try {
      const [sedesRes, especialistasRes, especialidadesRes] = await Promise.all(
        [
          sedesService.listarActivos(0, 100),
          especialistasService.listarActivos(0, 100),
          especialidadesService.listarActivos(0, 100),
        ]
      );
      setSedes(sedesRes?.content || []);
      setEspecialistas(especialistasRes?.content || []);
      setEspecialidades(especialidadesRes?.content || []);
    } catch (error) {
      console.error("Error al cargar datos iniciales:", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;

    if (["numeroTelefono", "numeroCelular", "cedula"].includes(id)) {
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

  const handleDateChange = (name: string, dates: Date[]) => {
    setFormData((prev) => ({ ...prev, [name]: dates[0].toISOString() }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
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

    if (!formData.especialidadId.toString().trim()) {
      newErrors.especialidadId = "La especialidad es obligatoria";
    }

    if (!formData.sedeId.toString().trim()) {
      newErrors.sedeId = "La sede es obligatoria";
    }

    if (!formData.especialistaId.toString().trim()) {
      newErrors.especialistaId = "El especialista es obligatorio";
    }

    if (!isEditing && !formData.contrasenia.trim()) {
      newErrors.contrasenia = "La contraseña es obligatoria para nuevos pasantes";
    }

    if (formData.email && !validarEmail(formData.email)) {
      newErrors.email = "El correo electrónico no es válido";
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
        email: formData.email,
        ciudad: formData.ciudad,
        fechaNacimiento: formData.fechaNacimiento,
        inicioPasantia: formData.inicioPasantia,
        finPasantia: formData.finPasantia,
        domicilio: formData.domicilio,
        numeroTelefono: formData.numeroTelefono,
        numeroCelular: formData.numeroCelular,
        sedeId: Number(formData.sedeId),
        especialistaId: Number(formData.especialistaId),
        especialidadId: Number(formData.especialidadId),

        permisos: permisos,
        contrasenia: formData.contrasenia,
      };
      if (isEditing) {
        await pasantesService.actualizar(
          id,
          payload,
          selectedFile || undefined
        );
        toast.success("Pasante actualizado exitosamente");
      } else {
        await pasantesService.crear(payload, selectedFile || undefined);
        toast.success("Pasante creado exitosamente");
      }
      navigate("/pasantes");
    } catch (error) {
      toast.error("Error al guardar pasante");
    } finally {
      setLoading(false);
    }
  };

  const optionsSedes = sedes.map((s) => ({
    value: s.id,
    label: s.nombre,
  }));

  const optionsEspecialistas = especialistas.map((e) => ({
    value: e.id,
    label: e.nombresApellidos,
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
          Cargando datos del pasante...
        </p>
      </div>
    );
  }

  return (
    <div>
      <ComponentCard title="Datos personales del pasante">
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <div className="md:col-span-2 flex justify-center mb-6">
              <div className="flex flex-col items-center gap-4">
                <Label className="text-center w-full">Foto del Pasante</Label>
                <div className="relative group">
                  <div className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 overflow-hidden bg-white dark:bg-gray-900 flex items-center justify-center shadow-md transition-all group-hover:border-brand-300 dark:group-hover:border-brand-500">
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        alt="Vista previa"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-16 h-16 text-gray-300 dark:text-gray-700" />
                    )}
                    <label
                      htmlFor="foto"
                      className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-60 transition-opacity cursor-pointer"
                    >
                      <Camera className="text-white w-8 h-8" />
                    </label>
                  </div>
                  <input
                    id="foto"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              </div>
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
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="ejemplo@correo.com"
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                hint={errors.email}
              />
            </div>
            <div>
              <Label htmlFor="fechaNacimiento">Fecha de Nacimiento</Label>
              <DatePicker
                id="fechaNacimiento"
                placeholder="Seleccione la fecha de nacimiento"
                onChange={(dates) => handleDateChange("fechaNacimiento", dates)}
                defaultDate={formData.fechaNacimiento}
              />
            </div>
            <div>
              <Label htmlFor="ciudad">Ciudad</Label>
              <Input
                id="ciudad"
                type="text"
                placeholder="Ingrese la ciudad"
                value={formData.ciudad}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="domicilio">Domicilio</Label>
              <Input
                id="domicilio"
                type="text"
                placeholder="Ingrese el domicilio"
                value={formData.domicilio}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="numeroTelefono">Teléfono Fijo</Label>
              <Input
                id="numeroTelefono"
                type="text"
                placeholder="Ingrese el número fijo"
                value={formData.numeroTelefono}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="numeroCelular">Teléfono Celular</Label>
              <Input
                id="numeroCelular"
                type="text"
                placeholder="Ingrese el número de celular"
                value={formData.numeroCelular}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
      </ComponentCard>

      <br />

      <ComponentCard title="Información de la pasantía">
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <div>
              <Label htmlFor="inicioPasantia">Fecha de Inicio</Label>
              <DatePicker
                id="inicioPasantia"
                placeholder="Seleccione la fecha de inicio"
                onChange={(dates) => handleDateChange("inicioPasantia", dates)}
                defaultDate={formData.inicioPasantia}
              />
            </div>
            <div>
              <Label htmlFor="finPasantia">Fecha de Fin</Label>
              <DatePicker
                id="finPasantia"
                placeholder="Seleccione la fecha de fin"
                onChange={(dates) => handleDateChange("finPasantia", dates)}
                defaultDate={formData.finPasantia}
              />
            </div>
            <div>
              <Label htmlFor="sedeId">Sede asignada</Label>
              <Select
                options={optionsSedes}
                placeholder="Seleccione una sede"
                onChange={(value) => handleSelectChange("sedeId", value)}
                value={formData.sedeId || ""}
                error={!!errors.sedeId}
                hint={errors.sedeId}
              />
            </div>
            <div>
              <Label htmlFor="especialistaId">Tutor (Especialista)</Label>
              <Select
                options={optionsEspecialistas}
                placeholder="Seleccione un tutor"
                onChange={(value) =>
                  handleSelectChange("especialistaId", value)
                }
                value={formData.especialistaId || ""}
                error={!!errors.especialistaId}
                hint={errors.especialistaId}
              />
            </div>
            <div>
              <Label htmlFor="especialidadId">Área de Especialidad</Label>
              <Select
                options={optionsEspecialidad}
                placeholder="Seleccione el área"
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
                placeholder={
                  isEditing
                    ? "Deje en blanco para mantener la actual"
                    : "Ingrese la contraseña"
                }
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
        <Button variant="outline" onClick={() => navigate("/pasantes")}>
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="dark:bg-gray-600 dark:hover:bg-gray-700"
        >
          {loading ? "Guardando..." : "Guardar Pasante"}
        </Button>
      </div>
    </div>
  );
}
