"use client";

import { useCallback, useRef } from "react";
import { trpc } from "@/lib/trpc/client";

export function useFichaAutoSave(fichaId: string) {
  const utils = trpc.useUtils();
  const updateMutation = trpc.ficha.update.useMutation({
    onSuccess: () => utils.ficha.getById.invalidate({ id: fichaId }),
  });

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const save = useCallback(
    (data: Record<string, unknown>) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        updateMutation.mutate({ id: fichaId, ...data } as Parameters<typeof updateMutation.mutate>[0]);
      }, 500);
    },
    [fichaId, updateMutation]
  );

  return {
    save,
    isSaving: updateMutation.isPending,
    isError: updateMutation.isError,
    isSuccess: updateMutation.isSuccess,
  };
}
