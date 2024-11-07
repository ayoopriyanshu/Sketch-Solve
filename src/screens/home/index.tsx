import { useEffect, useRef, useState } from "react";
import { SWATCHES } from "../../constants.ts";
import { ColorSwatch, Group } from "@mantine/core";
import { Button } from "../../components/ui/button.tsx";
import Draggable from "react-draggable";
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
  const [latexPosition, setLatexPosition] = useState({ x: 10, y: 200 });
  const [latexExpression, setLatexExpression] = useState<Array<string>>([]);

  useEffect(() => {
    if (reset) {
      resetCanvas();
      setLatexExpression([]);
      setResult(undefined);
      setDictOfVars({});
      setReset(false);
    }
  }, [reset]);

  useEffect(() => {
    if (result) {
      renderLatexToCanvas(result.expression, result.answer);
    }
  }, [result]);

  useEffect(() => {
    if (latexExpression.length > 0 && window.MathJax) {
      setTimeout(() => {
        window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub]);
      }, 0);
    }
  }, [latexExpression]);

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

    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudfare.com/ajax/libs/mathjax/2.7.9/config/TeX-MML-AM_CHTML.js";
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      window.MathJax.Hub.Config({
        tex2jax: {
          inlineMath: [
            ["$", "$"],
            ["\\(", "\\)"],
          ],
        },
      });
    };

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const renderLatexToCanvas = (expression: string, answer: string) => {
    const latex = `${expression} = ${answer}`;
    setLatexExpression([...latexExpression, latex]);

    // Clear the main canvas
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  const sendData = async () => {
    const canvas = canvasRef.current;
    const apiUrl = import.meta.env.VITE_API_URL;
    console.log("API URL:", apiUrl);
    if (canvas) {
      const response = await axios({
        method: "post",
        url: `${apiUrl}/calculate`,
        data: {
          image: canvas.toDataURL("image/png"),
          dict_of_vars: dictOfVars,
        },
      });
      const resp = await response.data;
      console.log("Response: ", resp);
      resp.data.forEach((data: Response) => {
        if (data.assign === true) {
          // dict_of_vars[resp.result] = resp.answer;
          setDictOfVars({
            ...dictOfVars,
            [data.expr]: data.result,
          });
        }
      });
      const ctx = canvas.getContext("2d");
      const imageData = ctx!.getImageData(0, 0, canvas.width, canvas.height);
      let minX = canvas.width,
        minY = canvas.height,
        maxX = 0,
        maxY = 0;

      for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
          const i = (y * canvas.width + x) * 4;
          if (imageData.data[i + 3] > 0) {
            // If pixel is not transparent
            minX = Math.min(minX, x);
            minY = Math.min(minY, y);
            maxX = Math.max(maxX, x);
            maxY = Math.max(maxY, y);
          }
        }
      }
      const centerX = (minX + maxX) / 2;
      const centerY = (minY + maxY) / 2;

      setLatexPosition({ x: centerX, y: centerY });
      resp.data.forEach((data: Response) => {
        setTimeout(() => {
          setResult({
            expression: data.expr,
            answer: data.result,
          });
        }, 100);
      });
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
      canvas.style.background = "white";
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
      <div className="grid grid-cols-2 gap-3 z-20 p-5 bg-slate-300 relative">
        <h1
          className="flex text-left text-5xl pl-5 pt-7 font-bold "
          style={{
            fontFamily: "monospace",
            fontStyle: "italic",
            fontWeight: 500,
            position: "relative",
            zIndex: 20,
          }}
        >
          Sketch&Solve
        </h1>
        <div className="grid grid-cols-4 gap-2 z-10 p-1">
          <Button
            onClick={() => setReset(true)}
            className="z-20 bg-black text-white hover:bg-slate-400 hover:text-black"
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
            className="z-20 bg-black text-white hover:bg-slate-400 hover:text-black"
            variant="default"
            color="black"
          >
            {" "}
            Calculate{" "}
          </Button>
          <Button
            onClick={undoLastAction}
            className="z-20 bg-black text-white hover:bg-slate-400 hover:text-black"
            variant="default"
            color="black"
          >
            Undo
          </Button>
        </div>
      </div>
      <canvas
        ref={canvasRef}
        id="canvas"
        className="absolute top-0 left-0 w-full h-full z-0"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseOut={stopDrawing}
        onMouseUp={stopDrawing}
      />

      {latexExpression &&
        latexExpression.map((latex, index) => (
          <Draggable
            key={index}
            defaultPosition={latexPosition}
            onStop={(e, data) => setLatexPosition({ x: data.x, y: data.y })}
          >
            <div className="absolute p-2 text-black rounded shadow-lg border-r-7">
              <div className="latex-content">{latex}</div>
            </div>
          </Draggable>
        ))}
    </>
  );
}
