import { useState } from "react";
import { Container, Row, Button, ButtonGroup, Card } from "react-bootstrap";
import ThesesList from "./ThesesList";
import EvaluationCriteriaList from "./EvaluationCriteriaList";
import EvaluationCriteriaCollectionList from "./EvaluationCriteriaCollectionList";
import CommitteeList from "./CommitteeList";

const tabs = [
  {
    key: "theses",
    label: "Quản lý khóa luận",
    content: <ThesesList />,
  },
  {
    key: "criteria",
    label: "Quản lý tiêu chí chấm điểm",
    content: <EvaluationCriteriaList />,
  },
  {
    key: "criteriaCollection",
    label: "Quản lý bộ tiêu chí",
    content: <EvaluationCriteriaCollectionList />,
  },
  {
    key: "committee",
    label: "Quản lý hội đồng",
    content: <CommitteeList />,
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
