import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Palette, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppLayout } from "@/components/AppLayout";
import heroImage from "@/assets/hero-interior.jpg";

const features = [
  {
    icon: Sparkles,
    titleKey: "Generuj z AI",
    descKey:
      "Prześlij zdjęcie pokoju lub opisz swoją wizję — AI stworzy profesjonalną wizualizację w kilka minut.",
  },
  {
    icon: Palette,
    titleKey: "Wybierz styl",
    descKey:
      "Skandynawski, industrialny, boho — wybierz styl i paletę kolorów, które Ci odpowiadają.",
  },
  {
    icon: RefreshCw,
    titleKey: "Iteruj i udoskonalaj",
    descKey: "Modyfikuj wizualizację krok po kroku, aż osiągniesz idealny efekt.",
  },
];

export default function LandingPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <AppLayout>
      {/* Hero */}
      <section className="relative overflow-hidden gradient-hero">
        <div className="container relative z-10 flex flex-col items-center gap-8 py-20 text-center lg:py-32">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl text-4xl font-display tracking-tight text-foreground sm:text-5xl lg:text-6xl"
          >
            {t("app.tagline")}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="max-w-xl text-lg text-muted-foreground"
          >
            Prześlij zdjęcie wnętrza lub opisz je słowami. Sztuczna inteligencja zaprojektuje Twoje
            wymarzone wnętrze w kilka chwil.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex gap-3"
          >
            <Button
              size="lg"
              onClick={() => navigate("/register")}
              className="gradient-warm text-primary-foreground border-0 gap-2"
            >
              {t("nav.register")}
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/login")}>
              {t("nav.signIn")}
            </Button>
          </motion.div>
        </div>

        {/* Hero image */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="container pb-16"
        >
          <div className="overflow-hidden rounded-2xl shadow-elevated border">
            <img
              src={heroImage}
              alt="Przykładowa wizualizacja wnętrza"
              className="w-full object-cover"
              loading="lazy"
            />
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container">
          <h2 className="mb-12 text-center text-3xl font-display text-foreground">Jak to działa?</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="rounded-xl border bg-card p-6 shadow-card transition-shadow hover:shadow-elevated"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent">
                  <f.icon className="h-6 w-6 text-accent-foreground" />
                </div>
                <h3 className="mb-2 font-display text-xl text-card-foreground">{f.titleKey}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.descKey}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </AppLayout>
  );
}
