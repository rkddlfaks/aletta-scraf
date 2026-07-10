import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/storefront/ProductCard";
import { ArrowRight, Stethoscope, Heart, ShieldCheck, Star } from "lucide-react";
import { FadeUp, FadeIn, StaggerContainer, StaggerItem } from "@/components/storefront/ScrollReveal";
import { TopPromoTicker } from "@/components/storefront/TopPromoTicker";

export default async function HomePage() {
  const setting = await prisma.storeSetting.findFirst();
  const featuredProducts = await prisma.product.findMany({
    where: { is_active: true, category: { not: "Mukena Premium" } },
    take: 4,
    orderBy: { created_at: 'desc' },
    include: { images: true }
  });

  const dbTestimonials = await prisma.testimonial.findMany({
    where: { is_approved: true },
    orderBy: { created_at: 'desc' },
    take: 3
  });

  const dummyTestimonials = [
    {
      id: "dummy-1",
      customer_name: "dr. Sarah A.",
      role: "Dokter Umum, RSUD",
      initial: "dr. S",
      rating: 5,
      content: "Awalnya ragu, ternyata lubang telinganya pas banget buat masukin stetoskop. Kerudung tetap rapi, nggak perlu ditarik-tarik lagi ke atas. Nyaman dipakai jaga malam!"
    },
    {
      id: "dummy-2",
      customer_name: "Ners. Fitri",
      role: "Perawat IGD",
      initial: "N. F",
      rating: 5,
      content: "Beli 3 warna buat ganti-ganti pas dinas. Bahannya adem banget, nggak bikin gerah walau aktivitas lagi padat-padatnya di IGD. Suka banget!"
    },
    {
      id: "dummy-3",
      customer_name: "dr. Dinda",
      role: "Residen Anak",
      initial: "dr. D",
      rating: 5,
      content: "Bagus bangeeeet jahitan super rapi. Kemasannya juga cantik, cocok buat kado temen sejawat yang baru disumpah dokter."
    }
  ];

  const testimonials = [...dbTestimonials];
  let i = 0;
  while (testimonials.length < 3 && i < dummyTestimonials.length) {
    testimonials.push(dummyTestimonials[i] as any);
    i++;
  }

  return (
    <div className="flex flex-col w-full overflow-hidden">
      {/* Hero Section */}
      <section className="relative bg-pink-50 pt-32 pb-20 lg:pt-40 lg:pb-24 overflow-hidden min-h-[90vh] flex items-center">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            <div className="max-w-2xl pt-10 lg:pt-0">

              <FadeUp delay={0.3}>
                <h1 className="text-5xl md:text-7xl font-serif font-bold text-pink-900 leading-tight mb-6">
                  Hijab Stetoskop Premium
                </h1>
              </FadeUp>
              
              <FadeUp delay={0.5}>
                <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-xl leading-relaxed">
                  Inovasi lubang telinga yang dirancang khusus agar pemakaian stetoskop menjadi lebih mudah, rapi, dan cepat tanpa perlu melepas hijab.
                </p>
              </FadeUp>
              
              <FadeUp delay={0.7}>
                <div className="flex flex-wrap gap-4">
                  <Link href="#koleksi" className="bg-pink-700 hover:bg-pink-800 text-white px-8 py-4 rounded-full font-bold transition-all shadow-lg hover:shadow-pink-700/30 hover:-translate-y-1 flex items-center gap-2 text-lg">
                    Lihat Koleksi <ArrowRight size={20} />
                  </Link>
                </div>
              </FadeUp>
            </div>

            <FadeIn delay={0.9} className="relative w-full h-[500px] lg:h-[650px] flex items-end justify-center">
              {featuredProducts.length > 0 && featuredProducts[0].images.length > 0 ? (
                <div className="w-full h-full relative">
                  <img 
                    src={featuredProducts[0].images[0].url} 
                    alt="Model Scarf"
                    className="w-full h-full object-contain object-bottom mix-blend-multiply [mask-image:linear-gradient(to_top,rgba(0,0,0,1)_30%,rgba(0,0,0,0)_100%)] md:[mask-image:radial-gradient(circle_at_center,rgba(0,0,0,1)_40%,rgba(0,0,0,0)_80%)] opacity-95"
                  />
                </div>
              ) : (
                <img 
                  src="/hero-medis.png" 
                  alt="Dokter mengenakan Hijab Medis Aletta Scarf" 
                  className="w-full h-full object-contain object-bottom mix-blend-multiply [mask-image:linear-gradient(to_top,rgba(0,0,0,1)_30%,rgba(0,0,0,0)_100%)] md:[mask-image:radial-gradient(circle_at_center,rgba(0,0,0,1)_45%,rgba(0,0,0,0)_75%)] opacity-95"
                />
              )}
            </FadeIn>
          </div>
        </div>
        
        {/* Decorative background shape with FadeIn */}
        <FadeIn delay={0.8} className="absolute top-0 right-0 w-2/3 md:w-1/2 h-full -z-10">
          <div className="w-full h-full bg-gradient-to-l from-pink-200/60 to-transparent rounded-l-full blur-3xl opacity-60 translate-x-1/4"></div>
        </FadeIn>
      </section>

      {/* Promo Ticker */}
      <TopPromoTicker setting={setting} />

      {/* Featured Products */}
      <section id="koleksi" className="py-24 bg-gray-50/50">
        <div className="container mx-auto px-4">
          <FadeUp className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block text-pink-600 font-bold tracking-wider text-sm uppercase mb-4 bg-pink-100/50 px-5 py-2 rounded-full border border-pink-100">
              Spesial Untuk Anda
            </span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6">Koleksi Terbaru</h2>
            <p className="text-gray-600 text-lg">Temukan inovasi hijab medis dan aksesoris terbaru yang dirancang khusus untuk kenyamanan para profesional.</p>
          </FadeUp>
          
          <div className="flex overflow-x-auto pb-12 -mx-4 px-[calc(50vw-140px)] sm:px-[calc(50vw-150px)] snap-x snap-mandatory gap-6 lg:grid lg:grid-cols-4 lg:overflow-visible lg:pb-0 lg:mx-0 lg:px-0 lg:gap-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
            {featuredProducts.map((product, index) => (
              <FadeUp key={product.id} delay={0.1 * (index + 1)} className="w-[280px] sm:w-[300px] lg:w-auto snap-center shrink-0 h-full flex">
                <div className="w-full h-full flex flex-col">
                  <ProductCard product={product} />
                </div>
              </FadeUp>
            ))}
          </div>
          
          <FadeUp delay={0.5} className="mt-10 md:mt-16 text-center">
            <Link href="/produk" className="inline-flex items-center justify-center gap-2 text-pink-700 hover:text-white font-bold bg-white hover:bg-pink-700 px-8 py-4 rounded-full transition-all shadow-sm border border-pink-100 hover:shadow-lg">
              Lihat Semua Koleksi <ArrowRight size={20} />
            </Link>
          </FadeUp>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 md:py-32 bg-gray-50 border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeUp>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-gray-900 mb-6">Pertanyaan seputar aletta scraf</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">Jawaban cepat untuk keraguan Anda sebelum berbelanja.</p>
            </div>
          </FadeUp>

          <StaggerContainer className="space-y-4">
            {[
              {
                q: "Apakah bahan hijabnya menerawang?",
                a: "Sama sekali tidak. Aletta menggunakan bahan Voal Premium yang rapat namun sangat bernapas (breathable), didesain khusus agar nyaman dan menutupi rambut dengan sempurna."
              },
              {
                q: "Bagaimana jika pesanan saya rusak saat sampai?",
                a: "Tenang saja! Semua produk kami melewati 2x Quality Control. Namun jika ada cacat/rusak dalam pengiriman, silakan chat WhatsApp Admin, kami ganti 100% baru tanpa biaya tambahan."
              },
              {
                q: "Berapa lama waktu pengirimannya?",
                a: "Pesanan yang masuk sebelum jam 15.00 WIB akan dikirim di hari yang sama. Estimasi sampai biasanya 1-3 hari kerja untuk Jabodetabek, dan 3-5 hari untuk luar pulau."
              },
              {
                q: "Apakah bisa bayar di tempat (COD)?",
                a: "Saat ini kami menerima pembayaran via Transfer Bank (BCA, Mandiri) dan e-Wallet (GoPay, OVO). Untuk COD tidak bisa ya kak."
              }
            ].map((faq, i) => (
              <StaggerItem key={i}>
                <details className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer open:ring-1 open:ring-pink-200 transition-all">
                  <summary className="flex items-center justify-between p-6 font-bold text-gray-900 list-none">
                    {faq.q}
                    <span className="transition group-open:rotate-180">
                      <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                    </span>
                  </summary>
                  <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                    {faq.a}
                  </div>
                </details>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-white relative">
        <div className="container mx-auto px-4">
          <FadeUp className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-pink-900 mb-4">Mengapa Memilih Kami?</h2>
            <p className="text-gray-600 text-lg">Desain yang memadukan kepatuhan berhijab dengan tuntutan profesional medis.</p>
          </FadeUp>

          <FadeUp delay={0.2}>
            <div className="flex overflow-x-auto pb-10 -mx-4 px-4 snap-x snap-mandatory gap-4 md:grid md:grid-cols-3 md:overflow-visible md:pb-0 md:mx-0 md:px-0 md:gap-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] items-stretch">
              
              <div className="w-[85vw] md:w-auto snap-center shrink-0 flex">
                <div className="flex flex-col items-center text-center p-8 rounded-3xl bg-pink-50/50 hover:bg-pink-50 transition-colors w-full h-auto border border-pink-100/50 justify-start">
                  <div className="w-20 h-20 bg-white shadow-sm rounded-full flex items-center justify-center text-pink-600 mb-6 shrink-0">
                    <Stethoscope size={36} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-xl font-bold font-serif text-gray-900 mb-3">Inovasi Lubang Telinga</h3>
                  <p className="text-gray-600 leading-relaxed whitespace-normal break-words">Akses instan dan mudah menggunakan stetoskop tanpa mengorbankan kerapian hijab saat bertugas.</p>
                </div>
              </div>

              <div className="w-[85vw] md:w-auto snap-center shrink-0 flex">
                <div className="flex flex-col items-center text-center p-8 rounded-3xl bg-pink-50/50 hover:bg-pink-50 transition-colors w-full h-auto border border-pink-100/50 justify-start">
                  <div className="w-20 h-20 bg-white shadow-sm rounded-full flex items-center justify-center text-pink-600 mb-6 shrink-0">
                    <Heart size={36} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-xl font-bold font-serif text-gray-900 mb-3">Bahan Premium</h3>
                  <p className="text-gray-600 leading-relaxed whitespace-normal break-words">Material yang sejuk, mudah menyerap keringat, dan sangat nyaman dipakai seharian penuh saat dinas panjang.</p>
                </div>
              </div>

              <div className="w-[85vw] md:w-auto snap-center shrink-0 flex">
                <div className="flex flex-col items-center text-center p-8 rounded-3xl bg-pink-50/50 hover:bg-pink-50 transition-colors w-full h-auto border border-pink-100/50 justify-start">
                  <div className="w-20 h-20 bg-white shadow-sm rounded-full flex items-center justify-center text-pink-600 mb-6 shrink-0">
                    <ShieldCheck size={36} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-xl font-bold font-serif text-gray-900 mb-3">Kualitas Terjamin</h3>
                  <p className="text-gray-600 leading-relaxed whitespace-normal break-words">Jahitan sangat rapi dengan quality control yang ketat untuk memastikan kepuasan dan keawetan produk.</p>
                </div>
              </div>

            </div>
          </FadeUp>
        </div>
      </section>

      {/* Social Proof / Reviews */}
      <section className="py-24 bg-pink-900 text-white relative overflow-hidden">
        {/* Decorative background blur */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-pink-600/30 blur-[100px] rounded-full translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-800/50 blur-[100px] rounded-full -translate-x-1/3 translate-y-1/3"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <FadeUp className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block text-pink-200 font-bold tracking-wider text-sm uppercase mb-4">
              Lebih Dari 5.000+ Tenaga Medis Percaya
            </span>
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6">Apa Kata Mereka?</h2>
          </FadeUp>
          
          <div className="flex overflow-x-auto pb-12 -mx-4 px-[calc(50vw-150px)] sm:px-[calc(50vw-175px)] snap-x snap-mandatory gap-4 md:grid md:grid-cols-3 md:overflow-visible md:pb-0 md:mx-0 md:px-0 md:gap-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
            {testimonials.map((t: any, index) => {
              const isCenter = index === 1;
              const initial = t.initial || (t.customer_name ? t.customer_name.substring(0, 2).toUpperCase() : "U");
              
              return (
                <FadeUp key={t.id} delay={0.2 + (index * 0.2)} className="w-[300px] sm:w-[350px] md:w-auto snap-center shrink-0 h-full">
                  <div className={`p-6 md:p-8 rounded-3xl h-full flex flex-col ${isCenter ? 'bg-white border-2 border-pink-300 relative shadow-2xl shadow-pink-900/50 md:scale-105 z-10 text-gray-900' : 'bg-white/10 backdrop-blur-md border border-white/20 text-pink-50'}`}>
                    {isCenter && (
                      <div className="absolute top-0 right-6 md:right-8 -translate-y-1/2 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full">Best Seller</div>
                    )}
                    <div className="flex text-amber-400 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={18} className={i < t.rating ? "fill-current" : "text-gray-300"} />
                      ))}
                    </div>
                    <p className={`text-sm md:text-base leading-relaxed italic mb-8 flex-1 ${isCenter ? 'text-gray-600' : 'text-pink-50'}`}>"{t.content}"</p>
                    <div className={`flex items-center gap-3 border-t pt-4 ${isCenter ? 'border-gray-100' : 'border-white/10'}`}>
                      <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-bold text-base md:text-lg shrink-0 ${isCenter ? 'bg-pink-100 text-pink-700' : 'bg-pink-800 text-white'}`}>
                        {initial}
                      </div>
                      <div>
                        <div className={`font-bold text-sm md:text-base ${isCenter ? 'text-gray-900' : 'text-white'}`}>{t.customer_name}</div>
                        <div className={`text-[10px] md:text-xs ${isCenter ? 'text-gray-500' : 'text-pink-200'}`}>{t.role} - Verified Buyer</div>
                      </div>
                    </div>
                  </div>
                </FadeUp>
              );
            })}
          </div>
        </div>
      </section>


    </div>
  );
}
