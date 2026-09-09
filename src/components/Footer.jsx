import { Link } from "react-router-dom";
import { useLanguage } from "../i18n/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="bg-[#0A0A0A] text-white border-t border-white/10">
      {/* Trust bar */}
      <div className="border-b border-white/10 bg-black">
        <div className="container-luxury grid grid-cols-2 md:grid-cols-4 gap-8 py-8 text-center">
          <TrustItem icon={<SupportIcon />} title={t("footer.support")} subtitle={t("footer.supportSub")} />
          <TrustItem icon={<SecureIcon />} title={t("footer.secured")} subtitle={t("footer.securedSub")} />
          <TrustItem icon={<ReturnIcon />} title={t("footer.returns")} subtitle={t("footer.returnsSub")} />
          <TrustItem icon={<ShippingIcon />} title={t("footer.freeShipping")} subtitle={t("footer.freeShippingSub")} />
        </div>
      </div>

      <div className="container-luxury py-14">
        {/* 3 columns now - newsletter removed */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
          {/* Contact */}
          <div>
            <h3 className="font-playfair text-[17px] mb-4 text-[#C9A86A]">{t("footer.contact")}</h3>
            <div className="space-y-3 text-sm text-white/70">
              <p className="flex items-start gap-2">
                <span className="mt-1 text-[#C9A86A]">
                  <PhoneIcon />
                </span>
                <span>
                  {t("footer.needHelp")}
                  <br />
                  <a
                    href={`tel:+${import.meta.env.VITE_WHATSAPP_NUMBER || "212664677347"}`}
                    className="text-white font-semibold text-base hover:text-[#C9A86A]"
                  >
                    +212 664-677347
                  </a>
                </span>
              </p>
              <p>
                {t("footer.hours")}: {t("footer.open")}
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:text-center">
            <h3 className="font-playfair text-[17px] mb-4 text-[#C9A86A]">{t("footer.quickLinks")}</h3>
            <ul className="space-y-2.5 text-sm text-white/70">
              <li>
                <Link to="/" className="hover:text-[#C9A86A]">
                  {t("nav.home")}
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-[#C9A86A]">
                  {t("nav.shop")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Brand - uses provided gold logo - 50% bigger then 25% smaller = 72px */}
          <div className="text-center md:text-right">
            <img
              src="/logo.svg"
              alt="Al Meknassi Bijoux"
              className="h-[100px] w-auto object-contain mx-auto md:ml-auto md:mr-0"
            />
            <p className="text-sm text-white/60 mt-4 leading-relaxed">
              {t("footer.brandDesc")
                .split("<br/>")
                .map((part, i, arr) => (
                  <span key={i}>
                    {part}
                    {i < arr.length - 1 && <br />}
                  </span>
                ))}
            </p>
            <div className="flex gap-3 mt-6 justify-center md:justify-end">
              <SocialLink href="https://www.instagram.com/almeknassi1?igsi=ZDNlZDc0MzIxNw==">
                <InstagramIcon />
              </SocialLink>
              <SocialLink href="https://www.facebook.com/share/195AwDmTGq/">
                <FacebookIcon />
              </SocialLink>
              <SocialLink href="https://www.tiktok.com">
                <TikTokIcon />
              </SocialLink>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/50">
          <p>{t("footer.copyright")}</p>
          <div className="flex gap-5">
            <Link to="/" className="hover:text-[#C9A86A]">
              {t("footer.payment")}
            </Link>
            <Link to="/" className="hover:text-[#C9A86A]">
              {t("footer.shippingReturns")}
            </Link>
            <Link to="/" className="hover:text-[#C9A86A]">
              {t("footer.giftCards")}
            </Link>
            <span className="hover:text-[#C9A86A] cursor-default">{t("footer.privacy")}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function TrustItem({ icon, title, subtitle }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="text-[#C9A86A]">{icon}</div>
      <p className="text-sm font-medium text-white">{title}</p>
      <p className="text-xs text-white/60">{subtitle}</p>
    </div>
  );
}
function SocialLink({ children, href }) {
  const isExternal = href.startsWith("http");
  return (
    <a
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className="w-9 h-9 border border-white/15 flex items-center justify-center hover:border-[#C9A86A] hover:bg-[#C9A86A] hover:text-black transition-all text-white/70"
    >
      {children}
    </a>
  );
}
function SupportIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
      <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
      <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z" />
      <path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
    </svg>
  );
}
function SecureIcon() {
  return (
    <img src="https://i.ibb.co/qMFMhRRv/lock.png" alt="secured payment" width="28" height="28" loading="lazy" decoding="async" className="w-7 h-7 object-contain" />
  );
}
function ReturnIcon() {
  return (
    <img src="https://i.ibb.co/WWx00nJQ/badge.png" alt="returns" width="28" height="28" loading="lazy" decoding="async" className="w-7 h-7 object-contain" />
  );
}
function ShippingIcon() {
  return (
    <img src="https://i.ibb.co/wFPQrH3p/delivery-truck.png" alt="shipping" width="28" height="28" loading="lazy" decoding="async" className="w-7 h-7 object-contain" />
  );
}
function PhoneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7l.4 3a2 2 0 0 1-.6 1.7L7.1 10a16 16 0 0 0 6 6l1.6-1.8a2 2 0 0 1 1.7-.6l3 .4A2 2 0 0 1 21 16v.9z" />
    </svg>
  );
}
function InstagramIcon() {
  return (
    <img src="https://i.ibb.co/Ld9f7tdy/instagram.png" alt="instagram" width="17" height="17" loading="lazy" decoding="async" className="w-[17px] h-[17px] object-contain" />
  );
}
function FacebookIcon() {
  return (
    <img src="https://i.ibb.co/DDk9hc27/facebook.png" alt="facebook" width="17" height="17" loading="lazy" decoding="async" className="w-[17px] h-[17px] object-contain" />
  );
}
function TikTokIcon() {
  return (
    <img src="https://i.ibb.co/2YKNsQsb/tiktok.png" alt="tiktok" width="17" height="17" loading="lazy" decoding="async" className="w-[17px] h-[17px] object-contain" />
  );
}
