import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import FormularioPacientes from "../../components/form/paciente-form/FormularioPacientes";

export default function NuevosPacientes() {
  return (
    <>
      <PageMeta
        title="Nuevo Paciente | Udipsai"
        description="Formulario para la gestión de pacientes en Udipsai"
      />
      <PageBreadcrumb
        pageTitle="Nuevo Paciente"
        items={[
          { label: "Inicio", path: "/" },
          { label: "Pacientes", path: "/pacientes" },
          { label: "Nuevo Paciente" },
        ]}
      />
      <FormularioPacientes />
    </>
  );
}
