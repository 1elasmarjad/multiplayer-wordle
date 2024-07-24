"use client";

import { Copy } from "lucide-react";
import { Button } from "../ui/button";
import toast from "react-hot-toast";

export default function GameLink({ gameId }: { gameId: string }) {
  return (
    <Button
      className="flex items-center justify-center gap-2"
      variant="secondary"
      onClick={() => {
        void navigator.clipboard.writeText(`${window.location.origin}?game=${gameId}`);

        toast.success("Copied game invite link to clipboard", {
          position: "bottom-center",
        });
      }}
    >
      Game Invite Link <Copy size={16} />
    </Button>
  );
}
