import PageMeta from "../../../components/common/PageMeta";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import FormularioHistoriaClinica from "../../../components/form/fichas-form/FormularioHistoriaClinica";

export default function EditarHistoriaClinica() {
  return (
    <>
      <PageMeta
        title="Editar Historia Clínica | Udipsai"
        description="Editar ficha de historia clínica existente"
      />
      <PageBreadcrumb 
        pageTitle="Editar Historia Clínica" 
        items={[
          { label: "Inicio", path: "/" },
          { label: "Fichas", path: "/fichas" },
          { label: "Editar Historia Clínica" }
        ]}
      />
      <FormularioHistoriaClinica />
    </>
  );
}
