import localFont from "next/font/local";

const PPNeueMontreal = localFont({
  src: [
    {
      path: "../assets/fonts/PPNeueMontreal/PPNeueMontreal-Regular.otf",
      weight: "400",
      style: "regular",
    },
    {
      path: "../assets/fonts/PPNeueMontreal/PPNeueMontreal-Medium.otf",
      weight: "500",
      style: "medium",
    },
  ],
  variable: "--font-pp-neue-montreal",
});

const IBMPlexMono = localFont({
  src: [
    {
      path: "../assets/fonts/IBMPlexMono/IBMPlexMono-Regular.ttf",
      weight: "400",
      style: "regular",
    },
    {
      path: "../assets/fonts/IBMPlexMono/IBMPlexMono-Medium.ttf",
      weight: "500",
      style: "medium",
    },
  ],
  variable: "--font-ibm-plex-mono",
});

const fonts = {
  PPNeueMontreal,
  IBMPlexMono,
};

export default fonts;
