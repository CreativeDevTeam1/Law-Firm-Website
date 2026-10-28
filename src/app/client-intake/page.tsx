import type { Metadata } from "next";
import ClientIntakeForm from "@/components/forms/client-intake-form";

export const metadata: Metadata = { title: "Client intake" };

// No Figma frame: designed from the old intake form's fields and the other
// pages' patterns. No hero, so the form is straight in reach.
export default function ClientIntake() {
  return (
    <main>
      <ClientIntakeForm />
    </main>
  );
}
