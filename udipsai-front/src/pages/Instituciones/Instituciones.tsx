import PageMeta from "../../components/common/PageMeta";
import InstitucionesAccionesTable from "../../components/tables/InstitucionesAccionesTable";

export default function ListaInstituciones() {
  return (
    <>
      <PageMeta
        title="Lista de Instituciones | Udipsai"
        description="Formulario para la gestión de instituciones en Udipsai"
      />
      <InstitucionesAccionesTable />
    </>
  );
}
