import React, { useState } from "react";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "./ui/input-otp";
import { Vault } from "./UserVaults";
import { Button } from "./ui/button";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { useToast } from "./ui/use-toast";
import { title } from "process";
import { Description } from "@radix-ui/react-toast";
import { set } from "zod";

export default function OtpInput({
  vaultPassword,
  setOtpIsCorrect,
  blockAccess,
}: {
  vaultPassword: string;
  setOtpIsCorrect: (value: boolean) => void;
  blockAccess: boolean;
}) {
  // attempts block to be implemented, for now used only for re-rendering otp
  const [wrongAttempts, setWrongAttemps] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);
  const [currentOtpValue, setCurrentOtpValue] = useState("");

  const { toast } = useToast();

  const handleClick = () => {
    if (vaultPassword === currentOtpValue) {
      setTimeout(() => {
        setCurrentOtpValue("");
      }, 100);
      setIsDisabled(true);
      toast({
        title: "Correct Password",
        description: "Loading your vault ...",
        duration: 4000,
        variant: "successful",
      });
      setTimeout(() => {
        setOtpIsCorrect(true);
      }, 2000);
    } else {
      setIsDisabled(true);
      toast({
        title: "Wrong Password",
        description: "Please enter the correct password",
        duration: 5000,
        variant: "destructive",
      }),
        setCurrentOtpValue(""),
        setTimeout(() => {
          setIsDisabled(false);
        }, 500);
      setWrongAttemps((attempts) => attempts + 1);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center w-full h-full">
      {!blockAccess ? (
        <>
          <div className="text-4xl text-foreground self-center py-5 font-bold">
            Password Required to edit this Vault ...
          </div>
          <div className="transition-all duration-500">
            <InputOTP
              key={wrongAttempts}
              value={currentOtpValue}
              onChange={(value) => setCurrentOtpValue(value)}
              maxLength={6}
              className={`font-bold text-lg text-green-500`}
              autoFocus
              disabled={isDisabled}
              onComplete={handleClick}
              pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
            >
              <InputOTPGroup autoFocus inputMode="text" className="">
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>
          <div className="w-full items-center flex justify-center py-5 flex-col gap-2">
            <Button className="z-[1000] self-center font-semibold">
              Submit
            </Button>
          </div>{" "}
        </>
      ) : (
        <div className="">xD</div>
      )}
    </div>
  );
}
