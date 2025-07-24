import { NextRequest, NextResponse } from 'next/server';
import db from "../../../db";
import { advocates } from "../../../db/schema";
import { advocateData } from "../../../db/seed/advocates";

export async function POST(request: NextRequest) {
  try {
    const records = await db.insert(advocates).values(advocateData).returning();

    return NextResponse.json({ advocates: records }, { status: 201 });
  } catch (err) {
    console.error(`Error posting advocates: ${err}`);

    return NextResponse.json(
      { error: `Failed to post advocates: ${err}` },
      { status: 500 }
    );
  }
}
