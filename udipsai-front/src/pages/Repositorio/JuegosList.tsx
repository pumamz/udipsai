import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Monitor, Gamepad2, Download, Gamepad } from "lucide-react";
import PageMeta from "../../components/common/PageMeta";
import { TableActionHeader } from "../../components/common/TableActionHeader";
import { Recurso, recursosService } from "../../services";
import Button from "../../components/ui/button/Button";
import Badge from "../../components/ui/badge/Badge";

export default function JuegosList() {
  const [adicionales, setAdicionales] = useState<Recurso[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAdicionales();
  }, []);

  const loadAdicionales = async () => {
    setLoading(true);
    try {
      const allResources = await recursosService.getRecursos();
      setAdicionales(allResources.filter((r: Recurso) => r.tipo === "juego"));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageMeta
        title="Juegos | UDIPSAI"
        description="Juegos de estimulación cognitiva y palabras"
      />

      <TableActionHeader
        title="Juegos"
        newButtonText="Subir Juego"
        onNew={() => (window.location.href = "/subir-recursos")}
      />

      <div className="mb-10">
        <div className="flex items-center mb-6 pl-4 border-l-4 border-brand-500">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white/90">
            Juegos Oficiales
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-200 dark:border-white/[0.05] p-6 flex flex-col items-center text-center hover:shadow-lg transition-all duration-300 group">
            <div className="mb-5 p-4 bg-gray-50 dark:bg-gray-500/10 rounded-2xl text-gray-500 group-hover:scale-110 transition-transform duration-300">
              <Monitor size={40} strokeWidth={1.5} />
            </div>

            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 ">
              Estimulación Cognitiva
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Mejora tus habilidades cognitivas con estos ejercicios
              interactivos online.
            </p>

            <div className="mt-auto w-full">
              <Link to="/juegos/estimulacion">
                <Button className="w-full flex items-center justify-center gap-2 dark:bg-gray-600 dark:hover:bg-gray-700 text-white">
                  <Gamepad2 size={18} />
                  Jugar Online
                </Button>
              </Link>
            </div>
          </div>

          <div className="bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-200 dark:border-white/[0.05] p-6 flex flex-col items-center text-center hover:shadow-lg transition-all duration-300 group">
            <div className="mb-5 p-4 bg-gray-50 dark:bg-gray-500/10 rounded-2xl text-gray-500 group-hover:scale-110 transition-transform duration-300">
              <Gamepad size={40} strokeWidth={1.5} />
            </div>

            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              Juego de Palabras
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Desarrolla tu vocabulario y agilidad mental con desafíos de
              palabras.
            </p>

            <div className="mt-auto w-full">
              <Link to="/juegos/palabras">
                <Button className="w-full flex items-center justify-center gap-2 dark:bg-gray-600 dark:hover:bg-gray-700 text-white">
                  <Gamepad2 size={18} />
                  Jugar Online
                </Button>
              </Link>
            </div>
          </div>

          <div className="bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-200 dark:border-white/[0.05] p-6 flex flex-col items-center text-center hover:shadow-lg transition-all duration-300 group">
            <div className="mb-5 p-4 bg-gray-50 dark:bg-gray-500/10 rounded-2xl text-gray-600 dark:text-gray-400 group-hover:scale-110 transition-transform duration-300">
              <Download size={40} strokeWidth={1.5} />
            </div>

            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              Versión Escritorio
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Descarga el paquete completo para jugar sin conexión a internet.
            </p>

            <div className="mt-auto w-full">
              <a
                href="/descargas/juegos/JuegoEscritorio.zip"
                download
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2 border-gray-300 text-gray-700 dark:text-gray-300"
                >
                  <Download size={18} />
                  Descargar .ZIP
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-10">
        <div className="flex items-center mb-6 pl-4 border-l-4 border-teal-500">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white/90">
            Recursos Adicionales
          </h2>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-10 h-10 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin"></div>
          </div>
        ) : adicionales.length === 0 ? (
          <div className="bg-white dark:bg-white/[0.03] rounded-2xl p-12 text-center border border-dashed border-gray-300 dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              No hay juegos adicionales instalados en el sistema.
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
            {adicionales.map((juego) => (
              <div
                key={juego.id}
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
                  <Gamepad2 size={28} strokeWidth={1.5} />
                </div>

                <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">
                  {juego.titulo}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-6 line-clamp-2 min-h-[32px]">
                  {juego.descripcion || "Recurso adicional para estimulación."}
                </p>

                <a
                  href={`/api/recursos/download/${juego.archivo}`}
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
