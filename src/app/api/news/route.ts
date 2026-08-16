import { NextResponse } from 'next/server';
import Parser from 'rss-parser';

const parser = new Parser();

export async function GET() {
  try {
    // Fetch tech news from TechCrunch or similar RSS
    const feed = await parser.parseURL('https://techcrunch.com/feed/');
    
    const news = feed.items.slice(0, 5).map(item => ({
      title: item.title,
      link: item.link,
      pubDate: item.pubDate,
      creator: item.creator,
      contentSnippet: item.contentSnippet
    }));

    return NextResponse.json(news);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
  }
}
