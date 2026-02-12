import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";
import FormularioPsicologiaClinica from "../../../components/form/fichas-form/FormularioPsicologiaClinica";

export default function NuevaPsicologiaClinica() {
  return (
    <>
      <PageMeta
        title="Nueva Psicología Clínica | Udipsai"
        description="Crear una nueva ficha de psicología clínica"
      />
      <PageBreadcrumb 
        pageTitle="Nueva Psicología Clínica" 
        items={[
          { label: "Inicio", path: "/" },
          { label: "Fichas", path: "/fichas" },
          { label: "Nueva Psicología Clínica" }
        ]}
      />
      <FormularioPsicologiaClinica />
    </>
  );
}
