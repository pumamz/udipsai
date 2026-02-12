import PageMeta from "../../components/common/PageMeta";
import EspecialidadesAccionesTable from "../../components/tables/EspecialidadesAccionesTable";

export default function ListaEspecialidades() {
  return (
    <>
      <PageMeta
        title="Lista de Especialidades | Udipsai"
        description="Gestión de especialidades en Udipsai"
      />
      <EspecialidadesAccionesTable />
    </>
  );
}
