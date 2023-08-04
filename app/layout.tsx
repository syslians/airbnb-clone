import { Nunito } from 'next/font/google';

import './globals.css';

import ClientOnly from './components/ClientOnly';
import Navbar from './components/navbar/Navbar';

import RegisterModal from './components/modals/RegisterModal';
import LoginModal from './components/modals/LoginModal';
import RentModal from './components/modals/RentModal';
import SearchModal from './components/modals/SearchModal';

import ToasterProvider from './providers/ToastProvider';
import getCurrentUser from './actions/getCurrentUser';

export const metadata = {
  title: 'Airbnb',
  description: 'Airbnb Clone',
}
/* 브라우저의 이름과 설명의 메타데이터입니다. */

const font = Nunito({
  subsets: ["latin"],
});
//구글폰트에서 누니토 폰트를 가져와서 사용한다.

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const currentUser = await getCurrentUser(); 
   
  return (
    <html lang="en">
      <body className={font.className}>
        <ClientOnly>
          <ToasterProvider />
          <SearchModal />
          <RentModal />
          <LoginModal />
          <RegisterModal />
          <Navbar currentUser={currentUser} />
        </ClientOnly>
        <div className="pb-20 pt-20">
          {children}
        </div>
      </body>
    </html>
  )
}
