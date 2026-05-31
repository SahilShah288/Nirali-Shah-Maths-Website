import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * React Bits–style split text animation (chars / words / lines).
 * Uses GSAP + ScrollTrigger (no Club SplitText plugin required).
 */
function splitElement(el, splitType) {
  const content = el.textContent ?? "";
  el.textContent = "";
  el.setAttribute("aria-label", content);

  const targets = [];

  if (splitType.includes("lines")) {
    const lines = content.split(/\n/).filter((line, i, arr) => line.length || i < arr.length - 1);
    lines.forEach((line, lineIndex) => {
      const lineEl = document.createElement("span");
      lineEl.className = "split-line block";
      lineEl.style.display = "block";

      line.split("").forEach((char) => {
        const span = document.createElement("span");
        span.className = "split-char";
        span.style.display = "inline-block";
        span.textContent = char === " " ? "\u00a0" : char;
        lineEl.appendChild(span);
        targets.push(span);
      });

      el.appendChild(lineEl);
      if (lineIndex < lines.length - 1) {
        el.appendChild(document.createElement("br"));
      }
    });
    return targets;
  }

  if (splitType.includes("words")) {
    const parts = content.split(/(\s+)/);
    parts.forEach((part) => {
      if (!part) return;
      const span = document.createElement("span");
      span.className = part.trim() ? "split-word" : "split-space";
      span.style.display = "inline-block";
      span.textContent = part.trim() ? part : "\u00a0";
      el.appendChild(span);
      if (part.trim()) targets.push(span);
    });
    return targets;
  }

  content.split("").forEach((char) => {
    const span = document.createElement("span");
    span.className = "split-char";
    span.style.display = "inline-block";
    span.textContent = char === " " ? "\u00a0" : char;
    el.appendChild(span);
    targets.push(span);
  });

  return targets;
}

export default function SplitText({
  text,
  className = "",
  delay = 20,      // Reduced from 30 for faster stagger
  duration = 0.8,  // Reduced from 1 for snappier movement
  ease = "power2.out", // Power2 is slightly "faster" feeling than Power3
  splitType = "chars",
  from = { opacity: 0, y: 20 }, // Reduced y distance (40 to 20) to make it feel faster
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = "-100px",
  textAlign = "center",
  tag = "p",
  onLetterAnimationComplete,
}) {
  const ref = useRef(null);
  const animationCompletedRef = useRef(false);
  const onCompleteRef = useRef(onLetterAnimationComplete);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    onCompleteRef.current = onLetterAnimationComplete;
  }, [onLetterAnimationComplete]);

  useEffect(() => {
    if (document.fonts.status === "loaded") {
      setFontsLoaded(true);
    } else {
      document.fonts.ready.then(() => setFontsLoaded(true));
    }
  }, []);

  useGSAP(
    () => {
      if (!ref.current || !text || !fontsLoaded) return;
      if (animationCompletedRef.current) return;

      const el = ref.current;

      if (el._splitCleanup) {
        el._splitCleanup();
        el._splitCleanup = null;
      }

      const startPct = (1 - threshold) * 100;
      const marginMatch = /^(-?\d+(?:\.\d+)?)(px|em|rem|%)?$/.exec(rootMargin);
      const marginValue = marginMatch ? parseFloat(marginMatch[1]) : 0;
      const marginUnit = marginMatch ? marginMatch[2] || "px" : "px";
      const sign =
        marginValue === 0
          ? ""
          : marginValue < 0
            ? `-=${Math.abs(marginValue)}${marginUnit}`
            : `+=${marginValue}${marginUnit}`;
      const start = `top ${startPct}%${sign}`;

      const originalText = text;
      el.textContent = originalText;
      const targets = splitElement(el, splitType);

      const tween = gsap.fromTo(
        targets,
        { ...from },
        {
          ...to,
          duration,
          ease,
          stagger: delay / 1000,
          scrollTrigger: {
            trigger: el,
            start,
            once: true,
            fastScrollEnd: true,
            anticipatePin: 0.4,
          },
          onComplete: () => {
            animationCompletedRef.current = true;
            onCompleteRef.current?.();
          },
          willChange: "transform, opacity",
          force3D: true,
        }
      );

      el._splitCleanup = () => {
        tween.kill();
        ScrollTrigger.getAll().forEach((st) => {
          if (st.trigger === el) st.kill();
        });
        el.textContent = originalText;
      };

      return () => {
        if (el._splitCleanup) {
          el._splitCleanup();
          el._splitCleanup = null;
        }
      };
    },
    {
      dependencies: [
        text,
        delay,
        duration,
        ease,
        splitType,
        JSON.stringify(from),
        JSON.stringify(to),
        threshold,
        rootMargin,
        fontsLoaded,
      ],
      scope: ref,
    }
  );

  const Tag = tag || "p";
  const style = {
    textAlign,
    /* FIX: Removed overflow: "hidden" to prevent 'y' from cutting off.
       Added a tiny padding-bottom just in case of tight line-heights.
    */
    overflow: "visible", 
    paddingBottom: "0.15em", 
    display: "block",
    width: "100%",
    whiteSpace: "normal",
    wordWrap: "break-word",
    willChange: "transform, opacity",
  };

  return (
    <Tag ref={ref} style={style} className={`split-parent ${className}`}>
      {text}
    </Tag>
  );
}
