import React, { useState, useEffect, useRef } from "react";
import { Label } from "./Label";
import { Input } from "./Input";
import { cn } from "../utils/motion";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { fadeIn } from "../utils/frameranimation";
import { Switch } from "./ui/switch";

export function SubmitDemo() {
  const [isExeFile, setIsExeFile] = useState(false);
  const [isFolder, setIsFolder] = useState(false);
  const [isMobile, setIsMobile] = useState(
    window.matchMedia("(max-width: 500px)").matches,
  );
  let responsiveStyle = "w-full";
  let styleToggle = "text-neutral-400";

  if (isFolder) {
    styleToggle = "text-neutral-800";
  }

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.matchMedia("(max-width: 500px)").matches);
    };

    window.addEventListener("resize", handleResize);
  }, []);

  if (isMobile) {
    responsiveStyle = " w-100";
  }

  const onChangeInput = (e) => {
    const files = e.target.files;

    const isExeOrMsi = Array.from(files).some(
      (file) =>
        file.name.endsWith(".exe") ||
        file.name.endsWith(".msi") ||
        file.name.endsWith(".dmg") ||
        file.name.endsWith(".tar") ||
        file.name.endsWith(".zip") ||
        file.name.endsWith(".appx"),
    );

    setIsExeFile(isExeOrMsi);
  };

  const handleResetForm = (e) => {
    e.preventDefault();
    const form = document.getElementById("form-submit");
    if (confirm("You're about to delete all the input. Continue?") == true) {
      form.reset();
      toast.success("Input cleared!");
      setIsExeFile(false);
    } else {
      return;
    }
  };

  const openFolderTab = () => {
    window.open(
      "https://drive.google.com/drive/folders/1ZD-dOZ2-ctGbfEZk5MqO8Ki4XiIEW8e8?usp=sharing",
      "_blank",
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const form = document.getElementById("form-submit");
    const filename = form.filename.value.trim();
    const files = form.file.files; // Retrieve the uploaded files (can be multiples)

    if (!files.length) {
      toast.error("File cannot be empty!");
      return;
    }

    const url =
      "https://script.google.com/macros/s/AKfycbyMAQxxlczcduxicFmsYqZg9_bAA8enHIiIwLpXeKTBMcL3XWsScwYO5PfgcF_E7Cs/exec";

    Array.from(files).forEach((file) => {
      let PostedName = filename !== "" ? filename : file.name;

      const qs = new URLSearchParams({
        filename: PostedName, // Filename from input or the file name
        mimeType: file.type, // File MIME type
      });

      const reader = new FileReader();

      reader.onload = (f) => {
        const promise = fetch(`${url}?${qs}`, {
          method: "POST",
          mode: "no-cors",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify([...new Int8Array(f.target.result)]), //upload file data as byte array
        });

        toast.promise(promise, {
          loading: "Uploading...",
          success: `File ${file.name} successfully uploaded!`,
          error: "Sorry, something went wrong!",
        });
      };

      reader.readAsArrayBuffer(file); // Read file as array buffer
    });
    form.reset();
  };

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={fadeIn("up", "spring", 0.95, 1.4)}
      className={`mx-auto ${responsiveStyle} max-w-md rounded-lg bg-white px-7 pb-2 pt-8 shadow-input dark:bg-black`}
    >
      <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
        Investindo's Uploader Express
      </h2>
      <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
        Drop file here to upload it to Google Drive
      </p>
      <p className="text-xs text-red-600">
        No need to add filename for .exe, .msi, .zip, .tar
      </p>
      <form
        className="my-6"
        onSubmit={handleSubmit}
        onChange={onChangeInput}
        id="form-submit"
      >
        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">Filename</Label>
          <Input
            id="email"
            placeholder="Name for your file"
            type="text"
            name="filename"
            disabled={isExeFile}
          />
        </LabelInputContainer>
        {isFolder ? (
          <LabelInputContainer className="mb-1">
            <Label htmlFor="password">
              Folder <span className="text-red-600"> *</span>
            </Label>
            <Input
              type="file"
              name="file"
              multiple=""
              webkitdirectory=""
              mozdirectory=""
            />
          </LabelInputContainer>
        ) : (
          <LabelInputContainer className="mb-1">
            <Label htmlFor="password">
              File <span className="text-red-600"> *</span>
            </Label>
            <Input
              placeholder="File goes here"
              type="file"
              name="file"
              multiple
            />
          </LabelInputContainer>
        )}
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Switch onClick={() => setIsFolder(!isFolder)} />
            <Label className={`${styleToggle}`}>Folder</Label>
          </div>
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              className="flex items-center justify-center rounded-lg bg-green-600 px-3 py-1 text-white hover:bg-green-700"
            >
              <a className="text-sm" onClick={openFolderTab}>
                Open Folder
              </a>
            </button>
            <button
              onClick={handleResetForm}
              type="reset"
              className="rounded-lg bg-red-700 px-3 py-1 text-sm text-white hover:bg-red-800"
              id="clear-btn"
            >
              Clear
            </button>
          </div>
        </div>
        <button
          className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
          type="submit"
        >
          Upload &rarr;
          <BottomGradient />
        </button>

        <div className="my-2 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />
      </form>
    </motion.div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  );
};

const LabelInputContainer = ({ children, className }) => {
  return (
    <div className={cn("flex w-full flex-col", className)}>{children}</div>
  );
};
