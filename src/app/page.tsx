"use client";

import { useCallback } from "react";

const contactFields = [
  { label: "First Name", value: "Scott" },
  { label: "Last Name", value: "Johnson" },
  { label: "Title", value: "Connector" },
  { label: "Company", value: "Creative Juice" },
  { label: "Phone", value: "708.277.3609" },
];

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

const formatICSDate = (date: Date) =>
  date.toISOString().replace(/[-:]/g, "").split(".")[0]?.concat("Z");

const getDefaultMeetingWindow = () => {
  const start = new Date();
  start.setDate(start.getDate() + 1);
  start.setHours(10, 0, 0, 0);

  const end = new Date(start.getTime() + 30 * 60 * 1000);
  return { start, end };
};

const createMeetingInvitePayload = () => {
  const { start, end } = getDefaultMeetingWindow();
  const description = [
    "Lock in a quick call with Scott Johnson.",
    "",
    `Phone: 708.277.3609`,
    `Email: scottjohnson9209@gmail.com`,
    note,
  ].join("\n");

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Scott Johnson//Creative Juice//EN",
    "BEGIN:VEVENT",
    `UID:${crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}@creativejuice`}`,
    `DTSTAMP:${formatICSDate(new Date())}`,
    `DTSTART:${formatICSDate(start)}`,
    `DTEND:${formatICSDate(end)}`,
    "SUMMARY:Intro call with Scott Johnson",
    "LOCATION:Phone or preferred conferencing link",
    `DESCRIPTION:${description.replace(/\n/g, "\\n")}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\n");
};

export default function Home() {
  const handleSaveContact = useCallback(() => {
    triggerDownload("scott-johnson.vcf", "text/vcard;charset=utf-8", vCardPayload);

    // Slight delay gives the contact download priority on mobile browsers.
    setTimeout(() => {
      const meetingPayload = createMeetingInvitePayload();
      triggerDownload("meet-scott-johnson.ics", "text/calendar;charset=utf-8", meetingPayload);
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
                      Creative Connector
                    </p>
                    <p className="text-3xl font-semibold text-white">
                      Creative Juice
                    </p>
                  </div>
                </header>
                <div className="flex flex-col gap-3">
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
                <div className="space-y-4">
                  <button
                    className="neon-button animate-jiggle relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl px-6 py-4 text-lg font-semibold transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-[0_30px_45px_rgba(0,0,0,0.65)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/60"
                    type="button"
                    onClick={handleSaveContact}
                  >
                    <span className="relative z-[1] flex items-center gap-3">
                      Save Contact & Invite
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
