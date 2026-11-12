import { PenLine } from "lucide-react";
import { useState, type FormEvent } from "react";
import Reveal from "./Reveal";
import SectionTitle from "./SectionTitle";
import FloralDecoration from "./FloralDecoration";
import { FrameCorners } from "./Ornaments";
import { useNetlifyForm } from "../hooks/useNetlifyForm";
import { assets } from "../data/assets";
import { wedding } from "../data/wedding";

type Errors = Partial<Record<"nama" | "ucapan", string>>;

interface Props {
  guestName?: string;
}

export default function GuestbookSection({ guestName = "" }: Props) {
  const { status, submit, reset } = useNetlifyForm();
  const [errors, setErrors] = useState<Errors>({});

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const nama = String(data.get("nama") ?? "").trim();
    const ucapan = String(data.get("ucapan") ?? "").trim();

    const next: Errors = {};
    if (nama.length < 2) next.nama = "Mohon isi nama Anda (minimal 2 karakter).";
    if (ucapan.length < 3) next.ucapan = "Mohon tuliskan ucapan Anda.";
    else if (ucapan.length > 500) next.ucapan = "Ucapan maksimal 500 karakter.";
    setErrors(next);
    if (Object.keys(next).length) return;

    if (await submit(form)) form.reset();
  };

  return (
    <section id="ucapan" className="section guestbook">
      <FloralDecoration
        src={assets.flowerCorner}
        className="gb-deco gb-tr"
        flip="x"
        origin="top right"
        float={5}
        opacity={0.85}
      />

      <div className="container container--form">
        <SectionTitle script="Doa & Ucapan" title="Wedding Wishes">
          Tuliskan doa dan ucapan terbaik untuk kedua mempelai.
        </SectionTitle>

        <Reveal y={36}>
          <div className="form-card form-card--soft">
            <FrameCorners />
            <form
              name={wedding.forms.guestbook}
              method="POST"
              data-netlify="true"
              netlify-honeypot="bot-field"
              onSubmit={onSubmit}
              noValidate
              onChange={() => status !== "idle" && reset()}
            >
              <input type="hidden" name="form-name" value={wedding.forms.guestbook} />
              <p className="hp" aria-hidden="true">
                <label>
                  Jangan isi kolom ini: <input name="bot-field" tabIndex={-1} autoComplete="off" />
                </label>
              </p>

              <div className="field">
                <label htmlFor="gb-nama">Nama</label>
                <input
                  id="gb-nama"
                  name="nama"
                  type="text"
                  maxLength={80}
                  defaultValue={guestName}
                  autoComplete="name"
                  placeholder="Nama Anda"
                  aria-invalid={!!errors.nama}
                />
                {errors.nama && <span className="field-error">{errors.nama}</span>}
              </div>

              <div className="field">
                <label htmlFor="gb-ucapan">Ucapan</label>
                <textarea
                  id="gb-ucapan"
                  name="ucapan"
                  rows={5}
                  maxLength={500}
                  placeholder="Tuliskan doa dan ucapan terbaik Anda"
                  aria-invalid={!!errors.ucapan}
                />
                {errors.ucapan && <span className="field-error">{errors.ucapan}</span>}
              </div>

              <button type="submit" className="btn btn--primary form-submit" disabled={status === "sending"}>
                <PenLine size={16} strokeWidth={1.6} aria-hidden="true" />
                {status === "sending" ? "MENGIRIM..." : "KIRIM UCAPAN"}
              </button>

              <div aria-live="polite">
                {status === "success" && (
                  <p className="form-msg form-msg--ok">
                    Ucapan Anda telah berhasil dikirim dan akan diterima oleh kedua mempelai. Terima kasih.
                  </p>
                )}
                {status === "error" && (
                  <p className="form-msg form-msg--err">
                    Ucapan belum terkirim. Periksa koneksi internet Anda lalu coba kembali.
                  </p>
                )}
              </div>
            </form>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
