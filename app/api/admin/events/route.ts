import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // 在实际应用中，您需要从数据库获取事件列表
  const events = [
    { id: 1, title: "Tech Conference 2023", date: "2023-09-15", status: "approved" },
    { id: 2, title: "Music Festival", date: "2023-10-01", status: "pending" },
    // 添加更多事件...
  ];

  return NextResponse.json(events);
}

export async function POST(request: Request) {
  const data = await request.json();
  // 在实际应用中，您需要将新事件保存到数据库
  console.log("Received new event:", data);
  return NextResponse.json({ message: "Event created successfully", id: Date.now() });
}

