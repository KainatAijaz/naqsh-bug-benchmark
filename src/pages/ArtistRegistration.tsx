import { useState, useRef, useEffect } from "react";
import { Upload, X, Plus, Check, CreditCard } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import RevealOnScroll from "@/components/RevealOnScroll";
import GoldLine from "@/components/GoldLine";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const steps = ["You", "Your Art", "Your Craft", "Your Time", "Activate"];
const stepCopy = [
  { headline: "Let the world discover your art", sub: "Tell us who you are — your name, your city, your story" },
  { headline: "Show them what your hands can do", sub: "Upload your finest work — let your portfolio speak" },
  { headline: "Set the value of your artistry", sub: "Price your packages with confidence" },
  { headline: "When can the magic happen?", sub: "Set your availability so clients can find you" },
  { headline: "Activate your presence", sub: "A one-time fee of 50 AED to go live on Naqsh" },
];

const specialties = ["Bridal Henna", "Arabic Henna", "Indo-Pak Traditional", "Minimalist", "Fusion"];

const inputCls = "w-full bg-white border border-border rounded-md px-4 py-3 text-sm font-sans text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary/50 transition-all";
const labelCls = "font-sans text-xs font-semibold tracking-[0.08em] text-foreground/75 uppercase mb-2 block";

const ArtistRegistration = () => {
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<{ file: File; preview: string }[]>([]);
  const [uploading, setUploading] = useState(false);
  const [createdArtistId, setCreatedArtistId] = useState<string | null>(null);
  const [paymentPending, setPaymentPending] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const paymentStatus = searchParams.get("payment");
    const artistId = searchParams.get("artist_id");
    if (paymentStatus === "success" && artistId) {
      supabase.functions.invoke("verify-artist-payment", {
        body: { artist_id: artistId, payment_type: "registration" },
      }).then(({ data }) => {
        if (data?.verified) setSubmitted(true);
      });
    }
  }, [searchParams]);

  const [form, setForm] = useState({
    name: "",
    city: "",
    country: "",
    phone: "",
    bio: "",
    specialty: specialties[0],
    packages: [
      { name: "Simple", price: "", duration: "" },
      { name: "Full Hand", price: "", duration: "" },
      { name: "Bridal", price: "", duration: "" },
    ],
    days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
  });

  const next = () => step < 4 && setStep(step + 1);
  const prev = () => step > 0 && setStep(step - 1);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const remaining = 10 - uploadedFiles.length;
    const toAdd = files.slice(0, remaining);
    const newFiles = toAdd.map((file) => ({ file, preview: URL.createObjectURL(file) }));
    setUploadedFiles((prev) => [...prev, ...newFiles]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.city.trim() || !form.country.trim()) {
      toast({ title: "Missing info", description: "Please fill in your name, city, and country.", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      const prices = form.packages.map((p) => parseInt(p.price)).filter((p) => !isNaN(p) && p > 0);
      const priceFrom = prices.length > 0 ? Math.min(...prices) : 0;

      const { data: artist, error: artistError } = await supabase
        .from("artists")
        .insert({
          name: form.name.trim(),
          city: form.city.trim(),
          country: form.country.trim(),
          phone: form.phone.trim() || null,
          bio: form.bio.trim() || null,
          specialty: form.specialty,
          price_from: priceFrom,
          is_available_today: form.days.length > 0,
        })
        .select()
        .single();

      if (artistError) throw artistError;

      if (uploadedFiles.length > 0 && artist) {
        setUploading(true);
        for (const { file } of uploadedFiles) {
          const ext = file.name.split(".").pop();
          const path = `${artist.id}/${crypto.randomUUID()}.${ext}`;
          const { error: uploadError } = await supabase.storage.from("portfolio").upload(path, file);
          if (uploadError) { console.error("Upload error:", uploadError); continue; }
          const { data: urlData } = supabase.storage.from("portfolio").getPublicUrl(path);
          await supabase.from("portfolio_images").insert({ artist_id: artist.id, image_url: urlData.publicUrl, style_tag: form.specialty });
        }
        setUploading(false);
      }

      setCreatedArtistId(artist.id);
      setStep(4);
    } catch (err: any) {
      console.error("Submit error:", err);
      toast({ title: "Error", description: err.message || "Something went wrong", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const handlePayment = async () => {
    if (!createdArtistId) return;
    setPaymentPending(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-artist-payment", {
        body: { payment_type: "registration", artist_id: createdArtistId, email: form.phone || undefined },
      });
      if (error) throw error;
      if (data?.url) window.open(data.url, "_blank");
    } catch (err: any) {
      toast({ title: "Payment error", description: err.message, variant: "destructive" });
    } finally {
      setPaymentPending(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-8 bg-background">
        <div className="text-center max-w-lg">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-8">
            <Check size={32} className="text-primary" />
          </div>
          <h1 className="font-serif text-5xl md:text-6xl font-light text-foreground italic mb-6">Welcome to Naqsh</h1>
          <p className="font-sans text-base text-muted-foreground mb-4">
            Your artist profile has been created. Our team will review and verify your profile shortly.
          </p>
          <p className="font-sans text-sm text-muted-foreground/70 mb-12">
            You'll be notified once your profile is live.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/" className="btn-gold">Back to Home</Link>
            <Link to="/artists" className="font-sans text-sm tracking-[0.15em] text-primary uppercase hover:text-primary/70 transition-colors flex items-center">
              Browse Artists →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background pt-28">
      {/* Progress bar */}
      <div className="fixed top-20 left-0 right-0 z-40 h-[3px] bg-border">
        <div
          className="h-full bg-primary transition-all duration-700 ease-out"
          style={{ width: `${((step + 1) / 5) * 100}%` }}
        />
      </div>

      <div className="flex-1 flex items-center justify-center px-4 md:px-8 py-16">
        <div className="w-full max-w-2xl">
          <RevealOnScroll key={step}>

            {/* Step header */}
            <div className="text-center mb-10">
              {/* Step pill indicators */}
              <div className="flex justify-center gap-2 md:gap-4 mb-8 flex-wrap">
                {steps.map((s, i) => (
                  <span
                    key={s}
                    className={`font-sans text-xs font-semibold tracking-[0.12em] uppercase transition-all duration-500 px-3 py-1 rounded-full ${
                      i === step
                        ? "bg-primary text-white"
                        : i < step
                        ? "bg-primary/15 text-primary"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {s}
                  </span>
                ))}
              </div>
              <h1 className="font-serif text-4xl md:text-5xl font-light text-foreground italic mb-3">
                {stepCopy[step].headline}
              </h1>
              <p className="font-sans text-sm text-muted-foreground">{stepCopy[step].sub}</p>
            </div>

            {/* Form card */}
            <div className="card-luxury p-8 md:p-10">

              {/* ── Step 0: Personal Info ── */}
              {step === 0 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className={labelCls}>Full Name</label>
                      <input
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Your full name"
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Phone</label>
                      <input
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="+971 50 000 0000"
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>City</label>
                      <input
                        value={form.city}
                        onChange={(e) => setForm({ ...form, city: e.target.value })}
                        placeholder="Dubai"
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Country</label>
                      <input
                        value={form.country}
                        onChange={(e) => setForm({ ...form, country: e.target.value })}
                        placeholder="UAE"
                        className={inputCls}
                      />
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>Specialty</label>
                    <select
                      value={form.specialty}
                      onChange={(e) => setForm({ ...form, specialty: e.target.value })}
                      className={inputCls}
                    >
                      {specialties.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Your Story</label>
                    <textarea
                      value={form.bio}
                      onChange={(e) => setForm({ ...form, bio: e.target.value })}
                      rows={4}
                      placeholder="Share your henna journey — what inspires you, what makes your work unique..."
                      className={`${inputCls} resize-none`}
                    />
                  </div>
                </div>
              )}

              {/* ── Step 1: Portfolio Upload ── */}
              {step === 1 && (
                <div className="space-y-6">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    className="hidden"
                    onChange={handleFileSelect}
                  />
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-border hover:border-primary/50 rounded-lg p-12 text-center cursor-pointer transition-colors group"
                  >
                    <Upload size={32} className="mx-auto text-primary/60 group-hover:text-primary transition-colors mb-4" />
                    <p className="font-sans text-sm font-medium text-foreground mb-1">
                      Click to upload your portfolio
                    </p>
                    <p className="font-sans text-xs text-muted-foreground">
                      JPG, PNG, WEBP · up to 5MB each · max 10 photos
                    </p>
                  </div>
                  {uploadedFiles.length > 0 && (
                    <div className="grid grid-cols-4 md:grid-cols-5 gap-3">
                      {uploadedFiles.map((f, i) => (
                        <div key={i} className="aspect-square rounded-md overflow-hidden relative group border border-border">
                          <img src={f.preview} alt={`Upload ${i + 1}`} className="w-full h-full object-cover" />
                          <button
                            onClick={() => removeFile(i)}
                            className="absolute top-1 right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={10} className="text-white" />
                          </button>
                        </div>
                      ))}
                      {uploadedFiles.length < 10 && (
                        <div
                          onClick={() => fileInputRef.current?.click()}
                          className="aspect-square rounded-md border-2 border-dashed border-border hover:border-primary/40 flex items-center justify-center cursor-pointer transition-colors"
                        >
                          <Plus size={18} className="text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* ── Step 2: Packages / Pricing ── */}
              {step === 2 && (
                <div className="space-y-5">
                  {form.packages.map((pkg, i) => (
                    <div key={pkg.name} className="rounded-lg border border-border p-6 bg-muted/40">
                      <h3 className="font-serif text-lg font-medium text-foreground mb-4">{pkg.name}</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className={labelCls}>Price (USD)</label>
                          <input
                            value={pkg.price}
                            onChange={(e) => {
                              const pkgs = [...form.packages];
                              pkgs[i] = { ...pkgs[i], price: e.target.value };
                              setForm({ ...form, packages: pkgs });
                            }}
                            placeholder="150"
                            type="number"
                            className={inputCls}
                          />
                        </div>
                        <div>
                          <label className={labelCls}>Duration</label>
                          <input
                            value={pkg.duration}
                            onChange={(e) => {
                              const pkgs = [...form.packages];
                              pkgs[i] = { ...pkgs[i], duration: e.target.value };
                              setForm({ ...form, packages: pkgs });
                            }}
                            placeholder="2 hours"
                            className={inputCls}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* ── Step 3: Availability ── */}
              {step === 3 && (
                <div className="space-y-10">
                  <div>
                    <label className={labelCls}>Available Days</label>
                    <div className="flex flex-wrap gap-3 mt-3">
                      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                        <button
                          key={d}
                          onClick={() => {
                            const days = form.days.includes(d)
                              ? form.days.filter((x) => x !== d)
                              : [...form.days, d];
                            setForm({ ...form, days });
                          }}
                          className={`font-sans text-sm font-medium tracking-[0.06em] uppercase px-5 py-2.5 rounded-md border transition-all duration-200 ${
                            form.days.includes(d)
                              ? "bg-primary text-white border-primary"
                              : "border-border text-foreground/70 bg-white hover:border-primary/40 hover:bg-primary/5"
                          }`}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="text-center py-6 border-t border-border">
                    <div className="font-serif text-4xl text-primary/30 mb-3">✦</div>
                    <h3 className="font-serif text-2xl font-light italic text-foreground mb-2">You're ready</h3>
                    <p className="font-sans text-sm text-muted-foreground">
                      Review your profile and step into the world of Naqsh
                    </p>
                  </div>
                </div>
              )}

              {/* ── Step 4: Payment ── */}
              {step === 4 && (
                <div className="space-y-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                    <CreditCard size={24} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-serif text-3xl font-light italic text-foreground mb-3">One Last Step</h3>
                    <p className="font-sans text-sm text-foreground/80 mb-2">
                      Your profile has been saved! To go live on Naqsh, a one-time activation fee of{" "}
                      <span className="text-primary font-semibold">50 AED</span> is required.
                    </p>
                    <p className="font-sans text-xs text-muted-foreground">
                      Covers profile verification, platform listing, and priority support.
                    </p>
                  </div>
                  <div className="rounded-lg border border-border p-6 text-left max-w-sm mx-auto bg-muted/30">
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-sans text-sm font-medium text-foreground/70">Registration Fee</span>
                      <span className="font-serif text-2xl text-primary font-light">50 AED</span>
                    </div>
                    <GoldLine />
                    <ul className="space-y-2.5 mt-4">
                      {["Verified artist badge", "Listed on Naqsh marketplace", "Booking management dashboard", "WhatsApp notifications"].map((f) => (
                        <li key={f} className="flex items-center gap-2.5 font-sans text-sm text-foreground/75">
                          <Check size={14} className="text-primary shrink-0" /> {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <button onClick={handlePayment} disabled={paymentPending} className="btn-gold">
                    {paymentPending ? "Redirecting to payment..." : "Pay 50 AED & Go Live"}
                  </button>
                  <p className="font-sans text-xs text-muted-foreground">Secure payment via Stripe</p>
                </div>
              )}
            </div>

            {/* Navigation buttons */}
            <div className="flex justify-between items-center mt-8">
              <button
                onClick={prev}
                disabled={step === 0 || step === 4}
                className="font-sans text-sm font-medium text-muted-foreground hover:text-foreground disabled:opacity-0 transition-all flex items-center gap-2"
              >
                ← Back
              </button>
              {step < 3 ? (
                <button onClick={next} className="btn-gold">Continue</button>
              ) : step === 3 ? (
                <button onClick={handleSubmit} disabled={submitting} className="btn-gold">
                  {submitting ? (uploading ? "Uploading images..." : "Submitting...") : "Submit & Continue"}
                </button>
              ) : null}
            </div>

          </RevealOnScroll>
        </div>
      </div>
    </div>
  );
};

export default ArtistRegistration;
