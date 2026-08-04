import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Skincare Quiz",
  description:
    "Find the perfect Korean skincare routine for your skin type. Take Kara's quick K-beauty skin quiz and get personalized product recommendations.",
  alternates: {
    canonical: "https://www.karakoreanbeauty.com/quiz",
  },
  openGraph: {
    title: "Skincare Quiz | Kara Korean Beauty",
    description:
      "Find the perfect Korean skincare routine for your skin type. Get personalized K-beauty product recommendations.",
    url: "https://www.karakoreanbeauty.com/quiz",
    type: "website",
  },
};

export default function QuizLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
