import PageMeta from "../../components/common/PageMeta";
import FichasUnificadasTable from "../../components/tables/FichasUnificadasTable";

export default function ListaFichasUnificadas() {
  return (
    <>
      <PageMeta
        title="Fichas Unificadas | Udipsai"
        description="Gestión de fichas unificadas"
      />
      <FichasUnificadasTable />
    </>
  );
}
