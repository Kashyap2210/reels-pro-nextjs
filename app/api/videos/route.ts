import { authOptions } from "@/lib/auth.options";
import { connectToDatabase } from "@/lib/db";
import Video, { IVideo } from "@/models/Video";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDatabase();
    const videos = await Video.find({}).sort({ createdAt: -1 }).lean();
    if (!videos || videos.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    return NextResponse.json(videos, { status: 200 });
  } catch (error) {
    console.log("Error during fetching the videos", error);

    return NextResponse.json(
      { error: "Failed to fetch videos" },
      { status: 200 }
    );
  }
}

export async function GETBYID(id: string) {
  try {
    await connectToDatabase();
    const videoById = await Video.findOne({ id: id });
    if (!videoById) {
      return NextResponse.json(null, { status: 200 });
    }

    return NextResponse.json(videoById, { status: 200 });
  } catch (error) {
    console.log("Error during fetching the videos", error);

    return NextResponse.json(
      { error: "Failed to fetch videos" },
      { status: 200 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    }

    await connectToDatabase();

    const body: IVideo = await req.json();

    // all the validations related to the request body are in here
    validateBody(body);

    const videoData: IVideo = {
      ...body,
      controls: body.controls ?? true,
      transformation: {
        height: 1920,
        width: 1080,
        quality: body.transformation?.quality ?? 100,
      },
    };
    const newVideo = await Video.create(videoData);

    return NextResponse.json(newVideo);
  } catch (error) {
    console.log("Error during posting the video", error);

    return NextResponse.json(
      { error: "Failed to fetch videos" },
      { status: 200 }
    );
  }
}

function validateBody(body: IVideo): NextResponse | void {
  const validationKeys: (keyof IVideo)[] = [
    "title",
    "description",
    "videoUrl",
    "thumbnailUrl",
  ];
  for (const key of validationKeys) {
    if (!body[key]) {
      return NextResponse.json(
        {
          error: `Missing Required Parameter: ${key}`,
        },
        { status: 401 }
      );
    }
  }

  return;
}
