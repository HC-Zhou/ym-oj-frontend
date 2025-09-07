import React, {useEffect, useMemo, useRef} from "react";
import {LeftOutlined, RightOutlined} from "@ant-design/icons";

type ScorllBannerProps = {
  images: { src: string; alt?: string }[];
  height?: number;
  gap?: number;
  autoPlay?: boolean;
  intervalMs?: number;
};

const ScorllBanner: React.FC<ScorllBannerProps> = ({ images, height = 160, gap = 12, autoPlay = true, intervalMs = 3000 }) => {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const duplicated = useMemo(() => images.length > 0 ? [...images, ...images] : [], [images]);

  const itemStyle = useMemo<React.CSSProperties>(() => ({
    width: `calc((100% - ${gap * 2}px) / 3)`,
    height,
    borderRadius: 12,
    overflow: "hidden",
    background: "#f5f5f5",
    flex: "0 0 auto",
  }), [gap, height]);

  const scrollBy = (delta: number) => {
    const el = wrapperRef.current;
    if (!el) return;
    const step = el.clientWidth * 0.8; // 滚动步长
    el.scrollBy({ left: delta * step, behavior: "smooth" });
  };

  useEffect(() => {
    if (!autoPlay) return;
    const el = wrapperRef.current;
    if (!el) return;

    const id = window.setInterval(() => {
      const halfWidth = el.scrollWidth / 2;
      const step = el.clientWidth; // 一屏宽
      // 若已经到达后半段末尾，瞬时回到起点
      if (el.scrollLeft + step >= halfWidth) {
        el.scrollLeft = 0;
      }
      el.scrollBy({ left: step, behavior: "smooth" });
    }, intervalMs);

    return () => window.clearInterval(id);
  }, [autoPlay, intervalMs, images.length]);

  return (
    <div style={{ position: "relative" }}>
      <div
        ref={wrapperRef}
        style={{
          display: "flex",
          gap,
          overflowX: "auto",
          padding: 4,
          scrollSnapType: "x mandatory",
          // 隐藏滚动条但保持功能
          scrollbarWidth: "none", // Firefox
          msOverflowStyle: "none", // IE/Edge
        }}
      >
        {/* 隐藏滚动条的WebKit浏览器样式 */}
        <style>
          {`
            div::-webkit-scrollbar {
              display: none;
            }
          `}
        </style>
        {duplicated.map((img, idx) => (
          <div key={`${img.src}-${idx}`} style={itemStyle}>
            <img
              src={img.src}
              alt={img.alt ?? "banner"}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              draggable={false}
            />
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <div style={{ height: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <button
            onClick={() => scrollBy(-1)}
            style={{
              pointerEvents: "auto",
              border: "none",
              background: "rgba(0,0,0,0.35)",
              color: "#fff",
              width: 28,
              height: 28,
              borderRadius: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              marginLeft: 4,
            }}
            aria-label="scroll-left"
          >
            <LeftOutlined />
          </button>
          <button
            onClick={() => scrollBy(1)}
            style={{
              pointerEvents: "auto",
              border: "none",
              background: "rgba(0,0,0,0.35)",
              color: "#fff",
              width: 28,
              height: 28,
              borderRadius: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              marginRight: 4,
            }}
            aria-label="scroll-right"
          >
            <RightOutlined />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScorllBanner;
