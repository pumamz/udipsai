import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";
import FormularioPsicologiaClinica from "../../../components/form/fichas-form/FormularioPsicologiaClinica";

export default function EditarPsicologiaClinica() {
  return (
    <>
      <PageMeta
        title="Editar Psicología Clínica | Udipsai"
        description="Editar ficha de psicología clínica existente"
      />
      <PageBreadcrumb 
        pageTitle="Editar Psicología Clínica" 
        items={[
          { label: "Inicio", path: "/" },
          { label: "Fichas", path: "/fichas" },
          { label: "Editar Psicología Clínica" }
        ]}
      />
      <FormularioPsicologiaClinica />
    </>
  );
}
