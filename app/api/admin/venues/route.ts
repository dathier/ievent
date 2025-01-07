import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // 在实际应用中，您需要从数据库获取场地列表
  const venues = [
    { id: 1, name: "Grand Conference Center", location: "New York", capacity: 1000 },
    { id: 2, name: "Seaside Convention Hall", location: "Miami", capacity: 500 },
    // 添加更多场地...
  ];

  return NextResponse.json(venues);
}

export async function POST(request: Request) {
  const data = await request.json();
  // 在实际应用中，您需要将新场地保存到数据库
  console.log("Received new venue:", data);
  return NextResponse.json({ message: "Venue created successfully", id: Date.now() });
}

