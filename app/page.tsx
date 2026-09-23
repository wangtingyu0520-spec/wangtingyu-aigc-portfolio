"use client";

import { useMemo, useState } from "react";
import MoltenMetal from "@/components/MoltenMetal";
import SkewedCarousel from "@/components/SkewedCarousel";
import StrokeText from "@/components/StrokeText";
import { SocialProofMarquees } from "@/components/SocialProof";
import BorderGlow from "@/components/BorderGlow";
import GradientText from "@/components/GradientText";
import Magnet from "@/components/Magnet";
import ThinkingDots from "@/components/ThinkingDots";

type Work = {
  id: string;
  title: string;
  category: string;
  format: "portrait" | "landscape" | "visual";
  image?: string;
  description: string;
  tags: string[];
  href: string;
  cta: string;
  notice?: string;
};

const categories = ["全部", "短剧与漫剧", "短片", "商业内容", "传播型内容", "角色与动作", "后期与静态视觉"];

const works: Work[] = [
  {
    id: "three-realms",
    title: "三界跑腿",
    category: "短剧与漫剧",
    format: "landscape",
    image: "/works/three-realms-runner.png",
    description: "将修仙世界观与现代跑腿职业结合，围绕“三界跑腿人”陆小凡塑造年轻打工人的角色身份。",
    tags: ["AI 3D 国漫", "世界观设定", "角色塑造"],
    href: "https://www.bilibili.com/video/BV1AT896AEsE/",
    cta: "在 Bilibili 观看完整短片",
  },
  {
    id: "she-wont-kneel",
    title: "她不跪了",
    category: "短剧与漫剧",
    format: "portrait",
    image: "/works/she-wont-kneel.png",
    description: "以宴会厅群像承载女性觉醒与关系反转，重点处理多人站位、角色关系与复杂空间中的画面秩序。",
    tags: ["仿真人短剧", "多人物场景", "空间关系控制"],
    href: "https://www.douyin.com/video/7678308468482747121",
    cta: "在抖音观看完整短片",
  },
  {
    id: "wasteland",
    title: "废土机甲",
    category: "短剧与漫剧",
    format: "landscape",
    image: "/works/wasteland-mecha.jpg",
    description: "围绕废墟城市、机甲与未来科技构建末日视觉体系，处理写实人物质感与科幻场景氛围的统一关系。",
    tags: ["废土科幻", "仿真人物", "科幻场景设计"],
    href: "https://www.bilibili.com/video/BV19egs6pEow/",
    cta: "在 Bilibili 观看完整短片",
  },
  {
    id: "commerce",
    title: "AI 信息流带货短视频",
    category: "商业内容",
    format: "portrait",
    image: "/works/infoflow-commerce.jpg",
    description: "面向办公室久坐人群，从消费痛点、产品卖点到下单理由进行脚本策划，在 15 秒内完成产品露出与转化信息传递。",
    tags: ["信息流广告", "脚本策划", "产品卖点", "转化节奏"],
    href: "https://www.douyin.com/video/7678287482508696689",
    cta: "在抖音观看完整短片",
    notice: "非官方合作的个人商业内容练习，仅用于作品集展示。",
  },
  {
    id: "moon-trace",
    title: "月痕",
    category: "传播型内容",
    format: "portrait",
    image: "/works/moon-trace.jpg",
    description: "以月夜、人物关系和暧昧情绪构建女性向观看氛围，通过人物造型与画面风格的差异化设计呈现多风格视觉能力。",
    tags: ["乙游向内容", "多风格视觉", "人物风格设计"],
    href: "https://www.douyin.com/video/7675028312511395313",
    cta: "在抖音观看完整短片",
  },
  {
    id: "another-me",
    title: "另一个我",
    category: "短片",
    format: "landscape",
    image: "/works/another-me.png",
    description: "将真人形象与风格化 IP 形象置于同一叙事中，通过两种视觉身份的对照完成自我认同主题的表达。",
    tags: ["成长主题", "真人与 IP 融合", "情绪叙事"],
    href: "https://www.bilibili.com/video/BV15s896DEHG/",
    cta: "在 Bilibili 观看完整短片",
  },
  {
    id: "almost-goodbye",
    title: "差一点告别",
    category: "短片",
    format: "landscape",
    image: "/works/almost-goodbye.png",
    description: "通过对白误导与白纱转场制造情绪反转，将一场看似走向告别的约会，自然过渡至婚礼时刻，完成关系与情感的递进。",
    tags: ["仿真人短片", "情绪反转", "爱情叙事"],
    href: "https://www.bilibili.com/video/BV1gohb61EVK/",
    cta: "在 Bilibili 观看完整短片",
  },
  {
    id: "own-world",
    title: "自己的世界",
    category: "商业内容",
    format: "landscape",
    image: "/works/own-world.png",
    description: "以耳机作为人物与外界建立边界的视觉符号，通过重绘产品外观与设计专属标识，完成统一的产品情绪表达。",
    tags: ["品牌 TVC", "产品视觉设计", "情绪化产品表达"],
    href: "https://www.bilibili.com/video/BV1VLg56REsX/",
    cta: "在 Bilibili 观看完整短片",
    notice: "非商业个人创作，不代表与任何品牌存在合作关系；产品外观灵感参考市售耳机，画面中的产品标识与视觉呈现均为个人再设计。",
  },
  {
    id: "mythic-artifacts",
    title: "神话法宝",
    category: "传播型内容",
    format: "portrait",
    image: "/works/mythic-artifacts.jpg",
    description: "以“神话法宝介入现实困境”为内容钩子，统筹国风道具、都市空间与人物情绪，形成适配视频号语境的高记忆点画面。",
    tags: ["国风奇幻", "提示词设计", "受众洞察"],
    href: "https://www.douyin.com/video/7678298882321129073",
    cta: "在抖音观看完整短片",
  },
  {
    id: "mvp-dance",
    title: "天南第一人 MVP 结算舞蹈",
    category: "角色与动作",
    format: "landscape",
    image: "/works/mvp-dance.jpg",
    description: "以国漫角色为基础，结合动作迁移完成舞蹈场景的动态生成，处理动作节奏、角色形象与多人队形之间的协调统一。",
    tags: ["国漫角色", "动作迁移", "动态生成"],
    href: "https://www.bilibili.com/video/BV1uCMy6cETP/",
    cta: "在 Bilibili 观看完整短片",
  },
  {
    id: "color",
    title: "调色",
    category: "后期与静态视觉",
    format: "visual",
    description: "运用色轮、曲线、HSL 完成整体校色，并通过蒙版二级调色控制局部明暗、色彩与视觉重点。",
    tags: ["影视调色", "HSL", "蒙版二级调色"],
    href: "https://www.douyin.com/video/7678299940187364731",
    cta: "在抖音观看完整短片",
  },
  {
    id: "jiao-xi",
    title: "椒戏·四川料理菜单",
    category: "后期与静态视觉",
    format: "landscape",
    image: "/works/jiao-xi-menu.jpg",
    description: "使用 Image 2 生成菜品视觉，并通过 Photoshop 完成菜单版式与信息层级设计，建立适用于餐饮场景的商业菜单视觉。",
    tags: ["AI 菜品视觉", "Photoshop", "餐饮菜单设计"],
    href: "/works/jiao-xi-menu.jpg",
    cta: "查看图文作品大图",
  },
];

const skills = [
  { index: "01", title: "叙事结构与导演分镜", text: "从剧情冲突、人物情绪、产品卖点或目标受众出发，完成故事节奏、分镜脚本与镜头设计。", color: "wine" },
  { index: "02", title: "视觉一致性与生成质量", text: "通过提示词设计、控图与多轮迭代，处理人物一致性、画风连续性、噪点与细节稳定性。", color: "gold" },
  { index: "03", title: "镜头衔接与动态表达", text: "围绕景别、构图、动作、视线与空间方向设计镜头延续，并完成动作迁移与角色动态演绎。", color: "blue" },
  { index: "04", title: "商业内容与后期合成", text: "围绕产品表达、用户痛点与平台受众设计内容节奏，完成剪辑、调色、画面优化与静态商业视觉。", color: "red" },
];

const borderGlowProps = {
  edgeSensitivity: 44,
  glowColor: "40 80 80",
  backgroundColor: "#120F17",
  borderRadius: 29,
  glowRadius: 43,
  glowIntensity: 1.5,
  coneSpread: 26,
  animated: true,
  colors: ["#c084fc", "#f472b6", "#38bdf8"],
};

const gradientTitleProps = {
  colors: ["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"],
  animationSpeed: 6,
  showBorder: false,
};

const tools = [
  { label: "ChatGPT", mark: "✳", icon: "/tool-icons/chatgpt.png", iconScale: 1.265, x: "8%", y: "18%", size: "lg" },
  { label: "Codex", mark: "⌘", icon: "/tool-icons/codex.png", iconScale: 1.02, x: "23%", y: "9%", size: "md" },
  { label: "Image 2", mark: "◌", icon: "/tool-icons/image-2.png", iconScale: 1.152, x: "38%", y: "22%", size: "lg" },
  { label: "Nano Banana", mark: "◒", icon: "/tool-icons/nano-banana.png", iconScale: 0.86, x: "55%", y: "8%", size: "sm" },
  { label: "Seedance", mark: "✦", icon: "/tool-icons/seedance.png", iconScale: 0.86, x: "73%", y: "20%", size: "md" },
  { label: "MiniMax", mark: "M", icon: "/tool-icons/minimax.png", iconScale: 0.96, x: "88%", y: "11%", size: "lg" },
  { label: "LibTV", mark: "▱", icon: "/tool-icons/libtv.png", iconScale: 1.17, x: "16%", y: "59%", size: "md" },
  { label: "Neowow", mark: "↗", icon: "/tool-icons/neowow.png", iconScale: 1.25, x: "34%", y: "49%", size: "sm" },
  { label: "Photoshop", mark: "Ps", icon: "/tool-icons/photoshop.png", iconScale: 0.94, x: "48%", y: "68%", size: "lg" },
  { label: "剪映", mark: "◼", icon: "/tool-icons/jianying.png", iconScale: 0.963, x: "66%", y: "52%", size: "md" },
  { label: "视频生成", mark: "▶", icon: "/tool-icons/video-generation.png", iconScale: 0.96, x: "82%", y: "65%", size: "sm" },
  { label: "调色", mark: "◉", icon: "/tool-icons/grading.png", iconScale: 0.95, x: "7%", y: "82%", size: "sm" },
  { label: "提示词", mark: "〽", icon: "/tool-icons/prompt.png", iconScale: 0.88, x: "25%", y: "86%", size: "lg" },
  { label: "分镜", mark: "▦", icon: "/tool-icons/storyboard.png", iconScale: 1.17, x: "58%", y: "84%", size: "md" },
  { label: "视觉设计", mark: "◇", icon: "/tool-icons/visual-design.png", iconScale: 0.92, x: "91%", y: "88%", size: "md" },
];

const assetUrl = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("全部");
  const [activeWorkIndex, setActiveWorkIndex] = useState(1);
  const filteredWorks = useMemo(() => activeCategory === "全部" ? works : works.filter((work) => work.category === activeCategory), [activeCategory]);

  return (
    <main>
      <nav className="island" aria-label="网站导航">
        <span className="island-spacer" aria-hidden="true" />
        <div className="island-links">
          <a href="#works">作品</a>
          <a href="#craft">能力</a>
          <a href="#tools">工具</a>
          <a href="#contact">联系</a>
        </div>
        <a className="island-mark" href="#home" aria-label="返回首页">WTY</a>
      </nav>

      <section className="hero" id="home">
        <MoltenMetal
          color1="#5227FF"
          color2="#FF9FFC"
          color3="#FFFFFF"
          speed={0.35}
          scale={4}
          detail={3}
          glow={1.6}
          coreSize={0.1}
          swirl={1}
          fold={-0.2}
          blackPoint={0.05}
          brightness={1.3}
          colorMode="molten"
          grain
          grainIntensity={0.05}
          mouseInteraction
          mouseStrength={0.3}
          opacity={1}
        />
        <div className="hero-grain" aria-hidden="true" />
        <div className="hero-meta hero-meta-top">AIGC / VIDEO / PORTFOLIO<br />SUZHOU · CN</div>
        <div className="hero-content">
          <div className="hero-title-stack">
            <p className="eyebrow">AIGC VIDEO CREATOR</p>
            <StrokeText
              text="WANG TING YU"
              strokeColor="#A78BFA"
              fillColor="#F8FAFC"
              strokeWidth={1.4}
              drawDuration={1.6}
              fillDelay={0.2}
              stagger={0.05}
              ease="power2.out"
              trigger="mount"
              fillMode="wipe"
              fontSize="clamp(56px, 8vw, 136px)"
              fontWeight={800}
              letterSpacing={-4}
              className="hero-title"
            />
            <div className="hero-summary">
              <p>以导演思维完成 AIGC 视频的 0-1 创作，<br />从内容策划、分镜与视觉设定，到生成、剪辑、调色与成片交付。</p>
            </div>
          </div>
        </div>
        <a className="primary-link hero-cta" href="#works">浏览作品 <i aria-hidden="true" /></a>
        <div className="hero-orbit orbit-one" aria-hidden="true" />
        <div className="hero-orbit orbit-two" aria-hidden="true" />
      </section>

      <section className="works-section" id="works">
        <div className="section-heading works-heading">
          <p className="eyebrow">01 / WORK INDEX</p>
          <h2>作品<span>索引</span></h2>
        </div>
        <div className="category-bar" role="tablist" aria-label="作品分类">
          {categories.map((category) => <button key={category} className={activeCategory === category ? "active" : ""} onClick={() => { setActiveCategory(category); setActiveWorkIndex(category === "全部" ? 1 : 0); }} role="tab" aria-selected={activeCategory === category}>{category}</button>)}
        </div>
        <SkewedCarousel
          activeIndex={Math.min(activeWorkIndex, Math.max(filteredWorks.length - 1, 0))}
          onActiveIndexChange={setActiveWorkIndex}
          ariaLabel="作品轮播"
          contentKey={activeCategory}
        >
          {filteredWorks.map((work) => (
            <div
              key={work.id}
              className={`work-card ${work.format}`}
            >
              <div className="work-image">
                {work.image ? <img src={assetUrl(work.image)} alt={`${work.title} 封面`} /> : <div className="color-study"><span>COLOR</span><strong>GRADING</strong><i /></div>}
                <div className="work-shade" />
                <span className="work-category">{work.category}</span>
              </div>
              <div className="work-default"><h3>《{work.title}》</h3><p>{work.tags.slice(0, 2).join(" · ")}</p></div>
              <div className="work-detail">
                <p>{work.description}</p>
                <div className="tag-list">{work.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                <a className="watch-button" href={work.href.startsWith("/") ? assetUrl(work.href) : work.href}>{work.cta} <b>↗</b></a>
                {work.notice && <small>{work.notice}</small>}
              </div>
            </div>
          ))}
        </SkewedCarousel>
        <p className="reel-hint"><span>触碰卡片查看项目重点，并可以观看完整短片</span><span>以上均为本人独立完成的 AIGC 影像与视觉作品</span></p>
      </section>

      <section className="craft-section" id="craft">
        <div className="section-heading craft-heading"><div><p className="eyebrow">02 / CREATIVE SYSTEM</p><h2>创作<span>能力</span></h2></div></div>
        <div className="craft-grid">
          <BorderGlow {...borderGlowProps} className="craft-glow craft-glow--about">
            <article className="about-card">
              <h3><GradientText {...gradientTitleProps} className="card-gradient-title">从内容命题到完整影像</GradientText></h3>
              <p>关注人物与画风一致性、镜头与空间关系、叙事节奏、生图质量与跨镜头动作延续，让生成素材真正服务于故事与内容目标。</p>
            </article>
          </BorderGlow>
          {skills.map((skill, index) => (
            <BorderGlow {...borderGlowProps} className={`craft-glow craft-glow--skill ${index === 0 ? "craft-glow--lead" : ""}`} key={skill.index}>
              <article className={`skill-card ${skill.color}`}><span>{skill.index}</span><h3><GradientText {...gradientTitleProps} className="card-gradient-title">{skill.title}</GradientText></h3><p>{skill.text}</p></article>
            </BorderGlow>
          ))}
        </div>
        <SocialProofMarquees className="craft-marquees" />
      </section>

      <section className="tools-section" id="tools">
        <ThinkingDots className="tools-thinking-dots" color="#714e73" accentColor="#19122c" opacity={0.86} />
        <div className="tools-head"><p className="eyebrow">03 / TOOLKIT</p><h2>工具<span>轨迹</span></h2><p>常用工具与创作能力</p></div>
        <div className="tool-wordmarks" aria-label="常用工具">
          {[tools.slice(0, 5), tools.slice(5, 10), tools.slice(10, 15)].map((row, rowIndex) => (
            <div className="tool-wordmark-row" key={rowIndex}>
              {row.map((tool) => <Magnet key={tool.label} padding={50} disabled={false} magnetStrength={25} wrapperClassName="tool-magnet"><div className="tool-wordmark"><i aria-hidden="true">{tool.icon ? <img src={assetUrl(tool.icon)} alt="" style={{ transform: `scale(${tool.iconScale ?? 1})` }} /> : tool.mark}</i><span>{tool.label}</span></div></Magnet>)}
            </div>
          ))}
        </div>
      </section>

      <section className="contact-section" id="contact">
        <h2>LET&apos;S CREATE <span>WHAT&apos;S NEXT.</span></h2>
        <p className="contact-tagline">一起创造下一个可能</p>
        <a href="mailto:wangtingyu0520@gmail.com" className="email-link">wangtingyu0520@gmail.com</a>
        <p className="contact-note">苏州 · 可通过邮箱/BOSS直聘联系</p>
      </section>

      <footer><span>© 2026 WANG TING YU</span><span>AIGC VIDEO PORTFOLIO</span></footer>
    </main>
  );
}
