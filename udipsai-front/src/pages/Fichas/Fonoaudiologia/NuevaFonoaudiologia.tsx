import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";
import FormularioFonoaudiologia from "../../../components/form/fichas-form/FormularioFonoaudiologia";

export default function NuevaFonoaudiologia() {
  return (
    <>
      <PageMeta
        title="Nueva Ficha Fonoaudiología | Udipsai"
        description="Crear una nueva ficha de fonoaudiología"
      />
      <PageBreadcrumb 
        pageTitle="Nueva Ficha Fonoaudiología" 
        items={[
          { label: "Inicio", path: "/" },
          { label: "Fichas", path: "/fichas" },
          { label: "Nueva Ficha Fonoaudiología" }
        ]}
      />
      <FormularioFonoaudiologia />
    </>
  );
}
