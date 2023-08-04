'use client';

interface ContainerProps {
  children: React.ReactNode;
}

/*Navbar에서 props로 문자열데이터를 넘긴다.Container 는 받은props를 렌더링 */
const Container: React.FC<ContainerProps> = ({
  children
}) => {
  return (
    <div
      className="
        max-w-[2520px]
        mx-auto
        xl:px-20
        md:px-10
        sm:px-2
        px-4
      "
    >
      {children}
    </div>
  )
}

export default Container