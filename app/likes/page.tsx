import { Metadata } from "next";
import LikesPageClient from "./LikePageClient";

export const metadata: Metadata = {
  title: "いいね",
  description: "あなたがいいねしたアイテムを確認できます",
};

export default function LikesPage() {
  return <LikesPageClient />;
}
