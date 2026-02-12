import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import FormularioEspecialistas from "../../components/form/especialista-form/FormularioEspecialistas";

export default function EditarEspecialistas() {
  return (
    <>
      <PageMeta
        title="Editar Especialista | Udipsai"
        description="Formulario para la gestión de especialistas en Udipsai"
      />
      <PageBreadcrumb 
        pageTitle="Editar Especialista" 
        items={[
          { label: "Inicio", path: "/" },
          { label: "Especialistas", path: "/especialistas" },
          { label: "Editar Especialista" }
        ]}
      />
      <FormularioEspecialistas />
    </>
  );
}
