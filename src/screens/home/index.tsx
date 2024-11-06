import { useEffect, useRef, useState } from "react";
import { SWATCHES } from "../../constants.ts";
import { ColorSwatch, Group } from "@mantine/core";
import { Button } from "../../components/ui/button.tsx";
import axios from "axios";

interface Response {
  expr: string;
  result: string;
  assign: boolean;
}

interface GeneratedResult {
  expression: string;
  answer: string;
}

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("rbg(255, 255, 255");
  const [reset, setReset] = useState(false);
  const [dictOfVars, setDictOfVars] = useState({});
  const [result, setResult] = useState<GeneratedResult>();
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    if (reset) {
      resetCanvas();
      setReset(false);
    }
  }, [reset]);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight - canvas.offsetTop;
        ctx.lineCap = "round";
        ctx.lineWidth = 3;
      }
    }
  }, []);

  const sendData = async () => {
    const canvas = canvasRef.current;

    if (canvas) {
      const response = await axios({
        method: "post",
        url: `${import.meta.env.VITE_API_URL}/calculate`,
        data: {
          image: canvas.toDataURL("image/png"),
          dict_of_vars: dictOfVars,
        },
      });
      const resp = await response.data;
      console.log("Response: ", resp);
    }
  };

  const resetCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      setHistory([]);
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.style.background = "black";
      const ctx = canvas.getContext("2d");
      if (ctx) {
        saveCanvasState();
        ctx.beginPath();
        ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        setIsDrawing(true);
      }
    }
  };

  const saveCanvasState = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const canvasData = canvas.toDataURL("image/png");
      setHistory((prev) => [...prev, canvasData]);
    }
  };

  const undoLastAction = () => {
    if (history.length === 0) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const lastState = history[history.length - 1];
    setHistory((prev) => prev.slice(0, -1)); // Remove last saved state from history

    const img = new Image();
    img.src = lastState;
    img.onload = () => {
      if (canvas && ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear current canvas
        ctx.drawImage(img, 0, 0); // Draw last saved state
      }
    };
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) {
      return;
    }
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.strokeStyle = color;
        ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        ctx.stroke();
      }
    }
  };

  return (
    <>
      <div className="grid grid-cols-4 gap-2 p-5">
        <Button
          onClick={() => setReset(true)}
          className="z-20 bg-black text-white hover:bg-white hover:text-black"
          variant="default"
          color="black"
        >
          {" "}
          Reset{" "}
        </Button>
        <Group className="z-20">
          {SWATCHES.map((swatch: string) => (
            <ColorSwatch
              key={swatch}
              color={swatch}
              onClick={() => setColor(swatch)}
              style={{
                border:
                  color === swatch
                    ? "3px solid white"
                    : "2px solid transparent",
                borderRadius: "50%", // Ensure a rounded border for circular swatches
              }}
            />
          ))}
        </Group>
        <Button
          onClick={sendData}
          className="z-20 bg-black text-white hover:bg-white hover:text-black"
          variant="default"
          color="black"
        >
          {" "}
          Calculate{" "}
        </Button>
        <Button
          onClick={undoLastAction}
          className="z-20 bg-black text-white hover:bg-white hover:text-black"
          variant="default"
          color="black"
        >
          Undo
        </Button>
      </div>
      <canvas
        ref={canvasRef}
        id="canvas"
        className="absolute top-0 left-0 w-full h-full"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseOut={stopDrawing}
        onMouseUp={stopDrawing}
      />
    </>
  );
}
