import Navbar from "../../components/landing/Navbar";
import Hero from "../../components/landing/Hero";
import Statistics from "../../components/landing/Statistics";
import Features from "../../components/landing/Features";
import RolePortals from "../../components/landing/RolePortals";
import Workflow from "../../components/landing/Workflow";
import WhyChooseUs from "../../components/landing/WhyChooseUs";
import Testimonials from "../../components/landing/Testimonials";
import CTA from "../../components/landing/CTA";
import Footer from "../../components/landing/Footer";

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="pt-0">

        <section id="home">
          <Hero />
        </section>

        <section id="features">
          <Features />
        </section>

        <section id="departments">
          <Statistics />
        </section>

        <section id="roles">
          <RolePortals />
        </section>

        <section id="analytics">
          <Workflow />
        </section>

        <section>
          <WhyChooseUs />
        </section>

        <section>
          <Testimonials />
        </section>

        <section>
          <CTA />
        </section>

        <section id="contact">
          <Footer />
        </section>

      </main>
    </>
  );
}