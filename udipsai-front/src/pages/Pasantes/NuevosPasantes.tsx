import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import FormularioPasantes from "../../components/form/pasantes-form/FormularioPasantes";

export default function NuevosPasantes() {
  return (
    <>
      <PageMeta
        title="Nuevo Pasante | Udipsai"
        description="Formulario para la gestión de pasantes en Udipsai"
      />
      <PageBreadcrumb
        pageTitle="Nuevo Pasante"
        items={[
          { label: "Inicio", path: "/" },
          { label: "Pasantes", path: "/pasantes" },
          { label: "Nuevo Pasante" },
        ]}
      />
      <FormularioPasantes />
    </>
  );
}
