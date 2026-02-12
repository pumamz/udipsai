import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import FormularioPasantes from "../../components/form/pasantes-form/FormularioPasantes";

export default function EditarPasantes() {
  return (
    <>
      <PageMeta
        title="Editar Pasante | Udipsai"
        description="Formulario para la gestión de pasantes en Udipsai"
      />
      <PageBreadcrumb
        pageTitle="Editar Pasante"
        items={[
          { label: "Inicio", path: "/" },
          { label: "Pasantes", path: "/pasantes" },
          { label: "Editar Pasante" },
        ]}
      />
      <FormularioPasantes />
    </>
  );
}
