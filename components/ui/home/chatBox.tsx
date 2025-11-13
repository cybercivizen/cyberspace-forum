import { Button } from "../button";
import { Input } from "../input";

export default function ChatBox() {
  return (
    <>
      <div className="flex w-1/2 m-auto bottom-0">
        <Input
          className="bg-background text-black"
          placeholder="Fill me up!!"
        ></Input>
        <Button>Send</Button>
      </div>
    </>
  );
}
