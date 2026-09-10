type SocialProofItem = { label: string; mark: string };

type SocialProofProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
  firstRow?: SocialProofItem[];
  secondRow?: SocialProofItem[];
  showMarquees?: boolean;
};

const firstRow = [
  { label: "短剧与漫剧", mark: "◒" },
  { label: "品牌 TVC", mark: "✦" },
  { label: "AI 信息流", mark: "↗" },
  { label: "国风奇幻", mark: "◇" },
  { label: "角色动态", mark: "◎" },
];

const secondRow = [
  { label: "故事策划", mark: "✳" },
  { label: "导演分镜", mark: "▦" },
  { label: "视觉设定", mark: "◌" },
  { label: "镜头衔接", mark: "⌁" },
  { label: "剪辑调色", mark: "◉" },
];

function MarqueeRow({ items, reverse = false }: { items: SocialProofItem[]; reverse?: boolean }) {
  return (
    <div className="proof-marquee" aria-hidden="true">
      <div className={`proof-track ${reverse ? "proof-track-reverse" : ""}`}>
        {[...items, ...items].map((item, index) => (
          <div className="proof-pill" key={`${item.label}-${index}`}><span>{item.mark}</span>{item.label}</div>
        ))}
      </div>
    </div>
  );
}

export function SocialProofMarquees({
  firstRow: customFirstRow = firstRow,
  secondRow: customSecondRow = secondRow,
  className = "",
}: Pick<SocialProofProps, "firstRow" | "secondRow"> & { className?: string }) {
  return (
    <div className={`proof-marquees ${className}`}>
      <MarqueeRow items={customFirstRow} />
      <MarqueeRow items={customSecondRow} reverse />
    </div>
  );
}

export default function SocialProof({
  eyebrow = "SELECTED PRACTICE",
  title = "让每一次生成，\n都有完整表达。",
  description = "从叙事、视觉设定到镜头与后期，围绕不同内容命题，完成从灵感到成片的创作闭环。",
  firstRow: customFirstRow = firstRow,
  secondRow: customSecondRow = secondRow,
  showMarquees = true,
}: SocialProofProps) {
  return (
    <section className={`social-proof${showMarquees ? "" : " social-proof--intro"}`} id="showcase" aria-labelledby="showcase-title">
      <div className="proof-heading">
        <p className="proof-kicker"><i /> {eyebrow}</p>
        <h2 id="showcase-title">{title.split("\n").map((line, index) => <span key={index}>{line}</span>)}</h2>
        <p className="proof-description">{description}</p>
      </div>
      {showMarquees && <SocialProofMarquees firstRow={customFirstRow} secondRow={customSecondRow} />}
    </section>
  );
}
