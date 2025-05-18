import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// OpenAIクライアントの初期化
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 定数
const SYSTEM_PROMPT = "あなたは日本の音楽キュレーターです。ユーザーの感情や状況を細かく分析し、その気持ちに最も寄り添う日本の楽曲を提案してください。\
- 2000年以降の曲を優先\
- 歌詞の内容やメッセージが感情に合っているか吟味\
- 感情の強さやニュアンスも考慮\
- 曲名・アーティスト名・ジャンル・リリース年・なぜこの曲が合うのかの理由を日本語で\
- 3曲程度リスト形式で";
const USER_PROMPT = (text: string) => 
  `ユーザーの感情・状況: ${text}`;

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