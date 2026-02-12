import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";
import FormularioFonoaudiologia from "../../../components/form/fichas-form/FormularioFonoaudiologia";

export default function EditarFonoaudiologia() {
  return (
    <>
      <PageMeta
        title="Editar Ficha Fonoaudiología | Udipsai"
        description="Editar ficha de fonoaudiología existente"
      />
      <PageBreadcrumb 
        pageTitle="Editar Ficha Fonoaudiología" 
        items={[
          { label: "Inicio", path: "/" },
          { label: "Fichas", path: "/fichas" },
          { label: "Editar Ficha Fonoaudiología" }
        ]}
      />
      <FormularioFonoaudiologia />
    </>
  );
}
