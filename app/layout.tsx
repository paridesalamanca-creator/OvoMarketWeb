export const metadata = {
  title: 'Ovo Market AI Command Center',
  description: 'Manage your Shopify store with AI assistance',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Ovo Market',
  },
  formatDetection: {
    telephone: false,
  },
  viewport: 'width=device-width, initial-scale=1, viewport-fit=cover',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#0b1020" />
      </head>
      <body style={{ margin: 0, padding: 0, backgroundColor: '#0b1020' }}>
        {children}
      </body>
    </html>
  );
}
