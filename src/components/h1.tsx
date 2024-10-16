type H1Props = {
  children: React.ReactNode;
};

export default function H1({ children }: H1Props) {
  return <h1 className='font-medium text-2xl leading-6'>{children}</h1>;
}
