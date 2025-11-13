"use client";

import React, { useState } from "react";
import { Button } from "../button";
import { Input } from "../input";
import { Card } from "../card";
import { ChevronDownIcon, PencilIcon } from "@heroicons/react/24/solid";
import { TrashIcon } from "@heroicons/react/24/solid";
import { Tooltip, TooltipContent, TooltipTrigger } from "../tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../alert-dialog";

export default function ChatBox() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const [isMsgHovered, setIsMsgHovered] = useState<number | null>(null);
  const [showOptions, setShowOptions] = useState<number | null>(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editedMessage, setEditedMessage] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

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
    const updatedMessages = messages.filter((_, i) => i !== index);
    setMessages(updatedMessages);
    setShowOptions(null);
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

      <Card className="flex flex-col w-10/12 pr-4 pl-4 absolute bottom-4 opacity-80">
        {messages.map((msg, index) => (
          <div
            key={index}
            className="flex"
            onMouseEnter={() => setIsMsgHovered(index)}
            onMouseLeave={() => handleMsgHover()}
          >
            <Card className="w-fit p-3 bg-accent">{msg}</Card>
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
                <MsgDeleteDialog
                  index={index}
                  handleMsgDelete={handleMsgDelete}
                />
                <Tooltip>
                  <TooltipTrigger asChild content="Edit message">
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

        <div className="flex bottom-0 gap-4 ">
          <Input
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <Button onClick={() => handleSend()}>Send</Button>
        </div>
      </Card>
    </>
  );
}

function MsgDeleteDialog({
  index,
  handleMsgDelete,
}: {
  index?: number;
  handleMsgDelete: (index?: number) => void;
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Tooltip>
          <TooltipTrigger asChild>
            <TrashIcon className="w-5 h-5 self-center cursor-pointer" />
          </TooltipTrigger>
          <TooltipContent>
            <p>Delete message</p>
          </TooltipContent>
        </Tooltip>
      </AlertDialogTrigger>
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
              onClick={() => handleMsgDelete(index)}
            >
              Delete
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
