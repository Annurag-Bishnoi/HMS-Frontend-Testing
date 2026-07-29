import LoginForm from "./LoginForm";
import LoginIllustration from "./LoginIllustration";

export default function Login() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">

      {/* Background Blur */}
      <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-blue-300/20 blur-3xl"></div>

      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-cyan-300/20 blur-3xl"></div>

      <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-between px-6 py-10 lg:px-10">

        {/* Left Illustration */}

        <div className="hidden lg:flex w-1/2 justify-center">
          <LoginIllustration />
        </div>

        {/* Right Login Form */}

        <div className="flex w-full justify-center lg:w-1/2">
          <LoginForm />
        </div>

      </div>
    </section>
  );
}