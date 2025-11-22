"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card } from "../ui/card";
import { ChevronDownIcon, PencilIcon } from "@heroicons/react/24/solid";
import { TrashIcon } from "@heroicons/react/24/solid";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";

export default function ChatBox() {
  const maxCharacters = 100;

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [isMsgHovered, setIsMsgHovered] = useState<number | null>(null);
  const [showOptions, setShowOptions] = useState<number | null>(null);

  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editedMessage, setEditedMessage] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deletingIndex, setDeletingIndex] = useState<number | null>(null);

  const handleSend = () => {
    console.log("Message sent:", message);
    if (message.trim() === "") return;
    setMessages([...messages, message]);
    setMessage("");
  };

  const handleMsgOptions = (index: number) => {
    console.log("Options for message index:", index);
    if (showOptions === index) {
      setShowOptions(null);
      return;
    }
    setShowOptions(index);
  };

  const handleMsgHover = () => {
    setIsMsgHovered(null);
    setShowOptions(null);
  };

  const handleMsgDelete = (index?: number) => {
    console.log("Delete message index:", index);
    setOpenDeleteDialog(true);
    setDeletingIndex(index ?? null);
    setShowOptions(null);
  };

  const handleDeleteSave = (index?: number) => {
    console.log("Delete message index:", index);
    const updatedMessages = messages.filter((_, i) => i !== index);
    setMessages(updatedMessages);
    setOpenDeleteDialog(false);
  };

  const handleMsgEdit = (index: number) => {
    console.log("Edit message");
    setOpenEditDialog(true);
    setEditingIndex(index);
    setEditedMessage(messages[index]);
  };

  const handleEditSave = () => {
    console.log("Save edited message:", editedMessage);
    const updatedMessages = messages.map((msg, i) =>
      i === editingIndex ? editedMessage : msg
    );
    setMessages(updatedMessages);
    setOpenEditDialog(false);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      <AlertDialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Do you want to edit this message?
            </AlertDialogTitle>
            <Input
              placeholder="Edit your message..."
              value={editedMessage}
              onChange={(e) => setEditedMessage(e.target.value)}
            />
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleEditSave}>
              Save Changes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>

            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              message.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                variant="destructive"
                onClick={() => handleDeleteSave(deletingIndex ?? undefined)}
              >
                Delete
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Card
        className={`overflow-auto flex gap-0 flex-col w-10/12 p-0 ${
          messages.length > 0 ? "pt-4" : ""
        } shadow-2xl`}
      >
        <div className="flex flex-col gap-4 pr-4 pl-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {messages.map((msg, index) => (
            <div
              key={index}
              className="flex wrap-anywhere"
              onMouseEnter={() => setIsMsgHovered(index)}
              onMouseLeave={() => handleMsgHover()}
            >
              <Card className="w-fit p-3 bg-accent z-0">{msg}</Card>
              {isMsgHovered === index && (
                <ChevronDownIcon
                  className={`w-5 h-5 self-center ml-3 cursor-pointer ${
                    showOptions === index ? "-rotate-90" : ""
                  }`}
                  onClick={() => handleMsgOptions(index)}
                />
              )}
              {showOptions === index && (
                <div className="flex">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <TrashIcon
                        className="w-5 h-5 ml-2 self-center cursor-pointer"
                        onClick={() => handleMsgDelete(index)}
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Delete message</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <PencilIcon
                        className="w-5 h-5 ml-2 self-center cursor-pointer"
                        onClick={() => handleMsgEdit(index)}
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Edit message</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div
          className={`flex gap-4 sticky bottom-0 ${
            messages.length > 0 ? "mt-4" : ""
          } bg-black p-4 shadow-lg`}
        >
          <div className="relative flex-1">
            {" "}
            {/* Wrapper for positioning */}
            <Input
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="pr-10" // Add padding-right to avoid overlap
            />
            <div
              className={`absolute right-2 top-1/2 transform -translate-y-1/2 text-sm  ${
                message.length >= maxCharacters
                  ? "text-red-400"
                  : "text-muted-foreground"
              }`}
            >
              {message.length} / {maxCharacters}
            </div>
          </div>
          <Button
            onClick={() => handleSend()}
            disabled={message.length > maxCharacters}
          >
            Send
          </Button>
        </div>
      </Card>
    </>
  );
}
