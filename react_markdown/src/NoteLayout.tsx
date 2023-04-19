import React from "react";
import {
  useParams,
  Navigate,
  Outlet,
  useOutletContext,
} from "react-router-dom";
import { Note } from "./App";

type NoteLayoutProps = {
  notes: Note[];
};
export default function NoteLayout({ notes }: NoteLayoutProps) {
  //1  得到id 因为在app中用了占位符 所以是params，id直接来自URL
  const { id } = useParams();
  const note = notes.find((n) => n.id === id);

  if (note === null) {
    return <Navigate to="/" replace />;
  }
  return <Outlet context={note} />;
}

//1
export function useNote() {
  return useOutletContext<Note>();
}
