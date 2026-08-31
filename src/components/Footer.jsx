import { Link } from "react-router-dom";
import { useLanguage } from "../i18n/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="bg-[#F9F9F7] border-t border-border">
      {/* Trust bar */}
      <div className="border-b border-border bg-white">
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
            <h4 className="font-playfair text-[17px] mb-4">{t("footer.contact")}</h4>
            <div className="space-y-3 text-sm text-secondary">
              <p className="flex items-start gap-2">
                <span className="mt-1">
                  <PhoneIcon />
                </span>
                <span>
                  {t("footer.needHelp")}
                  <br />
                  <a
                    href={`tel:+${import.meta.env.VITE_WHATSAPP_NUMBER || "212664677347"}`}
                    className="text-primary font-semibold text-base hover:text-accent"
                  >
                    +212 664-677347
                  </a>
                </span>
              </p>
              <p>{t("footer.email")}: simobouki198@gmail.com</p>
              <p>
                {t("footer.hours")}: {t("footer.open")}
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:text-center">
            <h4 className="font-playfair text-[17px] mb-4">{t("footer.quickLinks")}</h4>
            <ul className="space-y-2.5 text-sm text-secondary">
              <li>
                <Link to="/" className="hover:text-accent">
                  {t("nav.home")}
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-accent">
                  {t("nav.shop")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Brand - uses provided gold logo */}
          <div className="text-center md:text-right">
            <img
              src="/logo.svg"
              alt="Al Meknassi Bijoux"
              className="h-[64px] w-auto object-contain mx-auto md:ml-auto md:mr-0"
            />
            <p className="text-sm text-secondary mt-4 leading-relaxed" dangerouslySetInnerHTML={{ __html: t("footer.brandDesc") }} />
            <div className="flex gap-3 mt-6 justify-center md:justify-end">
              <SocialLink href="#">
                <InstagramIcon />
              </SocialLink>
              <SocialLink href="#">
                <FacebookIcon />
              </SocialLink>
              <SocialLink href="#">
                <PinterestIcon />
              </SocialLink>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-secondary">
          <p>{t("footer.copyright")}</p>
          <div className="flex gap-5">
            <Link to="/" className="hover:text-primary">
              {t("footer.payment")}
            </Link>
            <Link to="/" className="hover:text-primary">
              {t("footer.shippingReturns")}
            </Link>
            <Link to="/" className="hover:text-primary">
              {t("footer.giftCards")}
            </Link>
            <span className="hover:text-primary cursor-default">{t("footer.privacy")}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function TrustItem({ icon, title, subtitle }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="text-primary">{icon}</div>
      <p className="text-sm font-medium text-primary">{title}</p>
      <p className="text-xs text-secondary">{subtitle}</p>
    </div>
  );
}
function SocialLink({ children, href }) {
  return (
    <a
      href={href}
      className="w-9 h-9 border border-border flex items-center justify-center hover:border-primary hover:bg-primary hover:text-white transition-all text-secondary"
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
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
      <rect x="3" y="4" width="18" height="16" rx="1" />
      <path d="M7 8h.01M12 8h.01M17 8h.01M7 12h.01M12 12h.01" />
      <path d="M3 10h18" />
    </svg>
  );
}
function ReturnIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
      <path d="M17 1l4 4-4 4" />
      <path d="M3 11V9a4 4 0 0 1 4-4h14" />
      <path d="M7 23l-4-4 4-4" />
      <path d="M21 13v2a4 4 0 0 1-4 4H3" />
    </svg>
  );
}
function ShippingIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
      <rect x="1" y="3" width="15" height="13" />
      <path d="M16 8h4l3 6v3h-7V8z" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
      <path d="M3 9h9" />
      <path d="M6 13H3" />
    </svg>
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
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1.5" />
    </svg>
  );
}
function FacebookIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}
function PinterestIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2a10 10 0 0 0-3.2 19.4c-.1-.8-.2-2 .0-2.8l1.1-4.7c-.3-.5-.4-1.1-.4-1.7 0-1.6 1-2.8 2.2-2.8.9 0 1.4.7 1.4 1.5 0 .9-.6 2.3-.9 3.5-.3 1 .2 1.9 1.2 1.9 1.5 0 2.7-1.6 2.7-3.9 0-2-1.4-3.4-3.4-3.4-2.3 0-3.6 1.7-3.6 3.5 0 1 .4 2 .8 2.6l.3.4-.3 1c0 .4-.1.8-.2 1.1A10 10 0 0 0 12 2z" />
    </svg>
  );
}
