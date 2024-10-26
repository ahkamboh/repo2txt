'use client'
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Github } from 'lucide-react'

export function ProfileSection() {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger title="click to view profile" asChild>
        <div className="relative w-[90px] h-[90px]">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex items-center justify-center">
              <Button 
                variant="ghost" 
                className="rounded-full p-0 w-[50px] h-[50px] transition-transform hover:scale-105"
              >
                <img
                  src="https://avatars.githubusercontent.com/u/123060177?v=4"
                  alt="Ali Hamza Kamboh"
                  width={50}
                  height={50}
                  className="rounded-full cursor-pointer border-2 border-yellow-400"
                />
              </Button>
            </div>
          </div>
          <svg viewBox="0 0 100 100"  className="w-full h-full">
            <path
              id="curve"
              fill="transparent"
              d="
                M 50, 50
                m -37, 0
                a 37,37 0 1,1 74,0
                a 37,37 0 1,1 -74,0"
            />
            <text fontSize="7.5">
              <textPath xlinkHref="#curve" startOffset="25%" textAnchor="middle">
                Made with ❤️ by ahkamboh
              </textPath>
            </text>
          </svg>
        </div>
      </SheetTrigger>
      <SheetContent className="bg-white text-black flex flex-col">
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold">Ali Hamza Kamboh</SheetTitle>
          <SheetDescription className="text-md text-gray-600">
            This is ALI HAMZA KAMBOH the creator behind repo2txt. I produce
            free and paid resources every few months, visit ALI HAMZA KAMBOH
            for alerts.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6 flex justify-center">
          <img
            src="https://avatars.githubusercontent.com/u/123060177?v=4"
            alt="Ali Hamza Kamboh"
            width={120}
            height={120}
            className="rounded-full border-4 border-yellow-400"
          />
        </div>
        <div className="mt-6 flex justify-center space-x-4">
          <a 
            href="https://alihamzakamboh.com/" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <Button 
              variant="outline" 
              className="bg-white border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
            >
              Visit Website
            </Button>
          </a>
          <a 
            href="https://github.com/ahkamboh" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <Button 
              className="bg-gray-800 text-white hover:bg-gray-700 flex items-center space-x-2"
            >
              <Github className="w-5 h-5" />
              <span>GitHub</span>
            </Button>
          </a>
        </div>
        <div className="mt-auto pt-4 text-center text-sm text-gray-500">
          <a 
            href="https://github.com/ahkamboh/repo2txt" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-blue-500 underline"
          >
            github.com/ahkamboh/repo2txt
          </a>
        </div>
      </SheetContent>
    </Sheet>
  )
}
