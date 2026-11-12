/**
 * Semua data undangan ada di sini. Ubah di file ini untuk mengganti
 * nama, tanggal, lokasi, rekening, foto, dan musik.
 */
export const wedding = {
  groom: {
    fullName: "WALID FAHRIZAL",
    nickname: "RIZAL",
    initial: "W",
    title: "Putra dari",
  },
  bride: {
    fullName: "SILVI LUPIATUN NISAK",
    nickname: "SILVI",
    initial: "S",
    title: "Putri dari",
  },

  // Tanggal tampilan
  dateLong: "Rabu, 6 Januari 2027",
  dateShort: "6 JANUARI 2027",
  // Waktu target countdown (ISO 8601 + zona waktu WIB = +07:00)
  countdownTarget: "2027-01-06T09:00:00+07:00",

  events: [
    {
      key: "akad",
      title: "Akad Nikah",
      time: "Pukul 09.00 WIB",
    },
    {
      key: "resepsi",
      title: "Resepsi",
      time: "Pukul 10.00 WIB – selesai",
    },
  ],

  mapsUrl: "https://maps.app.goo.gl/s7b11STDuYhthPAW9",

  accounts: [
    { bank: "BCA", holder: "WALID FAHRIZAL", number: "0312722567" },
    { bank: "BNI", holder: "SILVI LUPIATUN NISAK", number: "1232656336" },
  ],

  // Path relatif terhadap folder /public
  mainPhoto: "/images/foto-utama.jpg",
  gallery: [
    { src: "/images/foto-galeri-1.jpg", alt: "Foto galeri pertama" },
    { src: "/images/foto-galeri-2.jpg", alt: "Foto galeri kedua" },
    { src: "/images/foto-galeri-3.jpg", alt: "Foto galeri ketiga" },
  ],
  music: "/music/musik-undangan.mp3",

  // Nama form Netlify (harus sama dengan form statis di index.html)
  forms: {
    rsvp: "rsvp",
    guestbook: "guestbook",
  },
} as const;

export const navItems = [
  { id: "home", label: "Home" },
  { id: "mempelai", label: "Mempelai" },
  { id: "acara", label: "Acara" },
  { id: "galeri", label: "Galeri" },
  { id: "gift", label: "Gift" },
  { id: "rsvp", label: "RSVP" },
] as const;
