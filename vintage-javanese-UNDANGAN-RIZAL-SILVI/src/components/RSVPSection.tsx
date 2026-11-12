import { Send } from "lucide-react";
import { useState, type FormEvent } from "react";
import FloralDecoration from "./FloralDecoration";
import Reveal from "./Reveal";
import SectionTitle from "./SectionTitle";
import { FrameCorners } from "./Ornaments";
import { useNetlifyForm } from "../hooks/useNetlifyForm";
import { assets } from "../data/assets";
import { wedding } from "../data/wedding";

type Errors = Partial<Record<"nama" | "kehadiran" | "jumlah" | "ucapan", string>>;

interface Props {
  guestName?: string;
}

export default function RSVPSection({ guestName = "" }: Props) {
  const { status, submit, reset } = useNetlifyForm();
  const [attend, setAttend] = useState<"" | "Hadir" | "Tidak dapat hadir">("");
  const [errors, setErrors] = useState<Errors>({});

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const nama = String(data.get("nama") ?? "").trim();
    const ucapan = String(data.get("ucapan") ?? "").trim();
    const jumlah = Number(data.get("jumlah") ?? 0);

    const next: Errors = {};
    if (nama.length < 2) next.nama = "Mohon isi nama Anda (minimal 2 karakter).";
    if (!attend) next.kehadiran = "Mohon pilih konfirmasi kehadiran.";
    if (attend === "Hadir" && (!Number.isInteger(jumlah) || jumlah < 1 || jumlah > 10))
      next.jumlah = "Jumlah tamu antara 1 sampai 10 orang.";
    if (ucapan.length > 500) next.ucapan = "Ucapan maksimal 500 karakter.";
    setErrors(next);
    if (Object.keys(next).length) return;

    const ok = await submit(form);
    if (ok) {
      form.reset();
      setAttend("");
    }
  };

  const sending = status === "sending";

  return (
    <section id="rsvp" className="section rsvp">
      <FloralDecoration
        src={assets.flowerCorner}
        className="rsvp-deco rsvp-tl"
        origin="top left"
        float={5}
        opacity={0.9}
      />
      <FloralDecoration
        src={assets.floralDecoration}
        className="rsvp-deco rsvp-bottom"
        float={3}
        duration={11}
        opacity={0.85}
      />

      <div className="container container--form">
        <SectionTitle script="Konfirmasi" title="RSVP">
          Merupakan suatu kehormatan bagi kami apabila Anda berkenan hadir dan memberikan doa restu.
        </SectionTitle>

        <Reveal y={36}>
          <div className="form-card">
            <FrameCorners />
            <form
              name={wedding.forms.rsvp}
              method="POST"
              data-netlify="true"
              netlify-honeypot="bot-field"
              onSubmit={onSubmit}
              noValidate
              onChange={() => status !== "idle" && reset()}
            >
              <input type="hidden" name="form-name" value={wedding.forms.rsvp} />
              <p className="hp" aria-hidden="true">
                <label>
                  Jangan isi kolom ini: <input name="bot-field" tabIndex={-1} autoComplete="off" />
                </label>
              </p>

              <div className="field">
                <label htmlFor="rsvp-nama">Nama</label>
                <input
                  id="rsvp-nama"
                  name="nama"
                  type="text"
                  maxLength={80}
                  defaultValue={guestName}
                  autoComplete="name"
                  placeholder="Nama lengkap Anda"
                  aria-invalid={!!errors.nama}
                />
                {errors.nama && <span className="field-error">{errors.nama}</span>}
              </div>

              <fieldset className="field">
                <legend>Konfirmasi Kehadiran</legend>
                <div className="radio-row">
                  {(["Hadir", "Tidak dapat hadir"] as const).map((opt) => (
                    <label key={opt} className={`radio ${attend === opt ? "is-on" : ""}`}>
                      <input
                        type="radio"
                        name="kehadiran"
                        value={opt}
                        checked={attend === opt}
                        onChange={() => setAttend(opt)}
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
                {errors.kehadiran && <span className="field-error">{errors.kehadiran}</span>}
              </fieldset>

              <div className="field">
                <label htmlFor="rsvp-jumlah">Jumlah Tamu</label>
                <select
                  id="rsvp-jumlah"
                  name="jumlah"
                  defaultValue="1"
                  disabled={attend === "Tidak dapat hadir"}
                  aria-invalid={!!errors.jumlah}
                >
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>
                      {n} orang
                    </option>
                  ))}
                </select>
                {errors.jumlah && <span className="field-error">{errors.jumlah}</span>}
              </div>

              <div className="field">
                <label htmlFor="rsvp-ucapan">Ucapan atau Doa</label>
                <textarea
                  id="rsvp-ucapan"
                  name="ucapan"
                  rows={4}
                  maxLength={500}
                  placeholder="Tuliskan ucapan atau doa untuk kedua mempelai"
                  aria-invalid={!!errors.ucapan}
                />
                {errors.ucapan && <span className="field-error">{errors.ucapan}</span>}
              </div>

              <button type="submit" className="btn btn--primary form-submit" disabled={sending}>
                <Send size={16} strokeWidth={1.6} aria-hidden="true" />
                {sending ? "MENGIRIM..." : "KIRIM KONFIRMASI"}
              </button>

              <div aria-live="polite">
                {status === "success" && (
                  <p className="form-msg form-msg--ok">
                    Terima kasih, konfirmasi Anda telah berhasil dikirim.
                  </p>
                )}
                {status === "error" && (
                  <p className="form-msg form-msg--err">
                    Konfirmasi belum terkirim. Periksa koneksi internet Anda lalu coba kembali.
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
