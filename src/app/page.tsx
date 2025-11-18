"use client";

import { useCallback } from "react";

const note = "Note: Coffee is basically adult chocolate milk.";

const vCardPayload = [
  "BEGIN:VCARD",
  "VERSION:3.0",
  "N:Johnson;Scott;;;",
  "FN:Scott Johnson",
  "TITLE:Connector",
  "ORG:Creative Juice",
  "TEL;TYPE=CELL,VOICE:708.277.3609",
  "EMAIL:scottjohnson9209@gmail.com",
  `NOTE:${note}`,
  "END:VCARD",
].join("\n");

const triggerDownload = (filename: string, mimeType: string, payload: string) => {
  const blob = new Blob([payload], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
};

const smsTemplate = [
  "Hey Scott – this is your new contact from Creative Juice.",
  "Appreciate the intro and would love to keep the connector magic going.",
  "Let me know a good time to chat!",
].join(" ");

const getMessagingIntent = () => {
  const encodedMessage = encodeURIComponent(smsTemplate);
  const phoneNumber = "+17082773609";
  const userAgent = typeof navigator !== "undefined" ? navigator.userAgent : "";
  const isIos = /iPad|iPhone|iPod/.test(userAgent);
  const separator = isIos ? "&" : "?";
  return `sms:${phoneNumber}${separator}body=${encodedMessage}`;
};

export default function Home() {
  const handleSaveContact = useCallback(() => {
    triggerDownload("scott-johnson.vcf", "text/vcard;charset=utf-8", vCardPayload);

    // Slight delay gives the contact download priority on mobile browsers.
    setTimeout(() => {
      const smsIntent = getMessagingIntent();
      window.location.href = smsIntent;
    }, 350);
  }, []);

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
                    <p className="text-xs uppercase tracking-[0.45em] text-white/50">
                      Connector
                    </p>
                    <p className="text-3xl font-semibold text-white">
                      Creative Juice
                    </p>
                  </div>
                </header>
                <div className="space-y-4">
                  <div className="flex w-full justify-center py-[1vw] pb-12">
                    <button
                      className="neon-button animate-jiggle relative mx-auto flex items-center justify-center gap-2 overflow-hidden rounded-2xl px-8 py-4 text-lg font-semibold transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-[0_30px_45px_rgba(0,0,0,0.65)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/60"
                      type="button"
                      onClick={handleSaveContact}
                    >
                      <span className="relative z-[1] flex items-center gap-3">
                        Save Contact & Text
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
