import "./globals.css";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="ru" className="h-full w-full">
            <head>
                <title>Конденсация графа</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </head>
            <body className="flex h-full w-full">
                {children}
            </body>
        </html>
    );
}