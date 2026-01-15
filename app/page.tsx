"use client";

import { apiClient } from "@/lib/api-client";
import { IVideo } from "@/models/Video";
import { useEffect, useState } from "react";

function Home() {
  const [videos, setVideos] = useState<IVideo[]>([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const data = await apiClient.getVideos();

        setVideos(data);
      } catch (error) {
        console.error("Error while fetching videos", error);
      }
    };

    fetchVideos();
  }, []);

  return (
    <div>
      <h1>Macedon Tech</h1>



    </div>
  );
}

export default Home;

// export default function Home() {
//   const [error, setError] = useState<string | null>(null);
//   const [success, onSuccess] = useState<UploadResponse | null>(null);
//   const [progress, onProgress] = useState<number | null>(null);
//   const [loggedIn, setIsLoggedIn] = useState<boolean>(false);

//   return (
//     <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
//       <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
//         <LoginPage ></LoginPage>
//         <FileUpload
//           onSuccess={onSuccess}
//           onProgress={onProgress}
//           setError={setError}
//         ></FileUpload>
//         {progress && progress > 0 && progress < 100 && (
//           <div className="w-full mt-4">
//             <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
//               <div
//                 className="h-full bg-primary transition-all duration-200"
//                 style={{ width: `${progress}%` }}
//               />
//             </div>
//             <p className="mt-1 text-xs text-gray-500 text-right">
//               {Math.round(progress)}%
//             </p>
//           </div>
//         )}

//         {error && (
//           <div>
//             <h2 className="text-red">{error}</h2>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }
