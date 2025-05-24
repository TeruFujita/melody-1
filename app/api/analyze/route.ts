import { NextResponse } from 'next/server';
import { GoogleGenerativeAI, Part } from '@google/generative-ai';

// Gemini APIクライアントの初期化
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// 定数
const SYSTEM_PROMPT = "あなたは日本の音楽キュレーターです。ユーザーの感情や状況を細かく分析し、その気持ちに最も寄り添う日本の楽曲を提案してください。\
- 2000年以降の曲を優先\
- 歌詞の内容やメッセージが感情に合っているか吟味\
- 感情の強さやニュアンスも考慮\
- 曲名・アーティスト名・ジャンル・リリース年・なぜこの曲が合うのかの理由を日本語で\
- 3曲程度リスト形式で";

export async function POST(request: Request) {
    try {
      // リクエストボディの取得
      const { text } = await request.json();
      console.log('Received text:', text);
  
      // 環境変数のチェック
      if (!process.env.GEMINI_API_KEY) {
        console.error('GEMINI_API_KEY is not defined');
        return NextResponse.json(
          { error: 'APIキーが設定されていません' },
          { status: 500 }
        );
      }
  
      // Gemini APIの呼び出し
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      
      // チャットセッションの開始
      const chat = model.startChat({
        history: [
          {
            role: "user",
            parts: [{ text: "あなたは日本の音楽キュレーターとして、ユーザーの感情に寄り添った曲を提案してください。" }],
          },
          {
            role: "model",
            parts: [{ text: "はい、承知しました。ユーザーの感情や状況を理解し、それに合った日本の楽曲を提案させていただきます。" }],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      });

      // ユーザーの感情を分析
      const result = await chat.sendMessage([{ text }]);
      const response = await result.response;
      const keywords = response.text();
      
      console.log('Generated keywords:', keywords);
  
      return NextResponse.json({ keywords });
    } catch (error) {
      // エラーハンドリングの改善
      console.error('Server error:', error);
      const errorMessage = error instanceof Error ? error.message : '不明なエラーが発生しました';
      return NextResponse.json(
        { 
          error: '感情分析に失敗しました',
          details: errorMessage 
        },
        { status: 500 }
      );
    }
}