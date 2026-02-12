import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";
import FormularioHistoriaClinica from "../../../components/form/fichas-form/FormularioHistoriaClinica";

export default function NuevaHistoriaClinica() {
  return (
    <>
      <PageMeta
        title="Nueva Historia Clínica | Udipsai"
        description="Crear una nueva ficha de historia clínica"
      />
      <PageBreadcrumb 
        pageTitle="Nueva Historia Clínica" 
        items={[
          { label: "Inicio", path: "/" },
          { label: "Fichas", path: "/fichas" },
          { label: "Nueva Historia Clínica" }
        ]}
      />
      <FormularioHistoriaClinica />
    </>
  );
}
