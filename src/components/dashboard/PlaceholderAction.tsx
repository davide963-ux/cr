"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Modal } from "./Modal";

interface PlaceholderActionProps {
  label: string;
  modalTitle: string;
  modalBody: string;
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
}

/**
 * Pulsante di una funzione non ancora collegata: apre una modale che lo dice
 * apertamente, invece di fingere che l'azione sia avvenuta.
 */
export function PlaceholderAction({
  label,
  modalTitle,
  modalBody,
  variant = "secondary",
  size = "md",
}: PlaceholderActionProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant={variant} size={size} onClick={() => setOpen(true)}>
        {label}
      </Button>
      <Modal open={open} onClose={() => setOpen(false)} title={modalTitle}>
        <p>{modalBody}</p>
      </Modal>
    </>
  );
}
