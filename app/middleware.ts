export { default } from "next-auth/middleware"

export const config = { 
  matcher: [
    "/trips",
    "/reservations",
    "/properties",
    "/favorites"
  ]
};

/* matcher : [] URL 패턴을 나타내는 배열입니다.이 배열은 미들웨어가 어떤 url
경로에 적용될지를 지정합니다.위의 코드에서는 /trips, /reservations, properties,
/favorites 경로에 미들에어가 적용됩니다.즉, 이러한 경로로 들어오는 요청에 대해 
next-auth 미들웨어가 동작합니다.해당 경로로 들어오는 페이지들을 보호하는 역할을 합니다.
여기서 보호한다는 의미는 해당 페이지에 접근하기전에 사용자의 인증상태를 확인하고, 인증되지
않은 사용자가 접근하지 못하도록 접근을 제한하는 것을 의미합니다.쉽게 말해, 로그인한 사용자만
접근할 수 있게합니다.*/
