import React, { useState, useEffect, useRef } from "react";

const Scanner = () => {
  const video = useRef(null);
  const canvas = useRef(null);
  const [data, setData] = useState(null);
  const [dataType, setDataType] = useState(null);

  const scannerFormats = [
    "aztec",
    "code_128",
    "code_39",
    "code_93",
    "codabar",
    "data_matrix",
    "ean_13",
    "ean_8",
    "itf",
    "pdf417",
    "qr_code",
    "upc_a",
    "upc_e",
    "unknown",
  ];

  const openCamera = () => {
    navigator.mediaDevices
      .getUserMedia({
        video: { width: 400, height: 400 },
      })
      .then((stream) => {
        video.current.srcObject = stream;
        video.current.play();
        const ctx = canvas.current.getContext("2d");
        const barcodeDetector = new BarcodeDetector({
          formats: scannerFormats,
        });

        setInterval(() => {
          canvas.current.width = video.current.videoWidth;
          canvas.current.height = video.current.videoHeight;
          ctx.drawImage(
            video.current,
            0,
            0,
            video.current.videoWidth,
            video.current.videoHeight
          );
          barcodeDetector
            .detect(canvas.current)
            .then((barcodes) => {
              barcodes.forEach((barcode) => {
                console.log(barcode);
                setData(barcode.rawValue);
                setDataType(barcode.format);
              });
            })
            .catch((err) => {
              console.log(err);
            });
        }, 100);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    console.log(data);
    console.log(dataType);
  }, [data, dataType]);

  return (
    <>
      <div>
        <video ref={video} autoPlay muted hidden></video>
        <canvas ref={canvas} />
      </div>
      <button onClick={openCamera}>Kamerayı Aç</button>
      <div>
        {data && dataType ? (
          <>
            <p>{data}</p>
            <p>{dataType}</p>
          </>
        ) : null}
      </div>
    </>
  );
};

export default Scanner;
