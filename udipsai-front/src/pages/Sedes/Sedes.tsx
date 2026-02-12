import PageMeta from "../../components/common/PageMeta";
import SedesAccionesTable from "../../components/tables/SedesAccionesTable";

export default function ListaSedes() {
  return (
    <>
      <PageMeta
        title="Lista de Sedes | Udipsai"
        description="Formulario para la gestión de sedes en Udipsai"
      />
      <SedesAccionesTable />
    </>
  );
}
