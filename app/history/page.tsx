// app/history/page.tsx
import { Metadata } from "next";
import HistoryPageClient from "./HistoryPageClient";

export const metadata: Metadata = {
  title: "履歴",
  description: "あなたの履歴を確認できます",
};

export default function HistoryPage() {
  return <HistoryPageClient />;
}
