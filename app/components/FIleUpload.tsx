"use client";
import {
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitUploadNetworkError,
  upload,
  UploadResponse,
} from "@imagekit/next";
import { Loader2 } from "lucide-react";
import { useRef, useState } from "react";

export interface IFileUploadProp {
  onSuccess: (response: UploadResponse) => void;
  onProgress?: (progress: number) => void;
  setError: (error: string) => void;
  fileType?: "image" | "video";
}

// UploadExample component demonstrates file uploading using ImageKit's Next.js SDK.
export default function FileUpload({
  onSuccess,
  onProgress,
  setError,
  fileType = "image",
}: IFileUploadProp) {
  const [uploading, setUploading] = useState();
  // Create a ref for the file input element to access its files easily
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Create an AbortController instance to provide an option to cancel the upload if needed.
  const abortController = new AbortController();

  /**
   * Authenticates and retrieves the necessary upload credentials from the server.
   *
   * This function calls the authentication API endpoint to receive upload parameters like signature,
   * expire time, token, and publicKey.
   *
   * @returns {Promise<{signature: string, expire: string, token: string, publicKey: string}>} The authentication parameters.
   * @throws {Error} Throws an error if the authentication request fails.
   */
  const authenticator = async () => {
    try {
      // Perform the request to the upload authentication endpoint.
      const response = await fetch("/api/auth/imagekit-auth");
      if (!response.ok) {
        // If the server response is not successful, extract the error text for debugging.
        const errorText = await response.text();
        throw new Error(
          `Request failed with status ${response.status}: ${errorText}`
        );
      }

      // Parse and destructure the response JSON for upload credentials.
      const data = await response.json();
      const { signature, expire, token, publicKey } = data;
      return { signature, expire, token, publicKey };
    } catch (error) {
      // Log the original error for debugging before rethrowing a new error.
      console.error("Authentication error:", error);
      throw new Error("Authentication request failed");
    }
  };

  const validateFile = (file: File) => {
    if (fileType === "video") {
      if (!file.type.startsWith("video/")) {
        // console.log("Please upload a video");
        return "Please upload a video";
      }
    } else {
      const validTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!validTypes.includes(file.type)) {
        return `Allowed image types are ${validTypes.join(
          ", "
        )}.Image uploaded by you is ${file.type}.`;
      }
    }

    if (file.size > 10_000_000) {
      // console.log(
      //   `File size should be less than: ${10_000_000}. File uploaded by you has size: ${
      //     file.size
      //   }`
      // );
      return `File size should be less than: ${10_000_000}`;
    }

    return null;
  };

  /**
   * Handles the file upload process.
   *
   * This function:
   * - Validates file selection.
   * - Retrieves upload authentication credentials.
   * - Initiates the file upload via the ImageKit SDK.
   * - Updates the upload progress.
   * - Catches and processes errors accordingly.
   */
  const handleUpload = async () => {
    // Access the file input element using the ref
    const fileInput = fileInputRef.current;
    if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
      alert("Please select a file to upload");
      return;
    }

    for (const file of fileInput.files) {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }
    }

    // Extract the first file from the file input
    const file = fileInput.files[0];

    // Retrieve authentication parameters for the upload.
    let authParams;
    try {
      authParams = await authenticator();
    } catch (authError) {
      console.error("Failed to authenticate for upload:", authError);
      return;
    }
    const { signature, expire, token, publicKey } = authParams;

    // Call the ImageKit SDK upload function with the required parameters and callbacks.
    try {
      const uploadResponse: UploadResponse = await upload({
        // Authentication parameters
        expire,
        token,
        signature,
        publicKey,
        file,
        fileName: file.name, // Optionally set a custom file name
        // Progress callback to update upload progress state
        folder: file.type === "video" ? "/videos" : "/images",
        onProgress: onProgress
          ? (e) => onProgress((e.loaded / e.total) * 100)
          : undefined,
        // Abort signal to allow cancellation of the upload if needed.
        abortSignal: abortController.signal,
      });
      // console.log("Upload response:", uploadResponse);
      onSuccess(uploadResponse);
    } catch (error) {
      // Handle specific error types provided by the ImageKit SDK.
      let message = "Unknown upload error";

      if (error instanceof ImageKitAbortError) {
        message = error.reason as string;
      } else if (error instanceof ImageKitInvalidRequestError) {
        message = error.message;
      } else if (error instanceof ImageKitUploadNetworkError) {
        message = error.message;
      } else if (error instanceof ImageKitServerError) {
        message = error.message;
      }

      setError(message);

      // if (error instanceof ImageKitAbortError) {
      //   console.error("Upload aborted:", error.reason);
      // } else if (error instanceof ImageKitInvalidRequestError) {
      //   console.error("Invalid request:", error.message);
      // } else if (error instanceof ImageKitUploadNetworkError) {
      //   console.error("Network error:", error.message);
      // } else if (error instanceof ImageKitServerError) {
      //   console.error("Server error:", error.message);
      // } else {
      //   // Handle any other errors that may occur.
      //   console.error("Upload error:", error);
      // }
      // if (error) {
      //   setError(`${error}`);
      // }
    }
  };

  return (
    <>
      {/* File input element using React ref */}
      <div className="flex  flex-col gap-4 max-w-sm ">
        {/* Hidden native input */}
        <input
          type="file"
          ref={fileInputRef}
          id="file-upload"
          className="hidden"
        />

        {/* Custom file picker */}
        <label
          htmlFor="file-upload"
          className="cursor-pointer rounded-lg border border-dashed border-gray-500 px-4 py-6 text-center text-sm text-gray-300 hover:border-primary hover:text-primary transition"
        >
          <p className="font-medium">Click to select a file</p>
          <p className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP up to 1MB</p>
        </label>

        {/* Upload button */}
        <button
          type="button"
          onClick={handleUpload}
          disabled={uploading}
          className="
      flex items-center justify-center gap-2
      rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white
      hover:bg-primary/90
      disabled:opacity-60 disabled:cursor-not-allowed
      transition
    "
        >
          {uploading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <div className="border border-gray-200 h-12 w-full flex items-center justify-center rounded-2xl pointer cursor-pointer">
              <p>"Upload file"</p>
            </div>
          )}
        </button>
      </div>
      {/* Display the current upload progress */}
    </>
  );
}
