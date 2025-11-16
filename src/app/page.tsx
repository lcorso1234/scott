const contactFields = [
  { label: "First Name", value: "Scott" },
  { label: "Last Name", value: "Johnson" },
  { label: "Company Name", value: "Creative Juice" },
  { label: "Phone Number", value: "708.277.3609" },
];

const vCardPayload = [
  "BEGIN:VCARD",
  "VERSION:3.0",
  "N:Johnson;Scott;;;",
  "FN:Scott Johnson",
  "ORG:Creative Juice",
  "TEL;TYPE=CELL,VOICE:708.277.3609",
  "END:VCARD",
].join("\n");

const vCardHref = `data:text/vcard;charset=utf-8,${encodeURIComponent(vCardPayload)}`;

export default function Home() {
  return (
    <div className="flex min-h-[calc(100vh-3rem)] items-center justify-center">
      <main className="w-full max-w-md">
        <div className="relative">
          <div className="accent-gradient absolute inset-0 blur-[80px] opacity-25" />
          <div className="relative rounded-[34px] p-[1.5px] neon-border">
            <div className="neon-card relative rounded-[32px] px-7 py-9 text-zinc-50">
              <div className="metallic-stroke absolute inset-x-6 top-0 h-[2px] rounded-full" />
              <div className="relative">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-3xl border border-white/20 bg-black/40 text-4xl font-semibold tracking-[0.3em] text-white shadow-inner shadow-black/50">
                      I
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.55em] text-white/50">
                        Consultancy
                      </p>
                      <p className="text-2xl font-semibold text-white">
                        Creative Juice
                      </p>
                    </div>
                  </div>
                  <div className="text-right text-xs uppercase tracking-wide text-white/60">
                    <span className="block text-[11px]">Built in</span>
                    <span className="text-sm font-semibold text-white">
                      America · Earth
                    </span>
                  </div>
                </div>
                <div className="mt-6 flex flex-col gap-3">
                  {contactFields.map((field) => (
                    <div
                      key={field.label}
                      className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                    >
                      <span className="text-xs uppercase tracking-[0.35em] text-white/55">
                        {field.label}
                      </span>
                      <span className="text-base font-semibold text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]">
                        {field.value}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-7 space-y-3">
                  <a
                    className="neon-button animate-jiggle relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl px-6 py-4 text-lg font-semibold transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-[0_30px_45px_rgba(0,0,0,0.65)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/60"
                    href={vCardHref}
                    download="scott-johnson.vcf"
                    role="button"
                  >
                    <span className="relative z-[1] flex items-center gap-3">
                      Save Contact
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
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
