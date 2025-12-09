type ThreeDTextProps = {
    text: string;
    className?: string;
}

export function ThreeDText({ text, className }: ThreeDTextProps) {
return (
    <h1
      className={`
        ${className ? className : ""}
        relative 
        pb-2
      `} //Take in a className prop for text size, relative positioning
    >
      {/* Back Layer*/}
      <span
        aria-hidden
        className="
          
          absolute inset-0
          translate-x-[0.06em] translate-y-[0.06em]
          sm:translate-x-[0.04em] sm:translate-y-[0.06em]
          md:translate-x-[0.04em] md:translate-y-[0.06em]
          lg:translate-x-[0.07em] lg:translate-y-[0.05em]
          xl:translate-x-[0.07em] xl:translate-y-[0.05em]
          2xl:translate-x-[0.07em] 2xl:translate-y-[0.05em] 
          opacity-60
          blur-[1.9px]
        " //absolute so its free, inset-0 to cover entire h1, slight offset, low opacity and blur for depth
      >
        {text}
      </span>

      {/* Front layer */}
      <span className="relative z-10"> {/*Stack above back layer*/}
        {text}
      </span>
    </h1>
  );
}