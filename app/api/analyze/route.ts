import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Gemini APIクライアントの初期化
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// 定数
const SYSTEM_PROMPT = "あなたは日本の音楽キュレーターです。ユーザーの感情や状況を細かく分析し、その気持ちに最も寄り添う日本の楽曲を提案してください。\
- 2000年以降の曲を優先\
- 歌詞の内容やメッセージが感情に合っているか吟味\
- 感情の強さやニュアンスも考慮\
- 曲名・アーティスト名・ジャンル・リリース年・なぜこの曲が合うのかの理由を日本語で\
- 3曲程度リスト形式で";

// リトライ用の待機関数
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// リトライロジック
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 1000
): Promise<T> {
  let retries = 0;
  let delay = initialDelay;

  while (true) {
    try {
      return await fn();
    } catch (error) {
      if (retries >= maxRetries) throw error;
      
      // 429エラー（Too Many Requests）の場合のみリトライ
      if (error instanceof Error && error.message.includes('429')) {
        console.log(`Retrying after ${delay}ms... (Attempt ${retries + 1}/${maxRetries})`);
        await wait(delay);
        retries++;
        delay *= 2; // 指数バックオフ
      } else {
        throw error;
      }
    }
  }
}

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
  
      // Gemini APIの呼び出し（リトライロジック付き）
      const result = await retryWithBackoff(async () => {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
        const prompt = `${SYSTEM_PROMPT}\n\nユーザーの感情・状況: ${text}`;
        const result = await model.generateContent(prompt);
        return result;
      });
      
      const response = await result.response;
      const keywords = response.text();
      
      console.log('Generated keywords:', keywords);
  
      return NextResponse.json({ keywords });
    } catch (error) {
      // エラーハンドリングの改善
      console.error('Server error:', error);
      let errorDetails = '不明なエラーが発生しました';
      
      if (error instanceof Error) {
        errorDetails = error.message;
        // エラーオブジェクトの詳細情報をログに出力
        console.error('Error details:', {
          name: error.name,
          message: error.message,
          stack: error.stack
        });
      }
      
      return NextResponse.json(
        { 
          error: '感情分析に失敗しました',
          details: errorDetails,
          timestamp: new Date().toISOString()
        },
        { status: 500 }
      );
    }
}