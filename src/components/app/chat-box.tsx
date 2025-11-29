"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
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
import { Message, UserProfile } from "@/src/lib/types";
import {
  createMessage,
  deleteMessage,
  updateMessage,
} from "@/src/lib/repositories/msg-repository";

export default function ChatBox({
  userProfile,
  initialMessages,
}: {
  userProfile: UserProfile;
  initialMessages: Message[];
}) {
  const maxCharacters = 100;

  const { username } = userProfile ? userProfile : { username: "Guest" };

  const [message, setMessage] = useState<Message>({
    content: "",
    id: 0,
  });
  const [messages, setMessages] = useState<Message[]>(
    initialMessages.map((msg) => ({
      content: msg.content,
      id: msg.id,
      createdAt: msg.createdAt,
    }))
  );

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [isMsgHovered, setIsMsgHovered] = useState<number | null>(null);
  const [showOptions, setShowOptions] = useState<number | null>(null);

  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editedMessage, setEditedMessage] = useState<Message>({
    content: "",
    id: 0,
  });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deletingIndex, setDeletingIndex] = useState<number | null>(null);

  const handleSend = async () => {
    if (message.content.trim() === "") return;
    const newMessage = await createMessage({
      userId: userProfile.id,
      content: message.content,
    });
    setMessages([
      ...messages,
      { content: message.content, id: newMessage.id, createdAt: new Date() },
    ]);
    setMessage({ content: "", id: newMessage.id });
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

  const handleDeleteSave = async (index?: number) => {
    console.log("Delete message index:", index);
    const updatedMessages = messages.filter((m) => m.id !== index);
    setMessages(updatedMessages);
    await deleteMessage(index ?? 0);
    setOpenDeleteDialog(false);
  };

  const handleMsgEdit = (index: number) => {
    console.log("Edit message");
    setOpenEditDialog(true);
    setEditingIndex(index);
    setEditedMessage(messages.filter((m) => m.id === index)[0]);
  };

  const handleEditSave = async () => {
    console.log("Save edited message:", editedMessage);
    const updatedMessages = messages.map((msg) =>
      msg.id === editingIndex ? editedMessage : msg
    );
    setMessages(updatedMessages);
    await updateMessage(editedMessage);
    setOpenEditDialog(false);
  };

  // Helper function to check if date is today
  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // Helper function to format message timestamp
  const formatMessageTime = (date: Date) => {
    if (isToday(date)) {
      // Show only time if today
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    // Show full date and time if not today
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      {/* MESSAGE EDIT DIALOG */}
      <AlertDialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Do you want to edit this message?
            </AlertDialogTitle>
            <Input
              placeholder="Edit your message..."
              value={editedMessage.content}
              onChange={(e) =>
                setEditedMessage({
                  content: e.target.value,
                  id: editedMessage.id,
                })
              }
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

      {/* MESSAGE DELETE DIALOG */}
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

      {/* CHATBOX */}
      <Card
        className={`overflow-auto flex gap-0 flex-col w-10/12 p-0 max-h-full ${
          messages.length > 0 ? "pt-4" : ""
        } shadow-2xl bg-black/50`}
      >
        <div className="flex flex-col gap-4 pr-4 pl-4 max-h-[80%] overflow-y-auto custom-scrollbar">
          {/* MESSAGES */}
          {messages.map((msg) => (
            <div key={msg.id} className="flex gap-5 items-end">
              <Image
                src={userProfile.profilePictureUrl || "/default-avatar.png"}
                className="rounded-full"
                alt={"Avatar"}
                width={42}
                height={42}
              ></Image>
              <div className="flex-col w-full">
                <div className="pb-2 flex items-center gap-2">
                  <div className="font-mono opacity-55">{username}</div>
                  {isMsgHovered === msg.id && (
                    <span className="text-[0.7rem] opacity-40 w-fit">
                      {msg.createdAt && formatMessageTime(msg.createdAt)}
                    </span>
                  )}
                </div>
                <div
                  className="flex wrap-anywhere w-full"
                  onMouseEnter={() => setIsMsgHovered(msg.id)}
                  onMouseLeave={() => handleMsgHover()}
                >
                  <Card className="w-fit p-3 py-2 bg-accent z-0">
                    {msg.content}
                  </Card>
                  {isMsgHovered === msg.id && (
                    <>
                      <ChevronDownIcon
                        className={`w-5 h-5 self-center ml-3 cursor-pointer ${
                          showOptions === msg.id ? "-rotate-90" : ""
                        }`}
                        onClick={() => handleMsgOptions(msg.id)}
                      />
                    </>
                  )}
                  {showOptions === msg.id && (
                    <div className="flex">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <TrashIcon
                            className="w-5 h-5 ml-2 self-center cursor-pointer"
                            onClick={() => handleMsgDelete(msg.id)}
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
                            onClick={() => handleMsgEdit(msg.id)}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Edit message</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        {/* DIVISION BETWEEN MESSAGES AND INPUT BOX */}
        <div
          className={`flex gap-4 sticky bottom-0 ${
            messages.length > 0 ? "mt-4" : ""
          } bg-black p-4 shadow-lg `}
        >
          <div className="relative flex-1">
            {" "}
            <Input
              placeholder="Type your message..."
              value={message.content}
              onChange={(e) =>
                setMessage({ content: e.target.value, id: message.id })
              }
              onKeyDown={(e) =>
                e.key === "Enter" &&
                message.content.length <= maxCharacters &&
                handleSend()
              }
              className="pr-10" // Add padding-right to avoid overlap
            />
            <div
              className={`absolute right-2 top-1/2 transform -translate-y-1/2 text-sm  ${
                message.content.length >= maxCharacters
                  ? "text-red-400"
                  : "text-muted-foreground"
              }`}
            >
              {message.content.length} / {maxCharacters}
            </div>
          </div>
          <Button
            onClick={() => handleSend()}
            disabled={
              message.content.length > maxCharacters ||
              message.content.trim() === ""
            }
          >
            Send
          </Button>
        </div>
      </Card>
    </>
  );
}
