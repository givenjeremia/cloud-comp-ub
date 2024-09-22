"use client"

import { FloatingNav } from "@/components/ui/floating-navbar";
import { IconHome, IconMessage, IconUser } from "@tabler/icons-react";
import { Brain, Clipboard, Medal } from "lucide-react";

export function Navbar() {
    const navItems = [
        {
            name: "Generator Nama",
            link: "#generator",
            icon: <Brain className="h-4 w-4 text-white" />,
        },
        {
            name: "Nama Terpopuler",
            link: "#popular",
            icon: <Medal className="h-4 w-4 text-white" />,
        },
        {
            name: "Tips-tips",
            link: "#tips",
            icon: (
                <Clipboard className="h-4 w-4 text-white" />
            ),
        },
    ];
    return (
        <div className="relative  w-full">
            <FloatingNav navItems={navItems} />
        </div>
    );
}