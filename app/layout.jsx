import './globals.css';
import Header from './components/Header';
import SmoothScroll from './components/SmoothScroll';

export const metadata = {
    title: 'Sagie Maya',
    description: 'Graphic Designer — Portfolio',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <SmoothScroll>
                    <Header />
                    <main>{children}</main>
                </SmoothScroll>
            </body>
        </html>
    );
}
