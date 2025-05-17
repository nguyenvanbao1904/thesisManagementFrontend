import { useState } from "react";
import {
  Container,
  Row,
  Button,
  ButtonGroup,
  Card,
} from "react-bootstrap";
import ThesesList from "./ThesesList";
import EvaluationCriteriaList from "./EvaluationCriteriaList";
import EvaluationCriteriaCollectionList from "./EvaluationCriteriaCollectionList";

const tabs = [
  {
    key: "theses",
    label: "Quản lý khóa luận",
    addText: "khóa luận",
    content: <ThesesList />,
  },
  {
    key: "criteria",
    label: "Quản lý tiêu chí chấm điểm",
    addText: "tiêu chí",
    content: <EvaluationCriteriaList />
  },
  {
    key: "criteriaCollection",
    label: "Quản lý bộ tiêu chí",
    addText: "bộ tiêu chí",
    content: <EvaluationCriteriaCollectionList />
  },
];

const AcademicStaff = () => {
  const [activeTab, setActiveTab] = useState("theses");

  const currentTab = tabs.find((tab) => tab.key === activeTab);

  return (
    <Container className="mt-4 mb-5">
      <h2 className="text-center mb-4">Quản lý khóa luận</h2>

      <Row className="mb-3 justify-content-center">
        <ButtonGroup>
          {tabs.map((tab) => (
            <Button
              key={tab.key}
              variant={activeTab === tab.key ? "primary" : "outline-primary"}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </Button>
          ))}
        </ButtonGroup>
      </Row>

      <Card>
        <Card.Body>{currentTab?.content}</Card.Body>
      </Card>
    </Container>
  );
};

export default AcademicStaff;
