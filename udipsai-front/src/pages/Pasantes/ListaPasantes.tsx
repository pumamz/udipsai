import PageMeta from "../../components/common/PageMeta";
import PasantesAccionesTable from "../../components/tables/PasantesAccionesTable";

export default function ListaPasantes() {
  return (
    <>
      <PageMeta
        title="Lista de Pasantes | Udipsai"
        description="Formulario para la gestión de pasantes en Udipsai"
      />
      <PasantesAccionesTable />
    </>
  );
}
