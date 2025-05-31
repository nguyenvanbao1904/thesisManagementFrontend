import { Routes, Route, Navigate } from "react-router-dom";
import { Container } from "react-bootstrap";
import ThesesList from "./ThesesList";
import EvaluationCriteriaList from "./EvaluationCriteriaList";
import EvaluationCriteriaCollectionList from "./EvaluationCriteriaCollectionList";
import CommitteeList from "./CommitteeList";

const AcademicStaff = () => {
  return (
    <Container className="mt-4 mb-5">
      <Routes>
        {/* Default route - redirect to theses (giữ nguyên behavior hiện tại) */}
        <Route path="/" element={<Navigate to="/academic-staff/theses" replace />} />
        
        {/* Academic Staff specific routes */}
        <Route path="/theses" element={<ThesesList />} />
        <Route path="/criteria" element={<EvaluationCriteriaList />} />
        <Route path="/criteria-collections" element={<EvaluationCriteriaCollectionList />} />
        <Route path="/committees" element={<CommitteeList />} />
        
        {/* Catch all route for academic staff section */}
        <Route path="*" element={<Navigate to="/academic-staff/theses" replace />} />
      </Routes>
    </Container>
  );
};

export default AcademicStaff;
