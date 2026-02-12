import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";
import FormularioPsicologiaEducativa from "../../../components/form/fichas-form/FormularioPsicologiaEducativa";

export default function NuevaPsicologiaEducativa() {
  return (
    <>
      <PageMeta
        title="Nueva Psicología Educativa | Udipsai"
        description="Crear una nueva ficha de psicología educativa"
      />
      <PageBreadcrumb 
        pageTitle="Nueva Psicología Educativa" 
        items={[
          { label: "Inicio", path: "/" },
          { label: "Fichas", path: "/fichas" },
          { label: "Nueva Psicología Educativa" }
        ]}
      />
      <FormularioPsicologiaEducativa />
    </>
  );
}
