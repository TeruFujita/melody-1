import { NextResponse } from 'next/server';

// 動的インポートを使用
const { GoogleGenerativeAI } = await import('@google/generative-ai');

// Gemini APIクライアントの初期化
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// 定数
const SYSTEM_PROMPT = `あなたは日本の音楽キュレーターです。ユーザーの感情や状況を最重要視し、その気持ちに最も合致する日本の楽曲を厳選して提案してください。
- 2000年以降の曲を優先
- 曲名、アーティスト名、曲の画像URL（ジャケット画像など）、Spotifyの曲リンク（spotify_url）だけを日本語のJSON配列で最低4曲以上返してください
- 例: [{"title": "曲名", "artist": "アーティスト名", "image": "画像URL", "spotify_url": "Spotifyの曲リンク"}, ...]
- 理由やジャンル、リリース年などは一切含めないでください
- 画像URLとSpotifyリンクは公式なもの、または信頼できる音楽配信サービス（Spotify, Apple Music, Amazon Music等）のものを優先してください
- 必ずSpotifyで検索可能な有名曲・正確な表記を使ってください
- ユーザーの入力内容にできるだけ忠実に、感情や状況にピッタリ合う曲を選んでください
- 日本語で出力してください
- 同じ感情や状況でも、返す曲リストは毎回できるだけ違う組み合わせになるようにランダムに選んでください
- 有名曲だけでなく、隠れた名曲やジャンル違いも時々混ぜてください
- 同じ曲が連続しないようにしてください`;

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
  
      // Gemini APIの呼び出し
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
      const prompt = `${SYSTEM_PROMPT}\n\nユーザーの感情・状況: ${text}`;
      const result = await model.generateContent(prompt);
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