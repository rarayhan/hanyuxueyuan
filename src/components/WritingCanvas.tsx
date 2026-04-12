import React, { useRef, useEffect, useState } from 'react';
import { cn } from '../lib/utils';
import { Eraser, RotateCcw, Play, Eye } from 'lucide-react';
import HanziWriter from 'hanzi-writer';

interface WritingCanvasProps {
  character: string;
  className?: string;
}

export default function WritingCanvas({ character, className }: WritingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const writersRef = useRef<HanziWriter[]>([]);
  const writerContainerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [showGuide, setShowGuide] = useState(true);

  // Drawing Canvas Logic
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.strokeStyle = '#1A1A1A';
    context.lineWidth = 12;
    setCtx(context);

    drawGrid(context, canvas.width, canvas.height);
  }, []);

  // HanziWriter Logic
  useEffect(() => {
    if (!writerContainerRef.current) return;

    // Clear previous writers
    writerContainerRef.current.innerHTML = '';
    writersRef.current = [];
    
    const chars = character.split('');
    const charSize = chars.length > 3 ? 40 : chars.length > 2 ? 60 : chars.length > 1 ? 100 : 150;

    chars.forEach((char) => {
      const charDiv = document.createElement('div');
      charDiv.style.display = 'inline-block';
      charDiv.style.margin = '2px';
      writerContainerRef.current?.appendChild(charDiv);

      const writer = HanziWriter.create(charDiv, char, {
        width: charSize,
        height: charSize,
        padding: 5,
        strokeColor: '#C41E3A',
        outlineColor: 'rgba(26, 26, 26, 0.07)',
        drawingColor: '#1A1A1A',
        showOutline: true,
        showCharacter: false,
      });
      writersRef.current.push(writer);
    });

    // Reset drawing canvas when character changes
    if (ctx && canvasRef.current) {
      drawGrid(ctx, canvasRef.current.width, canvasRef.current.height);
    }
  }, [character, ctx]);

  const drawGrid = (context: CanvasRenderingContext2D, width: number, height: number) => {
    context.clearRect(0, 0, width, height);
    context.strokeStyle = 'rgba(196, 30, 58, 0.2)'; 
    context.lineWidth = 1;
    context.setLineDash([5, 5]);

    context.beginPath();
    context.moveTo(0, height / 2);
    context.lineTo(width, height / 2);
    context.stroke();

    context.beginPath();
    context.moveTo(width / 2, 0);
    context.lineTo(width / 2, height);
    context.stroke();

    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(width, height);
    context.stroke();

    context.beginPath();
    context.moveTo(width, 0);
    context.lineTo(0, height);
    context.stroke();

    context.setLineDash([]);
    context.strokeStyle = '#1A1A1A';
    context.lineWidth = 12;
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if (!ctx) return;
    setIsDrawing(true);
    const { x, y } = getPos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !ctx) return;
    const { x, y } = getPos(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const clear = () => {
    if (!ctx || !canvasRef.current) return;
    drawGrid(ctx, canvasRef.current.width, canvasRef.current.height);
  };

  const animateStroke = () => {
    const animateSequence = async () => {
      for (const writer of writersRef.current) {
        await writer.animateCharacter();
      }
    };
    animateSequence();
  };

  return (
    <div className={cn("flex flex-col items-center gap-8", className)}>
      <div className="flex gap-8 items-start">
        {/* Stroke Order Guide */}
        <div className="flex flex-col items-center gap-4">
          <div className="text-xs font-bold uppercase tracking-widest text-ink/40">Stroke Order</div>
          <div className="ink-glass p-4 rounded-xl bg-white/40 flex items-center justify-center min-w-[180px] min-h-[180px]">
            <div ref={writerContainerRef} className="flex flex-wrap justify-center items-center gap-2" />
          </div>
          <button
            onClick={animateStroke}
            className="flex items-center gap-2 px-4 py-2 bg-cinnabar text-white rounded-lg hover:bg-cinnabar/90 transition-all shadow-lg shadow-cinnabar/20 font-bold text-sm"
          >
            <Play size={16} fill="currentColor" />
            Animate
          </button>
        </div>

        {/* Practice Canvas */}
        <div className="flex flex-col items-center gap-4">
          <div className="text-xs font-bold uppercase tracking-widest text-ink/40">Practice Area</div>
          <div className="relative ink-glass p-4 rounded-xl bg-white">
            <div className={cn(
              "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-9xl text-ink/5 font-serif pointer-events-none select-none transition-opacity",
              showGuide ? "opacity-100" : "opacity-0"
            )}>
              {character}
            </div>
            <canvas
              ref={canvasRef}
              width={300}
              height={300}
              className="cursor-crosshair touch-none relative z-10"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={clear}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-ink/10 rounded-lg hover:bg-parchment transition-colors text-sm font-medium"
            >
              <RotateCcw size={16} />
              Clear Canvas
            </button>
            <button
              onClick={() => setShowGuide(!showGuide)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors text-sm font-medium",
                showGuide ? "bg-ink text-parchment border-ink" : "bg-white text-ink border-ink/10"
              )}
            >
              <Eye size={16} />
              {showGuide ? "Hide Guide" : "Show Guide"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
