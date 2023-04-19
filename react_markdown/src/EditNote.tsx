import React from "react";
import NoteForm from "./NoteForm";
import { NoteData, Tag } from "./App";
import { useNote } from "./NoteLayout";

type EditNoteProps = {
  //1 在提交时是一个函数，带着数据
  onSubmit: (id: string, data: NoteData) => void;
  onAddTag: (tag: Tag) => void;
  avialiableTag: Tag[];
};

export default function EditNote({
  onSubmit,
  onAddTag,
  avialiableTag,
}: EditNoteProps) {
  const note = useNote();
  return (
    //1 react-fragment用法
    <>
      <h1 className="mb-4">EditNote!</h1>
      {/* 确保使用相同的表单组件 */}
      <NoteForm
        title={note.title}
        markdown={note.markdown}
        tags={note.tags}
        onSubmit={(data) => onSubmit(note.id, data)}
        onAddTag={onAddTag}
        avialiableTag={avialiableTag}
      />
    </>
  );
}
