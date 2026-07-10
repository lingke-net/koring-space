"use client";

import dynamic from "next/dynamic";

const CardNav = dynamic(() => import("@/components/card-nav/CardNav"), {
  ssr: false,
});

const navItems = [
  {
    label: "产品",
    bgColor: "#1B1722",
    textColor: "#fff",
    links: [
      { label: "Koring Launcher", href: "/launcher", ariaLabel: "Koring Launcher" },
      { label: "Sanshe Play", href: "https://docs.play.lenjing.work", ariaLabel: "Sanshe Play" },
    ],
  },
  {
    label: "资源",
    bgColor: "#2F293A",
    textColor: "#fff",
    links: [
      { label: "Github", href: "https://github.com/lingke-net", ariaLabel: "Github" },
      { label: "支持", href: "https://support.lingke.ink", ariaLabel: "支持" },
    ],
  },
  {
    label: "关于",
    bgColor: "#2F293A",
    textColor: "#fff",
    links: [
      { label: "MChine Space", href: "https://mchine.space", ariaLabel: "MChine Space" },
    ],
  },
];

function Header() {
  return (
    <CardNav
      logoAlt="Koring Team"
      items={navItems}
      baseColor="#ffffff"
      menuColor="#000"
      buttonBgColor="#111"
      buttonTextColor="#fff"
      ease="power3.out"
    />
  );
}

export { Header };
