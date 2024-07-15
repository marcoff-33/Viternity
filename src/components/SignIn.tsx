import { signIn } from "@/app/utils/auth";
import { Button } from "./ui/button";
import { FcGoogle } from "react-icons/fc";

export function SignIn() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("google");
      }}
    >
      <Button type="submit" className="flex gap-1 flex-row font-semibold">
        <FcGoogle size={25} />
        Sign in with Google
      </Button>
    </form>
  );
}
