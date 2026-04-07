interface IProps {
  src: string;
  alt: string;
  width?: string;
  className?: string;
  eager?: boolean; // Set true only for above-the-fold images (hero)
}
const Image = ({ src, alt, width = "w-full", className, eager = false }: IProps) => {
  return (
    <img
      src={src}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      className={` object-cover ${className} ${width}`}
    />
  );
};

export default Image;
