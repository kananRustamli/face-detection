import React, { useContext, useState, useEffect, useRef } from "react";
import { AppContext } from "../context/AppContext";
import * as faceapi from "face-api.js";

const ImageScreen = () => {
  const { imageState } = useContext(AppContext);
  const [image, setImage] = imageState;
  const [faces, setFaces] = useState([]);
  const [option, setOption] = useState("expression");
  const imgRef = useRef();
  const canvasRef = useRef();
  if (image) {
    var { url, width, height } = image;
  }

  const handleImg = async () => {
    const detections = await faceapi
      .detectAllFaces(imgRef.current, new faceapi.SsdMobilenetv1Options())
      .withFaceExpressions()
      .withAgeAndGender();
    const resizedDetections = faceapi.resizeResults(detections, {
      width,
      height,
    });
    setFaces(
      resizedDetections.map((d) => ({
        coords: Object.values(d.detection.box),
        expression: Object.keys(d.expressions).reduce((a, b) =>
          d.expressions[a] > d.expressions[b] ? a : b
        ),
        age: Math.floor(d.age),
        gender: d.gender,
      }))
    );
  };

  useEffect(() => {
    const loadModels = async () => {
      try {
        await faceapi.nets.ssdMobilenetv1.loadFromUri("/models");
        await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
        await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
        await faceapi.nets.faceExpressionNet.loadFromUri("/models");
        await faceapi.nets.ageGenderNet.loadFromUri("/models");
        handleImg();
      } catch (error) {
        console.log(error);
      }
    };
    image && loadModels();
  }, [image]);

  const drawFaceDetections = () => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.lineWidth = 2;
    ctx.strokeStyle = "white";
    faces.map((face) => {
      const { coords } = face;
      ctx.strokeRect(...coords);
    });
  };

  return (
    <div className="image-screen">
      {image && (
        <div className="btn-group my-2">
          <button
            className={`btn ${option === "face" && "btn-primary"}`}
            onClick={() => {
              setOption("face");
              drawFaceDetections();
            }}
          >
            Face
          </button>
          <button
            className={`btn ${option === "age" && "btn-primary"}`}
            onClick={() => setOption("age")}
          >
            Age
          </button>
          <button
            className={`btn ${option === "gender" && "btn-primary"}`}
            onClick={() => setOption("gender")}
          >
            Gender
          </button>
          <button
            className={`btn ${option === "expression" && "btn-primary"}`}
            onClick={() => setOption("expression")}
          >
            Expression
          </button>
        </div>
      )}
      <div className="img-field" style={{ position: "relative" }}>
        {image && (
          <img
            style={{ position: "absolute" }}
            crossOrigin="anonymous"
            src={url}
            width={width}
            height={height}
            ref={imgRef}
          />
        )}
        {image && (
          <canvas
            ref={canvasRef}
            width={width}
            height={height}
            style={{ position: "absolute" }}
            onClick={() => drawFaceDetections()}
          />
        )}
        {option !== "face" &&
          faces.map((face, index) => (
            <span
              key={index}
              className="badge bg-primary"
              style={{
                position: "absolute",
                top: face.coords[1] + face.coords[3] + 5,
                left: face.coords[0],
              }}
            >
              {option === "age" && face.age}
              {option === "expression" && face.expression}
              {option === "gender" && face.gender}
            </span>
          ))}
      </div>
    </div>
  );
};

export default ImageScreen;
