import React, { useMemo, useState } from "react";
import {
  Row,
  Col,
  Stack,
  Button,
  Form,
  Card,
  Badge,
  Modal,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import ReactSelect from "react-select/creatable";
import styles from "./NoteList.module.css";

import { Tag } from "./App";

type SimplifiedNote = {
  tags: Tag[];
  title: string;
  id: string;
};

type NodeListProps = {
  avialiableTags: Tag[];
  notes: SimplifiedNote[];
  onDeleteTag: (id: string) => void;
  onUpdateTag: (id: string, label: string) => void;
};
type EditTagsModalProps = {
  show: boolean;
  availableTags: Tag[];
  handleClose: () => void;
  onDeleteTag: (id: string) => void;
  onUpdateTag: (id: string, label: string) => void;
};

export default function NoteList({
  avialiableTags,
  notes,
  onDeleteTag,
  onUpdateTag,
}: NodeListProps) {
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [title, setTitle] = useState("");
  const [editTagsModalIsOpen, setEditTagModalIsOpen] = useState(false);
  //1  useMemo将在我们更新title，selectedTags,notes时更新
  const filteredNotes = useMemo(() => {
    //1 返回笔记的过滤版本
    return notes.filter((note) => {
      //1  实际返回一个大boolean
      return (
        //1 title是空意味还没输入标题不做任何事情，否则检查note的标题小写中是否含有标题的小写
        //1  被选中的标签长度是否为0
        (title === "" ||
          note.title.toLowerCase().includes(title.toLowerCase())) &&
        (selectedTags.length === 0 ||
          //1  （1）.every函数体的逻辑是：note不仅匹配其中一个标签，比如：note_A有1个tags note_B有2个tags[其中一个是共有标签]，
          //1  （1.1）输入共有的会出现note_A和note_B，输入独有的只有note_B
          selectedTags.every((tag) =>
            //1 检查笔记，看看是否笔记是否包含正在被遍历的标签。目的是确保我们的笔记有正在参与遍历的标签
            note.tags.some((noteTag) => noteTag.id === tag.id)
          ))
      );
    });
  }, [title, selectedTags, notes]);

  return (
    <>
      <Row className="align-items-center mb-4">
        <Col>
          <h1>NoteCloud</h1>
        </Col>
        <Col xs="auto">
          <Stack gap={3} direction="horizontal" className="justify-content-end">
            <Link to="/new">
              <Button variant="primary">Create</Button>
            </Link>
            {/* onclick是最后假的 */}
            <Button
              variant="outline-secondnary"
              onClick={() => setEditTagModalIsOpen(true)}
            >
              Edit Tags
            </Button>
          </Stack>
        </Col>
      </Row>
      <Form>
        <Row>
          <Col>
            <Form.Group controlId="title">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="tags">
              <Form.Label>Tags</Form.Label>
              {/* 复制的noteform里面下拉框，但删了onCreateOption，并且使用ReactSelect */}
              <ReactSelect
                value={selectedTags.map((tag) => {
                  return { label: tag.label, value: tag.id };
                })}
                //1 确保从avialiableTag中返回的是正确的格式
                //1  实现了将回车过的tag保存起来，下拉后可以选择
                options={avialiableTags.map((tag) => {
                  return { label: tag.label, value: tag.id };
                })}
                isMulti
                //1 修改并保存我们的tags
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
      </Form>
      {/* 循环浏览所有笔记呈现， */}
      <Row xs={1} sm={2} lg={3} xl={4} className="g-3">
        {filteredNotes.map((note) => (
          //1这里不能用花括号⬆️
          <Col key={note.id}>
            <NoteCard id={note.id} title={note.title} tags={note.tags} />
          </Col>
        ))}
      </Row>
      <EditTagsModal
        onUpdateTag={onUpdateTag}
        onDeleteTag={onDeleteTag}
        show={editTagsModalIsOpen}
        handleClose={() => setEditTagModalIsOpen(false)}
        availableTags={avialiableTags}
      />
    </>
  );
}

function NoteCard({ id, title, tags }: SimplifiedNote) {
  return (
    <Card
      as={Link}
      to={`/${id}`}
      className={`h-100 text-reset text-decoration-none ${styles.card} `}
    >
      <Card.Body>
        <Stack
          gap={2}
          className="align-items-center justify-content-center h-100"
        >
          <span className="fs-5">{title}</span>
          <Stack
            gap={2}
            direction="horizontal"
            className="justify-content-center flex-wrap"
          >
            {tags.map((tag) => (
              <Badge className="text-truncate" key={tag.id}>
                {tag.label}
              </Badge>
            ))}
          </Stack>
        </Stack>
      </Card.Body>
    </Card>
  );
}

//1 最后
function EditTagsModal({
  availableTags,
  show,
  handleClose,
  onDeleteTag,
  onUpdateTag,
}: EditTagsModalProps) {
  //1 底部出现Modal
  // return 'Modal'
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit tags</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Stack gap={2}>
            {availableTags.map((tag) => (
              <Row key={tag.id}>
                <Col>
                  {/* 最后加的onchange */}
                  <Form.Control
                    type="text"
                    value={tag.label}
                    onChange={(e) => onUpdateTag(tag.id, e.target.value)}
                  ></Form.Control>
                </Col>
                <Col xs="auto">
                  <Button
                    variant="outline-danger"
                    onClick={() => onDeleteTag(tag.id)}
                  >
                    &times;
                  </Button>
                </Col>
              </Row>
            ))}
          </Stack>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
