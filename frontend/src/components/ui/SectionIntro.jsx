import React from "react";

function SectionIntro({
  eyebrow,
  title,
  description,
  align = "center",
  tone = "default",
  className = "",
}) {
  const isCenter = align === "center";
  const isLight = tone === "light";

  const wrapperClass = isCenter ? "text-center mx-auto" : "text-left";
  const maxWidthClass = isCenter ? "max-w-3xl" : "max-w-2xl";
  const eyebrowClass = isLight
    ? "text-blue-100"
    : "text-blue-600";
  const titleClass = isLight ? "text-white" : "text-gray-900";
  const descClass = isLight ? "text-blue-100" : "text-gray-600";

  return (
    <div className={`${wrapperClass} ${maxWidthClass} ${className}`.trim()}>
      {eyebrow ? (
        <p
          className={`uppercase tracking-[0.18em] text-xs md:text-sm font-semibold mb-3 ${eyebrowClass}`}
        >
          {eyebrow}
        </p>
      ) : null}
      <h2 className={`text-3xl md:text-4xl font-bold leading-tight mb-3 ${titleClass}`}>
        {title}
      </h2>
      {description ? (
        <p className={`text-base md:text-lg ${descClass}`}>{description}</p>
      ) : null}
    </div>
  );
}

export default SectionIntro;
