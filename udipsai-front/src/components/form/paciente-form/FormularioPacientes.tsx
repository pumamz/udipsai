import ComponentCard from "../../common/ComponentCard";
import DatePicker from "../../form/date-picker";
import Input from "../../form/input/InputField";
import TextArea from "../../form/input/TextArea";
import Label from "../../form/Label";
import Select from "../../form/Select";
import Switch from "../../form/switch/Switch";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { pacientesService } from "../../../services/pacientes";
import Button from "../../ui/button/Button";
import { institucionesService, sedesService } from "../../../services";
import { toast } from "react-toastify";
import { useModal } from "../../../hooks/useModal";
import { InstitucionModal } from "../../modals/InstitucionModal";
import { Plus, Camera, Upload, CheckCircle2, User, FileText, Trash, Download } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { validarCedulaEcuatoriana, validarSoloNumeros } from "../../../services/validators";

export default function FormularioPacientes() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  const { permissions } = useAuth();

  const [formData, setFormData] = useState({
    cedula: "",
    nombresApellidos: "",
    fechaNacimiento: new Date().toISOString().split("T")[0],
    fotoUrl: "",
    ciudad: "",
    domicilio: "",
    numeroTelefono: "",
    numeroCelular: "",
    institucionEducativaId: 0,
    sedeId: 0,
    jornada: "",
    nivelEducativo: "",
    anioEducacion: "",
    perteneceInclusion: false,
    tieneDiscapacidad: false,
    perteneceAProyecto: false,
    proyecto: "",
    portadorCarnet: false,
    diagnostico: "",
    motivoConsulta: "",
    observaciones: "",
    tipoDiscapacidad: "",
    detalleDiscapacidad: "",
    porcentajeDiscapacidad: 0,
    activo: true,
  });

  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fichaCompromisoFile, setFichaCompromisoFile] = useState<File | null>(
    null,
  );
  const [fichaDeteccionFile, setFichaDeteccionFile] = useState<File | null>(
    null,
  );
  const [otrosDocumentos, setOtrosDocumentos] = useState<File[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [existingFichas, setExistingFichas] = useState<{
    compromiso: any | null;
    deteccion: any | null;
  }>({
    compromiso: null,
    deteccion: null,
  });
  const [existingDocumentos, setExistingDocumentos] = useState<any[]>([]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const {
    isOpen: isInstitucionModalOpen,
    openModal: openInstitucionModal,
    closeModal: closeInstitucionModal,
  } = useModal();

  useEffect(() => {
    if (isEditing) {
      const fetchPaciente = async () => {
        try {
          setLoading(true);
          const data = await pacientesService.obtenerPorId(id);

          setFormData({
            ...data,
            institucionEducativaId: data.institucionEducativa?.id || 0,
            sedeId: data.sede?.id || 0,
          });

          if (data.documentos) {
            const compromiso = data.documentos.find(
              (d: any) => d.nombre === "Ficha Compromiso",
            );
            const deteccion = data.documentos.find(
              (d: any) => d.nombre === "Ficha Detección",
            );
            setExistingFichas({ compromiso, deteccion });
            
            const otros = data.documentos.filter(
              (d: any) => d.nombre !== "Ficha Compromiso" && d.nombre !== "Ficha Detección"
            );
            setExistingDocumentos(otros);
          }

          if (data.fotoUrl) {
            const fotoUrl = await pacientesService.obtenerFoto(data.fotoUrl);
            setPreviewUrl(fotoUrl);
          }
        } catch (error) {
          console.error("Error fetching patient:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchPaciente();
    }
    getInstituciones();
    getSedes();
  }, [id, isEditing]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
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

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
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

  const handleOtrosDocumentosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setOtrosDocumentos((prev) => [...prev, ...newFiles]);
    }
  };

  const removeOtroDocumento = (index: number) => {
    setOtrosDocumentos((prev) => prev.filter((_, i) => i !== index));
  };

  const downloadExistingDocument = async (docId: number, nombre: string) => {
    try {
      const blob = await pacientesService.descargarDocumento(docId);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", nombre);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (error) {
      toast.error("Error al descargar el documento");
    }
  };

  const deleteExistingDocument = async (docId: number) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este documento?")) {
      try {
        await pacientesService.eliminarDocumento(docId);
        toast.success("Documento eliminado");
        setExistingDocumentos((prev) => prev.filter((d) => d.id !== docId));
      } catch (error) {
        toast.error("Error al eliminar el documento");
      }
    }
  };

  const handleSubmit = async () => {
    const newErrors: Record<string, string> = {};
    if (!formData.nombresApellidos.trim()) {
      newErrors.nombresApellidos = "El nombre completo es obligatorio";
    }

    if (!isEditing && !formData.cedula.trim()) {
      newErrors.cedula = "La cédula es obligatoria";
    } else if (!isEditing && !validarCedulaEcuatoriana(formData.cedula)) {
      newErrors.cedula = "La cédula ingresada no es válida";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Por favor, complete los campos obligatorios");
      return;
    }

    try {
      setLoading(true);
      const { fotoUrl, ...rest } = formData;
      const payload = {
        ...rest,
        documentos: undefined,
        fechaNacimiento: rest.fechaNacimiento.split("T")[0],
        institucionEducativaId: Number(rest.institucionEducativaId),
        sedeId: Number(rest.sedeId),
      };
      if (isEditing) {
        await pacientesService.actualizar(
          id,
          payload,
          selectedFile || undefined,
          fichaCompromisoFile || undefined,
          fichaDeteccionFile || undefined,
          otrosDocumentos.length > 0 ? otrosDocumentos : undefined,
        );
        toast.success("Paciente actualizado exitosamente");
      } else {
        await pacientesService.crear(
          payload,
          selectedFile || undefined,
          fichaCompromisoFile || undefined,
          fichaDeteccionFile || undefined,
          otrosDocumentos.length > 0 ? otrosDocumentos : undefined,
        );
        toast.success("Paciente creado exitosamente");
      }
      navigate("/pacientes");
    } catch (error) {
      toast.error("Error al guardar el paciente");
      console.error("Error saving patient:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveInstitucion = async (institucion: any) => {
    try {
      const response = await institucionesService.crear(institucion);
      toast.success("Institución creada correctamente");
      await getInstituciones();
      if (response && response.id) {
        setFormData((prev) => ({
          ...prev,
          institucionEducativaId: response.id,
        }));
      }
      closeInstitucionModal();
    } catch (error) {
      toast.error("Error al guardar la institución");
      console.error("Error saving institucion:", error);
    }
  };

  const optionsDiscapacidad = [
    { value: "intelectual", label: "Intelectual" },
    { value: "fisica", label: "Física" },
    { value: "auditiva", label: "Auditiva" },
    { value: "visual", label: "Visual" },
    { value: "psicosocial", label: "Psicosocial" },
    { value: "lenguaje", label: "Lenguaje" },
    { value: "multiple", label: "Múltiple" },
    { value: "otros", label: "Otros" },
  ];

  const getSedes = async () => {
    try {
      const data = await sedesService.listarActivos(0, 100);
      const sedesData = data?.content || [];
      setSedes(sedesData);
    } catch (error) {
      console.error("Error fetching sedes:", error);
    }
  };

  const [sedes, setSedes] = useState([{ id: "0", nombre: "" }]);

  const optionsSede = sedes.map((sede) => ({
    value: String(sede.id),
    label: sede.nombre,
  }));

  const getInstituciones = async () => {
    try {
      const data = await institucionesService.listarActivos(0, 100);
      const institucionesData = data?.content || [];
      setInstituciones(institucionesData);
    } catch (error) {
      console.error("Error fetching institutions:", error);
    }
  };

  const [instituciones, setInstituciones] = useState([
    {
      id: "0",
      nombre: "",
    },
  ]);

  const optionsInstituciones = instituciones.map((institucion) => ({
    value: String(institucion.id),
    label: institucion.nombre,
  }));

  const optionsJornada = [
    { value: "1", label: "Matutina" },
    { value: "2", label: "Vespertina" },
  ];
  const optionsNivelEducativo = [
    { value: "inicial", label: "Inicial" },
    { value: "preparatoria", label: "Preparatoria" },
    { value: "basica-elemental", label: "Básica Elemental" },
    { value: "basica-media", label: "Básica Media" },
    { value: "basica-superior", label: "Básica Superior" },
    { value: "bachillerato", label: "Bachillerato" },
    { value: "no-escolarizado", label: "No Escolarizado" },
  ];
  const optionsAñoEducativo = (nivelEducativo: string) => {
    switch (nivelEducativo) {
      case "inicial":
        return [
          { value: "inicial 1", label: "Inicial 1" },
          { value: "inicial 2", label: "Inicial 2" },
        ];
      case "preparatoria":
        return [{ value: "primero", label: "Primero" }];
      case "basica-elemental":
        return [
          { value: "segundo", label: "Segundo" },
          { value: "tercero", label: "Tercero" },
          { value: "cuarto", label: "Cuarto" },
        ];
      case "basica-media":
        return [
          { value: "quinto", label: "Quinto" },
          { value: "sexto", label: "Sexto" },
          { value: "séptimo", label: "Séptimo" },
        ];
      case "basica-superior":
        return [
          { value: "octavo", label: "Octavo" },
          { value: "noveno", label: "Noveno" },
          { value: "decimo", label: "Décimo" },
        ];
      case "bachillerato":
        return [
          {
            value: "primero de bachillerato",
            label: "Primero de bachillerato",
          },
          {
            value: "segundo de bachillerato",
            label: "Segundo de bachillerato",
          },
          {
            value: "tercero de bachillerato",
            label: "Tercero de bachillerato",
          },
        ];
      default:
        return [];
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="w-12 h-12 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
        <p className="text-slate-500 font-medium animate-pulse text-lg">
          Cargando datos del paciente...
        </p>
      </div>
    );
  }

  return (
    <div>
      <ComponentCard title="Datos personales del paciente">
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <div className="md:col-span-2 flex flex-col md:flex-row justify-center gap-8 items-center bg-gray-50/50 dark:bg-white/[0.03] p-6 rounded-3xl border border-gray-100 dark:border-white/[0.05]">
              {/* Foto del Paciente */}
              <div className="flex flex-col items-center gap-4">
                <Label className="text-center w-full">Foto del Paciente</Label>
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
                      className="absolute inset-0 bg-black/40 flex rounded-full items-center justify-center opacity-0 group-hover:opacity-60 transition-opacity cursor-pointer"
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
              <Label htmlFor="nombresApellidos">Nombre Completo</Label>
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
                placeholder="Ingrese la cédula"
                value={formData.cedula}
                onChange={handleChange}
                error={!!errors.cedula}
                hint={errors.cedula}
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
              <Label htmlFor="sedeId">Sede</Label>
              <Select
                options={optionsSede}
                placeholder="Seleccione una sede"
                onChange={(value) => handleSelectChange("sedeId", value)}
                value={String(formData.sedeId || "")}
              />
            </div>
            <div>
              <Label htmlFor="numeroTelefono">Teléfono Convencional</Label>
              <Input
                id="numeroTelefono"
                type="text"
                placeholder="Ingrese el teléfono convencional"
                value={formData.numeroTelefono}
                onChange={handleChange}
                error={!!errors.numeroTelefono}
                hint={errors.numeroTelefono}
              />
            </div>
            <div>
              <Label htmlFor="numeroCelular">Teléfono Celular</Label>
              <Input
                id="numeroCelular"
                type="text"
                placeholder="Ingrese el teléfono celular"
                value={formData.numeroCelular}
                onChange={handleChange}
                error={!!errors.numeroCelular}
                hint={errors.numeroCelular}
              />
            </div>
          </div>
        </div>
      </ComponentCard>
      <br />
      <ComponentCard title="Datos de discapacidad">
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <div className="flex items-center">
              <Switch
                label="¿Presenta discapacidad?"
                defaultChecked={formData.tieneDiscapacidad || false}
                onChange={(checked) =>
                  handleSwitchChange("tieneDiscapacidad", checked)
                }
              />
            </div>
            {formData.tieneDiscapacidad && (
              <>
                <div>
                  <Switch
                    label="¿Porta carnet de discapacidad?"
                    defaultChecked={formData.portadorCarnet || false}
                    onChange={(checked) =>
                      handleSwitchChange("portadorCarnet", checked)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="tipoDiscapacidad">Tipo de Discapacidad</Label>
                  <Select
                    options={optionsDiscapacidad}
                    placeholder="Selecciona el tipo de discapacidad"
                    onChange={(value) =>
                      handleSelectChange("tipoDiscapacidad", value)
                    }
                    value={formData.tipoDiscapacidad || ""}
                  />
                </div>
                <div>
                  <Label htmlFor="detalleDiscapacidad">
                    Detalles de la Discapacidad
                  </Label>
                  <Input
                    id="detalleDiscapacidad"
                    type="text"
                    placeholder="Ingrese detalles adicionales"
                    value={formData.detalleDiscapacidad}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label htmlFor="porcentajeDiscapacidad">
                    Porcentaje de Discapacidad
                  </Label>
                  <Input
                    id="porcentajeDiscapacidad"
                    type="number"
                    placeholder="Ingrese el porcentaje de discapacidad"
                    value={formData.porcentajeDiscapacidad}
                    onChange={handleChange}
                  />
                </div>
              </>
            )}
          </div>
          <div className="grid grid-cols-2 gap-6 xl:grid-cols-2">
            <div>
              <Label htmlFor="diagnostico">Diagnóstico</Label>
              <Input
                id="diagnostico"
                type="text"
                placeholder="Ingrese el diagnóstico"
                value={formData.diagnostico}
                onChange={handleChange}
              />
            </div>
            <div className="flex items-center pt-6">
              <Switch
                label="Pertenencia a programa de inclusión"
                defaultChecked={formData.perteneceInclusion || false}
                onChange={(checked) =>
                  handleSwitchChange("perteneceInclusion", checked)
                }
              />
            </div>
          </div>
        </div>
      </ComponentCard>
      <br />
      <ComponentCard title="Información educativa">
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <div>
              <Label htmlFor="institucionEducativaId">
                Institución Educativa
              </Label>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <Select
                    options={optionsInstituciones}
                    placeholder="Seleccione la institución educativa"
                    onChange={(value) =>
                      handleSelectChange("institucionEducativaId", value)
                    }
                    value={String(formData.institucionEducativaId || "")}
                  />
                </div>
                {permissions.includes(
                  "PERM_INSTITUCIONES_EDUCATIVAS_CREAR",
                ) && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={openInstitucionModal}
                    title="Agregar nueva institución"
                    className="hover:bg-red-500 hover:text-white"
                  >
                    <Plus size={18} />
                  </Button>
                )}
              </div>
            </div>
            <div>
              <Label htmlFor="jornada">Jornada</Label>
              <Select
                options={optionsJornada}
                placeholder="Seleccione la jornada"
                onChange={(value) => handleSelectChange("jornada", value)}
                value={String(formData.jornada || "")}
              />
            </div>
            <div>
              <Label htmlFor="nivelEducativo">Nivel Educativo</Label>
              <Select
                options={optionsNivelEducativo}
                placeholder="Seleccione el nivel educativo"
                onChange={(value) =>
                  handleSelectChange("nivelEducativo", value)
                }
                value={formData.nivelEducativo || ""}
              />
            </div>
            {formData.nivelEducativo !== "no-escolarizado" &&
              formData.nivelEducativo !== "" && (
                <div>
                  <Label htmlFor="anioEducacion">Año Educativo</Label>
                  <Select
                    options={optionsAñoEducativo(formData.nivelEducativo)}
                    placeholder="Seleccione el año educativo"
                    onChange={(value) =>
                      handleSelectChange("anioEducacion", value)
                    }
                    value={formData.anioEducacion || ""}
                  />
                </div>
              )}
            <div className="flex items-center gap-2 pt-6">
              <Switch
                label="Pertenece a Proyecto"
                defaultChecked={formData.perteneceAProyecto || false}
                onChange={(checked) =>
                  handleSwitchChange("perteneceAProyecto", checked)
                }
              />
            </div>
            {formData.perteneceAProyecto && (
              <div>
                <Label htmlFor="proyecto">Proyecto</Label>
                <Input
                  id="proyecto"
                  type="text"
                  placeholder="Ingrese el proyecto"
                  value={formData.proyecto}
                  onChange={handleChange}
                />
              </div>
            )}
          </div>
        </div>
      </ComponentCard>
      <br />
      <ComponentCard title="Información adicional">
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <div>
              <Label htmlFor="motivoConsulta">Motivo de consulta</Label>
              <TextArea
                value={formData.motivoConsulta}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, motivoConsulta: value }))
                }
                rows={2}
                placeholder="Ingrese el motivo de consulta"
              />
            </div>
            <div>
              <Label htmlFor="observaciones">Observaciones</Label>
              <TextArea
                value={formData.observaciones}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, observaciones: value }))
                }
                rows={2}
                placeholder="Ingrese las observaciones"
              />
            </div>
          </div>
          {/* Documentos */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full mt-4 md:mt-0">
            {/* Ficha Compromiso */}
            <div className="flex flex-col gap-3">
              <Label>Ficha de Compromiso (PDF)</Label>
              <div
                className={`relative border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center transition-all h-32 ${
                  fichaCompromisoFile || existingFichas.compromiso
                    ? "border-green-200 bg-green-50/30 dark:border-green-500/30 dark:bg-green-500/5"
                    : "border-gray-200 dark:border-gray-700 hover:border-brand-300 dark:hover:border-brand-500 bg-white dark:bg-gray-900"
                }`}
              >
                <input
                  id="fichaCompromiso"
                  type="file"
                  accept="application/pdf"
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  onChange={(e) =>
                    setFichaCompromisoFile(e.target.files?.[0] || null)
                  }
                />
                {fichaCompromisoFile || existingFichas.compromiso ? (
                  <div className="flex flex-col items-center gap-2 text-center text-green-600 dark:text-green-400">
                    <CheckCircle2 className="w-8 h-8 animate-in zoom-in-50 duration-300" />
                    <span className="text-xs font-bold truncate max-w-[150px]" title={fichaCompromisoFile ? fichaCompromisoFile.name : existingFichas.compromiso.nombre}>
                      {fichaCompromisoFile
                        ? fichaCompromisoFile.name
                        : "Documento cargado"}
                    </span>
                    {existingFichas.compromiso && !fichaCompromisoFile && (
                      <button
                        type="button"
                        onClick={() => downloadExistingDocument(existingFichas.compromiso.id, existingFichas.compromiso.nombre)}
                        className="text-[10px] underline hover:text-green-700"
                      >
                        Ver actual
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-center text-gray-500 dark:text-gray-400">
                    <div className="p-3 rounded-full bg-gray-100 dark:bg-gray-800">
                      <Upload className="w-6 h-6 text-gray-400" />
                    </div>
                    <span className="text-xs font-semibold">
                      Click para subir PDF
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Ficha Deteccion */}
            <div className="flex flex-col gap-3">
              <Label>Ficha de Detección (PDF)</Label>
              <div
                className={`relative border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center transition-all h-32 ${
                  fichaDeteccionFile || existingFichas.deteccion
                    ? "border-green-200 bg-green-50/30 dark:border-green-500/30 dark:bg-green-500/5"
                    : "border-gray-200 dark:border-gray-700 hover:border-brand-300 dark:hover:border-brand-500 bg-white dark:bg-gray-900"
                }`}
              >
                <input
                  id="fichaDeteccion"
                  type="file"
                  accept="application/pdf"
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  onChange={(e) =>
                    setFichaDeteccionFile(e.target.files?.[0] || null)
                  }
                />
                {fichaDeteccionFile || existingFichas.deteccion ? (
                  <div className="flex flex-col items-center gap-2 text-center text-green-600 dark:text-green-400">
                    <CheckCircle2 className="w-8 h-8 animate-in zoom-in-50 duration-300" />
                    <span className="text-xs font-bold truncate max-w-[150px]" title={fichaDeteccionFile ? fichaDeteccionFile.name : existingFichas.deteccion.nombre}>
                      {fichaDeteccionFile
                        ? fichaDeteccionFile.name
                        : "Documento cargado"}
                    </span>
                    {existingFichas.deteccion && !fichaDeteccionFile && (
                      <button
                        type="button"
                        onClick={() => downloadExistingDocument(existingFichas.deteccion.id, existingFichas.deteccion.nombre)}
                        className="text-[10px] underline hover:text-green-700"
                      >
                        Ver actual
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-center text-gray-500 dark:text-gray-400">
                    <div className="p-3 rounded-full bg-gray-100 dark:bg-gray-800">
                      <Upload className="w-6 h-6 text-gray-400" />
                    </div>
                    <span className="text-xs font-semibold">
                      Click para subir PDF
                    </span>
                  </div>
                )}
              </div>
            </div>
            {/* Otros Documentos Dinámicos */}
            <div className="flex flex-col gap-3 sm:col-span-3">
              <Label>Otros Documentos Adicionales (PDF, Imágenes, etc.)</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {/* Documentos ya existentes en el servidor */}
                {existingDocumentos.map((doc) => (
                  <div key={doc.id} className="relative flex items-center justify-between p-3 bg-green-50/50 dark:bg-green-500/5 border border-green-200 dark:border-green-500/30 rounded-xl shadow-sm">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <div className="p-2 rounded-lg bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400">
                        <FileText size={18} />
                      </div>
                      <span className="text-xs font-bold truncate max-w-[120px]" title={doc.nombre}>
                        {doc.nombre}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => downloadExistingDocument(doc.id, doc.nombre)}
                        className="p-1.5 text-gray-400 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/10 rounded-full transition-colors"
                        title="Descargar"
                      >
                        <Download size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteExistingDocument(doc.id)}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-full transition-colors"
                        title="Eliminar"
                      >
                        <Trash size={14} />
                      </button>
                    </div>
                  </div>
                ))}

                {/* Nuevos documentos a subir */}
                {otrosDocumentos.map((file, index) => (
                  <div key={`new-${index}`} className="relative flex items-center justify-between p-3 bg-white dark:bg-gray-900 border border-brand-200 dark:border-brand-500/30 rounded-xl shadow-sm border-dashed">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <div className="p-2 rounded-lg bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400">
                        <FileText size={18} />
                      </div>
                      <span className="text-xs font-bold truncate max-w-[120px]" title={file.name}>
                        {file.name}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeOtroDocumento(index)}
                      className="ml-2 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-full transition-colors"
                    >
                      <Trash size={14} />
                    </button>
                  </div>
                ))}
                
                <div className="relative border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-brand-300 dark:hover:border-brand-500 rounded-xl p-4 flex flex-col items-center justify-center transition-all bg-white dark:bg-gray-900 h-[58px] cursor-pointer group">
                  <input
                    id="otrosDocumentos"
                    type="file"
                    multiple
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    onChange={handleOtrosDocumentosChange}
                  />
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 group-hover:text-brand-500 transition-colors">
                    <Plus size={18} />
                    <span className="text-xs font-semibold">Agregar archivos</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ComponentCard>

      <div className="mt-6 flex justify-end gap-3">
        <Button variant="outline" onClick={() => navigate("/pacientes")}>
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="dark:bg-gray-600 dark:hover:bg-gray-700"
        >
          {loading ? "Guardando..." : "Guardar Paciente"}
        </Button>
      </div>
      <InstitucionModal
        isOpen={isInstitucionModalOpen}
        onClose={closeInstitucionModal}
        onSave={handleSaveInstitucion}
        title="Nueva Institución"
      />
    </div>
  );
}
