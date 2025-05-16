import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// OpenAIクライアントの初期化
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 定数
const SYSTEM_PROMPT = "あなたは感情分析の専門家です。ユーザーの感情を分析し、Spotifyで検索するのに最適なキーワードを生成してください。";
const USER_PROMPT = (text: string) => 
  `以下の感情を分析し、Spotifyで検索するのに最適なキーワードを生成してください。キーワードは英語で、音楽のジャンルや雰囲気を表す単語を含めてください：${text}`;

export async function POST(request: Request) {
    try {
      // リクエストボディの取得
      const { text } = await request.json();
      console.log('Received text:', text);
  
      // 環境変数のチェック
      if (!process.env.OPENAI_API_KEY) {
        console.error('OPENAI_API_KEY is not defined');
        return NextResponse.json(
          { error: 'APIキーが設定されていません' },
          { status: 500 }
        );
      }
  
      // OpenAI APIの呼び出し
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: USER_PROMPT(text) }
        ],
        temperature: 0.7,
        max_tokens: 100,
      });
  
      // レスポンスの処理
      const keywords = response.choices[0]?.message?.content || '';
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