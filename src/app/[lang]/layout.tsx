export function generateStaticParams() {
  return [{ lang: "fa" }, { lang: "en" }, { lang: "ar" }];
}

export default function LangLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
