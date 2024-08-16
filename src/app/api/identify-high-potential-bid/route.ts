// File: src/app/api/identify-high-potential-bid/route.ts

import { openai, predefinedKeywords } from '@/utils/declarations';
import { NextRequest, NextResponse } from 'next/server';

export const maxDuration = 30;
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { items } = await req.json();

    const systemPrompt = `
      You are an expert in identifying high potential bidding items in industrial and technical contexts. 
      Your task is to analyze a list of items and identify which ones have high potential for bidding based on the following criteria:

      1. The item's description contains words related to or synonymous with these keywords: ${predefinedKeywords.join(', ')}.
      2. The matching doesn't need to be exact, but should be closely related or indicate a similar function or category.
      3. Consider technical terms, industry-specific language, and potential variations or sub-components of the given keywords.
      4. Take into account the context of the item, its potential importance in industrial processes, and its likely demand in bidding scenarios.

      final response instructions:
      - Provide your final response as a JSON array of identified items with only the high potential with no other additional comments and texts 
      - maintaining the original structure of each item in your new respone.
    `;

    const userPrompt = `
      Analyze the following list of items and identify which ones are high potential for bidding based on the criteria provided:

      ${JSON.stringify(items, null, 2)}

      Return only the high potential items in a JSON array format, maintaining the original structure of each item.
    `;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.2, // Low temperature for more deterministic results
    });

    const highPotentialItems = JSON.parse(completion.choices[0].message.content || '[]');

    return NextResponse.json({ highPotentialItems });
  } catch (error: any) {
    console.error('Error identifying high potential items:', error);
    return NextResponse.json({ error: 'An error occurred during high potential item identification.' }, { status: 500 });
  }
}
