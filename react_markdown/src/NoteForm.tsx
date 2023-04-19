import React, { FormEvent, useRef, useState } from "react";
import { Form, Stack, Row, Col, Button } from "react-bootstrap";
import CreatableReactSelect from "react-select/creatable";
import { Link, useNavigate } from "react-router-dom";
import { NoteData, Tag } from "./App";
import { v4 as uuidV4 } from "uuid";

type NoteFormProps = {
  onSubmit: (data: NoteData) => void;
  onAddTag: (tag: Tag) => void;
  avialiableTag: Tag[];
} & Partial<NoteData>;
//1 NoteData时 newnote报错 ，改成Partial<NoteData> 所有都是可选的
export default function NoteForm({
  onSubmit,
  onAddTag,
  avialiableTag,
  //1 这三个是编辑editnote是写的
  title = "",
  markdown = "",
  tags = [],
}: NoteFormProps) {
  //1  明确了ref打标签的元素类型<HTMLInputElement>,<HTMLTextAreaElement>
  const titleRef = useRef<HTMLInputElement>(null);
  const markDownRef = useRef<HTMLTextAreaElement>(null);
  //1  存储标签为标签数组 [选定的标签，设置选定标签方法]  初始值是空数组
  //1  初始值是空数组useState<Tag[]>([]) 编写editnote是改成tags
  const [selectedTags, setSelectedTags] = useState<Tag[]>(tags);
  //1 提交后重定向
  const navigate = useNavigate();
  function handleSumbit(e: FormEvent) {
    e.preventDefault();
    //1   传递数据
    onSubmit({
      //1  “titleRef.current”可能为 “null”。 解决方法 ! 即使是null我们强制定义为不可能是空，因为我们确定这些值不可能是空都是有实际意义的
      title: titleRef.current!.value,
      markdown: markDownRef.current!.value,
      //tags: [], // localstorage中NOTES的tagIds: []
      tags: selectedTags,
    });
    navigate("..");
  }
  return (
    <>
      <Form onSubmit={handleSumbit}>
        {/* gap=4 元素之间自动隔开1/4的差距 */}
        <Stack gap={4}>
          {/* 行。行内放专栏,表单组 */}
          <Row>
            <Col>
              <Form.Group controlId="title">
                <Form.Label>Title</Form.Label>
                {/* 编写editnote时写入defaultvalue */}
                <Form.Control
                  ref={titleRef}
                  required
                  defaultValue={title}
                ></Form.Control>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="tags">
                <Form.Label>Tags</Form.Label>
                <CreatableReactSelect
                  //1    react-select自带的onCreateOption，新建一个标签
                  //1    onAddTag确保标签存在在localstorage中，目的是存储在本地，本地存储的持久化
                  //1    setSelectedTags将新标签加入先有的标签当中，[[],xxx,xxx,...]
                  onCreateOption={(label) => {
                    const newTag = { id: uuidV4(), label };
                    onAddTag(newTag); //avialiableTag
                    setSelectedTags((prev) => [...prev, newTag]); //selectedTags
                  }}
                  //2.   将标签重新整理下，label，id
                  value={selectedTags.map((tag) => {
                    return { label: tag.label, value: tag.id };
                  })}
                  //3  option自带属性，形成下拉选项
                  //3  通过onAddTag，放入标签容器中的是avialiableTag
                  //3  下拉后可以选择
                  options={avialiableTag.map((tag) => {
                    return { label: tag.label, value: tag.id };
                  })}
                  isMulti
                  //4  修改时触发onchange事件执行setSelectedTags更新保存我们的tags
                  onChange={(tags) => {
                    setSelectedTags(
                      tags.map((tag) => {
                        return { label: tag.label, id: tag.value };
                      })
                    );
                  }}
                />
              </Form.Group>
            </Col>
          </Row>
          {/* 编写editnote时写入defaultvalue*/}
          <Form.Group controlId="markdown" defaultValue={markdown}>
            <Form.Label>Content</Form.Label>
            <Form.Control
              required
              ref={markDownRef}
              as="textarea"
              rows={20}
            ></Form.Control>
          </Form.Group>
          <Stack direction="horizontal" gap={2} className="justify-content-end">
            <Button type="submit" variant="primary">
              Save
            </Button>
            {/* 点击cancel按钮返回上一页 */}
            <Link to="..">
              <Button type="button" variant="out-secondnary">
                Cancel
              </Button>
            </Link>
          </Stack>
        </Stack>
      </Form>
    </>
  );
}
