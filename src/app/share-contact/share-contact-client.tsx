"use client";

import { useCallback, useState } from "react";
import {
  buildVCardPayload,
  loadPngAsBase64,
  normalizePhoneForDisplay,
  triggerVCardDownload,
} from "@/lib/contact";

type ShareContactClientProps = {
  name: string;
  email: string;
  phone: string;
};

export default function ShareContactClient({ name, email, phone }: ShareContactClientProps) {
  const canSave = email.length > 0 && phone.length > 0;
  const [isSavingContact, setIsSavingContact] = useState(false);
  const handleSaveContact = useCallback(async () => {
    if (!canSave || isSavingContact) {
      return;
    }

    setIsSavingContact(true);

    try {
      let photoBase64 = "";
      try {
        photoBase64 = await loadPngAsBase64("/juice.png");
      } catch {
        photoBase64 = "";
      }

      const payload = buildVCardPayload(
        {
          fullName: name || "Shared Contact",
          email,
          phone,
          note: "Contact shared from text message",
          photoBase64,
        },
        navigator.userAgent
      );

      triggerVCardDownload(
        `${name.toLowerCase().replace(/\s+/g, "-") || "shared-contact"}.vcf`,
        payload
      );
    } finally {
      setIsSavingContact(false);
    }
  }, [canSave, email, isSavingContact, name, phone]);

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-xl items-center px-4 py-10">
      <main className="w-full rounded-3xl border border-white/10 bg-black/35 p-6 text-white shadow-2xl backdrop-blur">
        <p className="text-xs uppercase tracking-[0.3em] text-white/60">Contact Share</p>
        <h1 className="mt-2 text-2xl font-semibold">{name}</h1>
        <div className="mt-5 space-y-2 text-sm text-white/80">
          <p>Email: {email || "Unavailable"}</p>
          <p>Phone: {phone ? normalizePhoneForDisplay(phone) : "Unavailable"}</p>
        </div>

        <button
          type="button"
          disabled={!canSave || isSavingContact}
          onClick={handleSaveContact}
          className="mt-6 w-full rounded-xl bg-emerald-300 px-5 py-3 font-semibold text-emerald-950 transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSavingContact ? "Preparing Contact..." : "Save Contact"}
        </button>

        <p className="mt-4 text-xs text-white/60">
          Samsung devices use vCard 2.1 formatting, while iOS uses vCard 3.0 formatting for
          improved contact import behavior.
        </p>
      </main>
    </div>
  );
}
