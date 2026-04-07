import type { ReactNode } from "react";

interface IProps {
  children: ReactNode;
  className?: string;
  id?: string;
}
const SectionWrapper = ({ children, className, id }: IProps) => {
  return (
    <section id={id} className={`mt-12 md:mt-20 container mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </section>
  );
};

export default SectionWrapper;
