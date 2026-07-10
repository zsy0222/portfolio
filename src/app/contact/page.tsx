import Link from "next/link";
import Footer from "@/components/Footer";

const contacts = [
  { label: "GitHub", href: "https://github.com/zsy0222", value: "github.com/zsy0222" },
  { label: "Email", href: "mailto:3578379159@qq.com", value: "3578379159@qq.com" },
  { label: "WeChat", href: "#", value: "chenmuqingtongyan" },
];

export default function ContactPage() {
  return (
    <>
      <section className="px-15 pt-25 pb-20">
        <div className="text-[20px] font-medium tracking-[0.16em] uppercase text-muted mb-8">
          Contact
        </div>
        <h1 className="text-[64px] font-light text-ink leading-[1.15] tracking-[-0.01em] mb-7">
          Get in <span className="text-accent font-semibold">touch</span>.
        </h1>
        <p className="text-[24px] font-medium text-lead leading-[1.6] max-w-[520px] mb-9">
          Open to opportunities in quantitative analysis, AI product
          management, and algorithm research. Feel free to reach out.
        </p>
      </section>

      <section className="px-15 py-18 border-t border-line">
        <div className="grid grid-cols-1 gap-0">
          {contacts.map((contact, index) => (
            <div
              key={contact.label}
              className={`py-8 ${index < contacts.length - 1 ? "border-b border-line" : ""}`}
            >
              <div className="text-[16px] font-medium tracking-[0.14em] uppercase text-muted mb-2">
                {contact.label}
              </div>
              <Link
                href={contact.href}
                className="text-[24px] font-medium text-lead hover:text-accent transition-colors"
              >
                {contact.value}
              </Link>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
}
