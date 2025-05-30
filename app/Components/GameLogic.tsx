"use client";

import React, { useState, useEffect } from "react";

/* Import UI components */
import {
  InputOTP,
  InputOTPGroup,
  // InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Car } from "lucide-react";

/* Array containing the answers */
const binaryMap: Record<string, string> = {
  "0": "0000",
  "1": "0001",
  "2": "0010",
  "3": "0011",
  "4": "0100",
  "5": "0101",
  "6": "0110",
  "7": "0111",
  "8": "1000",
  "9": "1001",
  A: "1010",
  B: "1011",
  C: "1100",
  D: "1101",
  E: "1110",
  F: "1111",
};

export default function GameLogic() {
  /* Déclaration des valeurs dynamiques */
  const [currentKey, setCurrentKey] = useState(""); // This will store the hex character
  const [currentBinary, setCurrentBinary] = useState(""); // This will store the expected binary
  const [userInput, setUserInput] = useState<string[]>(Array(4).fill(""));
  const [timer, setTimer] = useState(120);
  const [score, setScore] = useState(0);
  const [hint, setHint] = useState(false); // State he toggle hints to false by default

  /* Function to select a random letter/number */
  const selectRandomLetterOrNumber = () => {
    const keys = Object.keys(binaryMap);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    setCurrentKey(randomKey); // Store the key (0-9, A-F)
    setCurrentBinary(binaryMap[randomKey]); // Store the binary value for checking answers
  };

  /* Game initialization */
  useEffect(() => {
    // Select initial letter/number
    selectRandomLetterOrNumber();

    // Timer setup
    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 0) return 0;
        return prevTimer - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Handle user submission with a function

  const guessAnswer = userInput.join("");
  const handleSubmit = () => {
    if (guessAnswer === currentBinary) {
      setScore(score + 1);
      selectRandomLetterOrNumber();
      setUserInput(Array(4).fill(""));
    } else {
      console.log("Incorrect guess");
      selectRandomLetterOrNumber();
      setUserInput(Array(4).fill(""));
    }
  };

  /* Reset Game when Timer reaches zero */
  useEffect(() => {
    if (timer === 0) {
      console.log("Time's up !");
      console.log("Game Over! Your score is:", score);
      // Reset game state
      setCurrentKey("");
      setCurrentBinary("");
      setUserInput(Array(4).fill(""));
      setTimer(120);
      setScore(0);
      selectRandomLetterOrNumber(); // Select new letter/number for the next game
    }
  }, [timer, score]);

  /* Render the game logic */

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center min-h-screen bg-gradient-to-b from-background to-muted p-4 gap-6">
      {/* Game section */}
      <div className="w-full max-w-md">
        <Card className="shadow-xl border-primary/20">
          <CardHeader className="space-y-2 pb-2">
            <CardTitle className="text-2xl text-center text-primary">
              Binary Challenge
            </CardTitle>
            <CardDescription className="text-center text-lg">
              Convert the hexadecimal value to binary
            </CardDescription>
          </CardHeader>

          {/* Hex display */}
          <CardContent className="space-y-6">
            <div className="flex justify-center items-center">
              <div className="bg-secondary/30 rounded-xl p-8 border border-primary/20 shadow-inner">
                <span className="text-6xl font-bold text-primary">
                  {currentKey}
                </span>
              </div>
            </div>

            {/* Binary input */}
            <div className="pt-4 flex flex-col items-center">
              <p className="text-sm text-muted-foreground mb-2 text-center">
                Enter binary (0s and 1s):
              </p>
              <InputOTP
                maxLength={4}
                value={userInput.join("")}
                onChange={(value) => setUserInput(value.split(""))}
                className="justify-center space-x-2 text-center"
                placeholder="Enter 4 bits"
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} className="h-12 w-12 text-lg" />
                  <InputOTPSlot index={1} className="h-12 w-12 text-lg" />
                  <InputOTPSlot index={2} className="h-12 w-12 text-lg" />
                  <InputOTPSlot index={3} className="h-12 w-12 text-lg" />
                </InputOTPGroup>
              </InputOTP>
            </div>
          </CardContent>

          <CardFooter className="flex justify-center pb-6">
            <Button
              size="lg"
              className="w-full max-w-xs bg-primary hover:bg-primary/90 text-lg"
              onClick={handleSubmit}
            >
              Submit Answer
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Stats section */}
      <div className="w-full max-w-xs mt-6 lg:mt-0">
        <Card className="shadow-lg border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl text-center">Game Stats</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Timer display */}
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Time Remaining:</p>
              <div className="w-full bg-secondary/30 rounded-full h-4 overflow-hidden">
                <div
                  className="bg-primary h-full transition-all duration-1000 ease-linear"
                  style={{ width: `${(timer / 120) * 100}%` }}
                ></div>
              </div>
              <p className="text-xl font-mono text-center">
                {Math.floor(timer / 60)}:
                {(timer % 60).toString().padStart(2, "0")}
              </p>
            </div>

            {/* Score display */}
            <div className="pt-4 text-center">
              <p className="text-sm text-muted-foreground">Current Score</p>
              <p className="text-4xl font-bold text-primary">{score}</p>
            </div>
          </CardContent>
        </Card>

        {/* Correct or Wrong Answer */}
        <Card className="mt-6 shadow-lg border-primary/20">
          <CardContent>
            <div className="text-center">
              {guessAnswer === currentBinary ? (
                <p className="text-3xl font-bold text-green-500">
                  Correct Answer !
                </p>
              ) : (
                <p className="text-3xl font-bold text-red-500">
                  Wrong Answer !
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Hints/Help Section */}
      <div className="w-full max-w-xs mt-6 lg:mt-0">
        <Card className="shadow-lg border-primary/20">
        </Card>
      </div>
    </div>
  );
}
