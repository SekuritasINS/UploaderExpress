import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { SubmitDemo } from "../components/SubmitForm";
import axios from "axios";
import AccessDenied from "../components/AccessDenied";
import SpotlightPreview from "../components/SpotlightPreview";
import { LampContainer } from "../components/LampDemo";


const Main = () => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(
    window.matchMedia("(max-width: 500px)").matches,
  );

  useEffect(() => {
    axios
      .get("https://backend-express-uploader.vercel.app/")
      .then((response) => {
        console.log(response.data);
        setError(false);
      })
      .catch((error) => {
        console.log(error);
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.matchMedia("(max-width: 500px)").matches);
    };

    window.addEventListener("resize", handleResize);
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <>
      {error ? (
        <div className="flex h-screen items-center justify-center">
          <AccessDenied />
        </div>
      ) : isMobile ? (
        <SpotlightPreview>
          <Toaster />
          <div className="flex h-screen items-center justify-center">
            <SubmitDemo />
          </div>
        </SpotlightPreview>
      ) : (
        <LampContainer>
          <Toaster />
          <div className="w-full">
            <SubmitDemo />
            <div className="flex justify-end"></div>
          </div>
        </LampContainer>
      )}
    </>
  );
};

export default Main;
