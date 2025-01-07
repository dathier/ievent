import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // 在实际应用中，您需要从数据库获取网站内容
  const websiteContent = {
    hero: {
      title: "Welcome to iEvents",
      description: "The best platform for managing your events"
    },
    featuredEvents: [
      { id: 1, title: "Tech Conference 2023", date: "2023-09-15" },
      { id: 2, title: "Music Festival", date: "2023-10-01" }
    ],
    // 添加更多网站内容...
  };

  return NextResponse.json(websiteContent);
}

export async function POST(request: Request) {
  const data = await request.json();
  // 在实际应用中，您需要将数据保存到数据库
  console.log("Received website content update:", data);
  return NextResponse.json({ message: "Website content updated successfully" });
}

