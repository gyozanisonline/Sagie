import './globals.css';
import localFont from 'next/font/local';
import Header from './components/Header';
import SmoothScroll from './components/SmoothScroll';

const bigCaslon = localFont({
    src: './fonts/BigCaslon.woff',
    variable: '--font-big-caslon',
    weight: '400',
    style: 'normal',
    display: 'swap',
});

export const metadata = {
    title: 'Sagie Maya',
    description: 'Graphic Designer — Portfolio',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" className={bigCaslon.variable}>
            <body>
                <SmoothScroll>
                    <Header />
                    <main>{children}</main>
                </SmoothScroll>
            </body>
        </html>
    );
}
