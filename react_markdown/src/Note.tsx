import { Row, Col, Stack, Badge, Button } from "react-bootstrap";
import { useNote } from "./NoteLayout";
import { Link, useNavigate } from "react-router-dom";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";

type NoteProps = {
  onDelete: (id: string) => void;
};

export function Note({ onDelete }: NoteProps) {
  const note = useNote();
  const navigate = useNavigate();
  return (
    <>
      <Row className="align-items-center mb-4">
        <Col>
          <h1>{note.title}</h1>
          <Stack
            gap={2}
            className="align-items-center justify-content-center h-100"
          >
            <Stack gap={2} direction="horizontal" className="flex-wrap">
              {note.tags.map((tag) => (
                <Badge className="text-truncate" key={tag.id}>
                  {tag.label}
                </Badge>
              ))}
            </Stack>
          </Stack>
        </Col>
        {/* 按钮 */}
        <Col xs="auto">
          <Stack gap={3} direction="horizontal" className="justify-content-end">
            <Link to={`/${note.id}/edit`}>
              <Button variant="primary">Edit</Button>
            </Link>
            <Button
              variant="outline-danger"
              onClick={() => {
                onDelete(note.id);
                navigate("/");
              }}
            >
              Delete
            </Button>
            <Link to="/">
              <Button variant="outline-secondnary">Back</Button>
            </Link>
          </Stack>
        </Col>
      </Row>
      {/* ReactMarkdown */}
      <ReactMarkdown>{note.markdown}</ReactMarkdown>
    </>
  );
}
