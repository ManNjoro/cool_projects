/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { BsArrowLeftCircleFill, BsArrowRightCircleFill } from "react-icons/bs";

export default function ImageSlider({ url, limit, page = 1 }) {
  const [images, setImages] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(true);

  async function fetchImages(url) {
    try {
      const response = await fetch(`${url}?page=${page}&limit=${limit}`);
      const data = await response.json();
      if (data) {
        setImages(data);
      }
    } catch (e) {
      setErrorMsg(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (url !== "") fetchImages(url);
  }, [url]);
  console.log(images);
  return loading ? (
    <div>Loading data! Please wait</div>
  ) : (
    <>
      {errorMsg !== null && <div>Error: {errorMsg}</div>}
      <div className="container">
        <BsArrowLeftCircleFill className="arrow arrow-left" />
        {images && images.length
          ? images.map((image) => (
              <img
                key={image.id}
                alt={image.download_url}
                src={image.download_url}
                className="current-image"
              />
            ))
          : null}
        <BsArrowRightCircleFill className="arrow arrow-right" />
        <span className="circle-indicators">
          {images && images.length
            ? images.map((_, index) => (
                <button key={index} className="current-indicator"></button>
              ))
            : null}
        </span>
      </div>
    </>
  );
}
