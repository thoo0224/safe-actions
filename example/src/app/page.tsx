import AlertForm from "@/components/alert-form";
import { randomInt } from "crypto";

export default function Home() {
  return (
    <div>
      <div>RNG: {randomInt(10000)}</div>
      <AlertForm />
    </div>
  );
}
