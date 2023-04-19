import React from "react";
import NoteForm from "./NoteForm";
import { NoteData, Tag } from "./App";

type NewNoteProps = {
  //1 在提交时是一个函数，带着数据
  onSubmit: (data: NoteData) => void;
  onAddTag: (tag: Tag) => void;
  avialiableTag: Tag[];
};

export default function NewNote({
  onSubmit,
  onAddTag,
  avialiableTag,
}: NewNoteProps) {
  return (
    //1 react-fragment用法
    <>
      <h1 className="mb-4">NewNote</h1>
      {/* 确保使用相同的表单组件 */}
      <NoteForm
        onSubmit={onSubmit}
        onAddTag={onAddTag}
        avialiableTag={avialiableTag}
      />
    </>
  );
}
