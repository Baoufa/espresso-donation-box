import "@rainbow-me/rainbowkit/styles.css";
import "/src/styles/globals.css";
import WagmiProvider from "@/providers/WagmiProvider";
import Box from "@/components/Box";
import Footer from "@/components/Footer";
import fonts from "@/styles/fonts";
import NavBar from "@/components/NavBar";
import { ContractProvider } from "@/hooks/useContract";

export const metadata = {
  title: "Espress Donation Box",
  description: "Espresso Donation Box by Benjamin Anoufa",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`
       ${fonts.PPNeueMontreal.variable} 
       ${fonts.IBMPlexMono.variable}
    `}
    >
      <body>
        <WagmiProvider>
          <ContractProvider>
            <Box>
              <NavBar />
              {children}
              <Footer />
            </Box>
          </ContractProvider>
        </WagmiProvider>
      </body>
    </html>
  );
}
