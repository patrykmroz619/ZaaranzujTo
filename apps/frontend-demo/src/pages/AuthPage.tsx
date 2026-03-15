import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AppLayout } from "@/components/AppLayout";

interface AuthPageProps {
  mode: "login" | "register";
}

export default function AuthPage({ mode }: AuthPageProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isLogin = mode === "login";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock auth — redirect to dashboard
    navigate("/dashboard");
  };

  return (
    <AppLayout>
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-elevated">
          <CardHeader className="text-center">
            <CardTitle className="font-display text-2xl">
              {isLogin ? t("auth.signIn") : t("auth.signUp")}
            </CardTitle>
            <CardDescription>
              {isLogin ? "Zaloguj się, aby kontynuować" : "Stwórz konto i zacznij projektować"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Social login */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <Button variant="outline" className="w-full">
                {t("auth.google")}
              </Button>
              <Button variant="outline" className="w-full">
                {t("auth.apple")}
              </Button>
            </div>

            <div className="relative mb-4">
              <Separator />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
                {t("auth.orContinueWith")}
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t("auth.email")}</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{t("auth.password")}</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {isLogin && (
                <Link to="/forgot-password" className="block text-sm text-primary hover:underline">
                  {t("auth.forgotPassword")}
                </Link>
              )}
              <Button
                type="submit"
                className="w-full gradient-warm text-primary-foreground border-0"
              >
                {isLogin ? t("auth.signIn") : t("auth.signUp")}
              </Button>
            </form>

            <p className="mt-4 text-center text-sm text-muted-foreground">
              {isLogin ? t("auth.noAccount") : t("auth.hasAccount")}{" "}
              <Link to={isLogin ? "/register" : "/login"} className="text-primary hover:underline">
                {isLogin ? t("auth.signUp") : t("auth.signIn")}
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
