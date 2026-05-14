"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Sword, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc/client";

const schema = z.object({
  name: z.string().min(2, "Mínimo 2 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
  confirmPassword: z.string(),
}).refine(d => d.password === d.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const [error, setError] = useState("");
  const registerMutation = trpc.user.register.useMutation();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setError("");
    try {
      await registerMutation.mutateAsync({ name: data.name, email: data.email, password: data.password });
      await signIn("credentials", { email: data.email, password: data.password, callbackUrl: "/fichas" });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro ao criar conta";
      setError(msg.includes("CONFLICT") ? "Email já cadastrado" : msg);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 bg-background">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="flex items-center gap-2">
              <Sword className="h-7 w-7 text-gold" />
              <span className="font-cinzel font-bold text-2xl text-parchment">
                Player<span className="text-gold">ForAll</span>RPG
              </span>
            </div>
          </div>
          <h1 className="font-cinzel font-bold text-3xl text-parchment">Criar sua conta</h1>
          <p className="text-muted-rpg font-lora mt-2">Junte-se à mesa de aventureiros</p>
        </div>

        <div className="rounded-xl border border-rpg bg-surface p-8 parchment">
          <Button
            variant="outline"
            className="w-full mb-6"
            onClick={() => signIn("google", { callbackUrl: "/fichas" })}
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden>
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continuar com Google
          </Button>

          <div className="relative flex items-center gap-3 mb-6">
            <div className="flex-1 border-t border-rpg" />
            <span className="text-xs text-muted-rpg font-inter">ou</span>
            <div className="flex-1 border-t border-rpg" />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <Input label="Nome" placeholder="Seu nome" error={errors.name?.message} {...register("name")} />
            <Input label="Email" type="email" placeholder="seu@email.com" error={errors.email?.message} {...register("email")} />
            <Input label="Senha" type="password" placeholder="••••••" error={errors.password?.message} {...register("password")} />
            <Input label="Confirmar Senha" type="password" placeholder="••••••" error={errors.confirmPassword?.message} {...register("confirmPassword")} />

            {error && (
              <div className="rounded border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">{error}</div>
            )}

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Criar conta"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-rpg font-lora mt-6">
            Já tem conta?{" "}
            <Link href="/login" className="text-gold hover:underline">Entrar</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
