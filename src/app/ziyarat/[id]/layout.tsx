import { ziyarats } from "@/data/ziyarats";

export function generateStaticParams() {
  return ziyarats.map((ziyarat) => ({
    id: ziyarat.id,
  }));
}

import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  const isAshura = id === 'ashura';
  
  const title = isAshura ? 'متن کامل زیارت عاشورا با صوت و ترجمه' : 'متن کامل زیارت وارث با صوت و ترجمه';
  const desc = isAshura 
    ? 'خواندن زیارت عاشورا به همراه صوت، ترجمه فارسی و انگلیسی و امکانات تعاملی.' 
    : 'خواندن زیارت وارث به همراه صوت، ترجمه فارسی و انگلیسی.';

  return {
    title,
    description: desc,
    openGraph: {
      title,
      description: desc,
      url: `https://karbalapro.github.io/ziyarat/${id}`,
      type: "article",
    },
    alternates: {
      canonical: `/ziyarat/${id}`,
    }
  };
}

export default async function ZiyaratLayout({ children, params }: { children: React.ReactNode, params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  
  // JSON-LD Schema for LLMs (Article)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": id === 'ashura' ? 'زیارت عاشورا' : 'زیارت وارث',
    "description": "متن کامل، ترجمه و صوت زیارت",
    "url": `https://karbalapro.github.io/ziyarat/${id}`,
    "author": {
      "@type": "Organization",
      "name": "Karbala Pro"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
