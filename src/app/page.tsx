"use client";

import { FormEvent, useCallback, useMemo, useState } from "react";
import {
  buildShareContactLink,
  buildSmsIntent,
  buildVCardPayload,
  loadPngAsBase64,
  normalizePhoneForDisplay,
  normalizePhoneForVCard,
  triggerVCardDownload,
} from "@/lib/contact";

const note = "Note: Coffee is basically adult chocolate milk.";

const ownerContact = {
  fullName: "Scott Johnson",
  title: "Connector",
  organization: "Creative Juice",
  phone: "+17082773609",
  email: "scottjohnson9209@gmail.com",
  note,
};

export default function Home() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [isSavingContact, setIsSavingContact] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  const ownerPhoneDisplay = useMemo(() => normalizePhoneForDisplay(ownerContact.phone), []);

  const handleSaveContact = useCallback(async () => {
    if (isSavingContact) {
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

      const payload = buildVCardPayload({ ...ownerContact, photoBase64 }, navigator.userAgent);
      triggerVCardDownload("scott-johnson.vcf", payload);

      // Allow the file-save UI to appear before opening the SMS prompt flow.
      setTimeout(() => {
        setShowPrompt(true);
        setIsSavingContact(false);
      }, 250);
    } catch {
      setIsSavingContact(false);
    }
  }, [isSavingContact]);

  const handleSubmitTextForm = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const normalizedPhone = normalizePhoneForVCard(phone);
      if (!name.trim() || !email.trim() || !normalizedPhone) {
        setError("Enter your name, a valid email, and phone number.");
        return;
      }

      setError("");
      const shareLink = buildShareContactLink(window.location.origin, {
        name: name.trim(),
        email: email.trim(),
        phone: normalizedPhone,
      });

      const smsMessage = [
        "Hey Scott, sharing my contact details:",
        `Name: ${name.trim()}`,
        `Email: ${email.trim()}`,
        `Phone: ${normalizePhoneForDisplay(normalizedPhone)}`,
        `Save my contact: ${shareLink}`,
      ].join("\n");

      const intentUrl = buildSmsIntent(ownerContact.phone, smsMessage, navigator.userAgent);
      window.location.href = intentUrl;
    },
    [email, name, phone]
  );

  return (
    <div className="flex min-h-[calc(100vh-3rem)] items-center justify-center px-2">
      <main className="w-full max-w-md">
        <div className="relative">
          <div className="accent-gradient absolute inset-0 blur-[110px] opacity-30" />
          <div className="relative rounded-[34px] p-[1.5px] neon-border">
            <div className="neon-card relative rounded-[32px] px-6 py-8 text-zinc-50 shadow-card-3d">
              <div className="metallic-stroke absolute inset-x-6 top-0 h-[2px] rounded-full" />
              <div className="relative space-y-7">
                <header className="space-y-2 text-center sm:text-left">
                  <div>
                    <p className="text-xs uppercase tracking-[0.45em] text-white/50">Connector</p>
                    <p className="text-3xl font-semibold text-white">Creative Juice</p>
                  </div>
                  <p className="text-sm text-white/70">
                    {ownerContact.email} | {ownerPhoneDisplay}
                  </p>
                </header>
                <div className="space-y-4">
                  <div className="flex w-full justify-center py-[1vw] pb-6">
                    <button
                      className="neon-button animate-jiggle relative mx-auto flex items-center justify-center gap-2 overflow-hidden rounded-2xl px-8 py-4 text-lg font-semibold transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-[0_30px_45px_rgba(0,0,0,0.65)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/60"
                      type="button"
                      disabled={isSavingContact}
                      onClick={handleSaveContact}
                    >
                      <span className="relative z-[1] flex items-center gap-3">
                        {isSavingContact ? "Preparing Contact..." : "Save Contact"}
                        <svg
                          aria-hidden="true"
                          className="h-5 w-5"
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.8}
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 5v14m0 0-4.5-4.5M12 19l4.5-4.5" />
                        </svg>
                      </span>
                    </button>
                  </div>

                  {showPrompt && !showForm ? (
                    <div className="space-y-3 rounded-2xl border border-white/15 bg-white/5 p-4 text-sm">
                      <p className="text-white/90">
                        Contact saved. Send a text with your phone + email and a shareable save-contact
                        link?
                      </p>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setShowPrompt(false);
                            setShowForm(false);
                          }}
                          className="flex-1 rounded-xl border border-white/25 px-3 py-2 text-white/85"
                        >
                          Not now
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowForm(true)}
                          className="flex-1 rounded-xl bg-emerald-300 px-3 py-2 font-semibold text-emerald-950"
                        >
                          Continue
                        </button>
                      </div>
                    </div>
                  ) : null}

                  {showForm ? (
                    <form
                      className="space-y-3 rounded-2xl border border-white/15 bg-black/35 p-4"
                      onSubmit={handleSubmitTextForm}
                    >
                      <p className="text-sm text-white/90">
                        Add your details for the SMS message and shareable contact card.
                      </p>
                      <label className="block text-xs uppercase tracking-[0.2em] text-white/65">
                        Your Name
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(event) => setName(event.target.value)}
                          className="mt-1 w-full rounded-lg border border-white/20 bg-black/30 px-3 py-2 text-sm text-white outline-none ring-emerald-300/40 focus:ring"
                          placeholder="Jane Doe"
                        />
                      </label>

                      <label className="block text-xs uppercase tracking-[0.2em] text-white/65">
                        Email
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(event) => setEmail(event.target.value)}
                          className="mt-1 w-full rounded-lg border border-white/20 bg-black/30 px-3 py-2 text-sm text-white outline-none ring-emerald-300/40 focus:ring"
                          placeholder="you@example.com"
                        />
                      </label>

                      <label className="block text-xs uppercase tracking-[0.2em] text-white/65">
                        Phone
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(event) => setPhone(event.target.value)}
                          className="mt-1 w-full rounded-lg border border-white/20 bg-black/30 px-3 py-2 text-sm text-white outline-none ring-emerald-300/40 focus:ring"
                          placeholder="(555) 123-4567"
                        />
                      </label>

                      {error ? <p className="text-xs text-rose-300">{error}</p> : null}

                      <button
                        type="submit"
                        className="w-full rounded-xl bg-emerald-300 px-3 py-2 font-semibold text-emerald-950"
                      >
                        Open Text Message
                      </button>
                      <p className="text-xs text-white/60">
                        Compatibility tweak active: Samsung devices get vCard 2.1 formatting; iOS and
                        other devices get vCard 3.0 formatting for better import behavior.
                      </p>
                    </form>
                  ) : null}

                  <div className="text-center text-xs uppercase tracking-[0.35em] text-white/60">
                    Built in America, on earth.
                    <p className="mt-1 text-[13px] tracking-normal italic text-white/70">
                      Making relationships built to last, the American Way.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
