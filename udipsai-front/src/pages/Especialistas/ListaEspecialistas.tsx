import PageMeta from "../../components/common/PageMeta";
import EspecialistasAccionesTable from "../../components/tables/EspecialistasAccionesTable";

export default function ListaEspecialistas() {
  return (
    <>
      <PageMeta
        title="Lista de Especialistas | Udipsai"
        description="Formulario para la gestión de asignaciones de especialistas en Udipsai"
      />
      <EspecialistasAccionesTable />
    </>
  );
}
