import React from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "./ui/input-otp";
import { Vault } from "./UserVaults";
import { Button } from "./ui/button";

export default function OtpInput({
  vaultPassword,
  setOtpIsCorrect,
}: {
  vaultPassword: string;
  setOtpIsCorrect: (value: boolean) => void;
}) {
  const [currentOtpValue, setCurrentOtpValue] = React.useState("");
  const [error, setError] = React.useState("");
  const handleClick = () => {
    correctOtp === currentOtpValue
      ? setOtpIsCorrect(true)
      : setError("Wrong Password");
  };
  const correctOtp = "123456";
  return (
    <div className="">
      <InputOTP
        maxLength={6}
        onChange={(value) => setCurrentOtpValue(value)}
        className="text-white font-bold text-lg"
        autoFocus
      >
        <InputOTPGroup autoFocus inputMode="text">
          <InputOTPSlot index={0} autoFocus />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} onChange={(e) => console.log("last input")} />
        </InputOTPGroup>
      </InputOTP>
      <div className="w-full items-center flex justify-center py-5 flex-col gap-2">
        <p className="text-red-500">{error ? `${error} !` : ""}</p>
        <Button onClick={handleClick} className="z-[1000] self-center">
          Submit
        </Button>
      </div>
    </div>
  );
}
