interface IProps {
  src: string;
  alt: string;
  width?: string;
  className?: string;
  eager?: boolean; // Set true only for above-the-fold images (hero)
}
const Image = ({ src, alt = "image", width = "w-full", className, eager = false }: IProps) => {
  return (
    <img
      src={src}
      className={` object-cover ${className} ${width}`}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
    />
  );
};

export default Image;
