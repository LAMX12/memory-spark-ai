
import Footer from "@/components/landing/Footer";
import Hero from "@/components/landing/Hero";
import Navbar from "@/components/landing/Navbar";
import Features from "@/components/landing/Features";
import Pricing from "@/components/landing/Pricing";

const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1">
        <Hero />
        <Features />
        <Pricing />
      </div>
      <Footer />
    </div>
  );
};

export default Landing;
