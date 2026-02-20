import { cn } from "@/lib/utils";
import { CanvasText } from "@/components/ui/canvas-text";

export default function CanvasTextDemo() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <h1 className="text-4xl font-bold md:text-6xl">
        Ship landing pages at{" "}
        <CanvasText text="warp speed" className="text-4xl font-bold md:text-6xl" />
      </h1>
    </div>
  );
}
