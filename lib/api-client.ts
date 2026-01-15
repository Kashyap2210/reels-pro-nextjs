import { IVideo } from "@/models/Video";

export type IVideoFormData = Omit<IVideo, "_id">;

export type IFetchOptions<T> = {
  method?: "GET" | "POST" | "PUT";
  body?: T;
  headers?: Record<string, string>;
};

class ApiClient {
  private async fetch<T>(
    endPoint: string,
    options: IFetchOptions<T> = {} as IFetchOptions<T>
  ): Promise<any> {
    const { method = "GET", body, headers = {} } = options;

    const defaultHeaders = {
      "Content-Type": "application.json",
      ...headers,
    };
    const response = await fetch(`/api${endPoint}`, {
      method,
      headers: defaultHeaders,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return response.json;
  }

  async getVideos(): Promise<IVideo[]> {
    return this.fetch<IVideo[]>("/videos");
  }

  // implement this method in the routers of the videos file
  async getVideoById(id: string): Promise<IVideo> {
    return this.fetch(`/videos/${id}`);
  }

  async createVideo(videoData: IVideoFormData) {
    return this.fetch("/videos", {
      method: "POST",
      body: videoData,
    });
  }
}

export const apiClient = new ApiClient();
