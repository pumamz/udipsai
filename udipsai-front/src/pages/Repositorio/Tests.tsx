import { useEffect, useState } from "react";
import { Download, Brain, User, Clock, ClipboardList } from "lucide-react";
import { Link } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import { TableActionHeader } from "../../components/common/TableActionHeader";
import Button from "../../components/ui/button/Button";
import Badge from "../../components/ui/badge/Badge";
import { Recurso, recursosService } from "../../services";

interface SoftwareCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  fileUrl?: string;
  variant?: "primary" | "info" | "warning" | "success";
}

const SoftwareCard: React.FC<SoftwareCardProps> = ({
  title,
  description,
  icon,
  fileUrl,
  variant = "primary",
}) => {
  const variantColors = {
    primary: "bg-brand-50 text-brand-500 dark:bg-brand-500/10",
    info: "bg-blue-50 text-blue-600 dark:bg-blue-500/10",
    warning: "bg-orange-50 text-orange-600 dark:bg-orange-500/10",
    success: "bg-teal-50 text-teal-600 dark:bg-teal-500/10",
  };

  return (
    <div className="bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-200 dark:border-white/[0.05] p-6 flex flex-col items-center text-center hover:shadow-lg transition-all duration-300 group">
      <div
        className={`mb-5 p-4 rounded-2xl ${variantColors[variant]} group-hover:scale-110 transition-transform duration-300`}
      >
        {icon}
      </div>
      <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2 uppercase tracking-wide">
        {title}
      </h3>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-6 px-2 min-h-[32px]">
        {description}
      </p>
      <div className="mt-auto w-full">
        <a
          href={fileUrl}
          download
          target="_blank"
          rel="noopener noreferrer"
          className="w-full block"
        >
          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5"
          >
            <Download size={16} />
            Descargar
          </Button>
        </a>
      </div>
    </div>
  );
};

export default function Tests() {
  const [adicionales, setAdicionales] = useState<Recurso[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAdicionales();
  }, []);

  const loadAdicionales = async () => {
    setLoading(true);
    try {
      const allResources = await recursosService.getRecursos();
      setAdicionales(allResources.filter((r: Recurso) => r.tipo === "test"));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const softwareList = [
    {
      title: "UDIPSAI 0.1.1",
      description: "Software base de evaluación neuropsicológica.",
      icon: <Brain size={32} strokeWidth={1.5} />,
      fileUrl: "/descargas/tests/udipsai-0.1.1.zip",
      variant: "primary" as const,
    },
    {
      title: "UDIPSAI LECTURA",
      description: "Evaluación de procesos lectores y escritura.",
      icon: <User size={32} strokeWidth={1.5} />,
      fileUrl: "/descargas/tests/UDIPSAI_LECTURA_Y_MAS.zip",
      variant: "info" as const,
    },
    {
      title: "ESTILOS DE APRENDIZAJE",
      description: "Identificación de preferencias de aprendizaje.",
      icon: <Clock size={32} strokeWidth={1.5} />,
      fileUrl: "/descargas/tests/test-estilos-aprendizaje.zip",
      variant: "warning" as const,
    },
    {
      title: "FUNCIONES BÁSICAS",
      description: "Medición de habilidades fundamentales.",
      icon: <ClipboardList size={32} strokeWidth={1.5} />,
      fileUrl: "/descargas/tests/test-funciones-basicas.zip",
      variant: "success" as const,
    },
  ];

  return (
    <>
      <PageMeta
        title="Software de Evaluación | UDIPSAI"
        description="Descarga de aplicaciones de escritorio para evaluaciones"
      />

      <TableActionHeader
        title="Software de Evaluación"
        newButtonText="Subir Test"
        onNew={() => (window.location.href = "/subir-recursos")}
      />

      <div className="mb-10">
        <div className="flex items-center mb-6 pl-4 border-l-4 border-brand-500">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white/90">
            Software Oficial (Escritorio)
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {softwareList.map((software, index) => (
            <SoftwareCard
              key={index}
              title={software.title}
              description={software.description}
              icon={software.icon}
              fileUrl={software.fileUrl}
              variant={software.variant}
            />
          ))}
        </div>
      </div>

      <div className="mb-10">
        <div className="flex items-center mb-6 pl-4 border-l-4 border-teal-500">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white/90">
            Tests Adicionales
          </h2>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-10 h-10 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin"></div>
          </div>
        ) : adicionales.length === 0 ? (
          <div className="bg-white dark:bg-white/[0.03] rounded-2xl p-12 text-center border border-dashed border-gray-300 dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              No hay tests adicionales instalados en el sistema.
            </p>
            <Link to="/subir-recursos">
              <Button
                variant="outline"
                size="sm"
                className="text-brand-500 border-brand-500 hover:bg-brand-50"
              >
                Gestionar Recursos
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {adicionales.map((test) => (
              <div
                key={test.id}
                className="bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-200 dark:border-white/[0.05] p-6 flex flex-col items-center text-center hover:shadow-lg transition-all duration-300 relative group overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-teal-500/50"></div>

                <Badge
                  size="sm"
                  color="success"
                >
                  NUEVO
                </Badge>

                <div className="mb-4 p-3 bg-teal-50 dark:bg-teal-500/10 rounded-full text-teal-600 transition-transform duration-300 group-hover:rotate-12">
                  <ClipboardList size={28} strokeWidth={1.5} />
                </div>

                <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2 line-clamp-1 uppercase">
                  {test.titulo}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-6 line-clamp-2 min-h-[32px]">
                  {test.descripcion || "Software adicional de evaluación."}
                </p>

                <a
                  href={`/api/recursos/download/${test.archivo}`}
                  download
                  className="w-full mt-auto"
                >
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full flex items-center justify-center gap-2 hover:bg-teal-50 hover:text-teal-600 hover:border-teal-200"
                  >
                    <Download size={14} />
                    Descargar
                  </Button>
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
