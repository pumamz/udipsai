import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "../../layout/AuthPageLayout";
import SignInForm from "../../components/auth/SignInForm";

export default function SignIn() {
  return (
    <>
      <PageMeta
        title="Iniciar sesión | Udipsai"
        description="Sistema de diagnóstico, investigación psicopedagógica y apoyo a la inclusión"
      />
      <AuthLayout>
        <SignInForm />
      </AuthLayout>
    </>
  );
}
