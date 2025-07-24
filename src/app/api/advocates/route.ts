import { NextRequest, NextResponse } from 'next/server';
import db from "../../../db";
import { advocates } from "../../../db/schema";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const limit = url.searchParams.get('limit') ?? 25;
    const page = url.searchParams.get('page') ?? 1;
    const offset = (+page - 1) * +limit;

    const data = await db
      .select()
      .from(advocates)
      .limit(+limit)
      .offset(offset);

    // TODO: update to find count from drizzle ORM
    // const [{ count }] = await db
    //   .select()
    //   .from(advocates)
    //   .count('*', { as: 'count' });

    return NextResponse.json({
      data
      // pagination: {
      //   page,
        // limit,
        // total: +count,
        // totalPages: Math.ceil(+count / limit)
      // }
    });

  } catch (err) {
    console.error(`Failed to fetch advocates: ${err}`);

    return NextResponse.json(
      { error: `Failed to fetch advocates: ${err}` },
      { status: 500 }
    );
  }
}
