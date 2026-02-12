import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";
import FormularioPsicologiaEducativa from "../../../components/form/fichas-form/FormularioPsicologiaEducativa";

export default function EditarPsicologiaEducativa() {
  return (
    <>
      <PageMeta
        title="Editar Psicología Educativa | Udipsai"
        description="Editar ficha de psicología educativa existente"
      />
      <PageBreadcrumb 
        pageTitle="Editar Psicología Educativa" 
        items={[
          { label: "Inicio", path: "/" },
          { label: "Fichas", path: "/fichas" },
          { label: "Editar Psicología Educativa" }
        ]}
      />
      <FormularioPsicologiaEducativa />
    </>
  );
}
