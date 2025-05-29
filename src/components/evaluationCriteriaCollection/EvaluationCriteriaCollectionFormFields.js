import React from "react";
import { Form, Alert, Button, Card, Row, Col } from "react-bootstrap";
import LoadMoreButton from "../common/LoadMoreButton";

const EvaluationCriteriaCollectionFormFields = ({
  formData,
  onInputChange,
  onCriteriaSelection,
  onWeightChange,
  onNormalizeWeights,
  allCriterias,
  criteriasPage,
  onLoadMoreCriterias,
  validateWeights,
  getTotalWeight,
}) => {
  return (
    <>
      <Form.Group className="mb-3">
        <Form.Label>Tên bộ tiêu chí</Form.Label>
        <Form.Control
          type="text"
          name="name"
          value={formData.name}
          onChange={onInputChange}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Mô tả</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          name="description"
          value={formData.description}
          onChange={onInputChange}
        />
      </Form.Group>

      <hr className="my-4" />

      <h5>Chọn tiêu chí và trọng số</h5>

      {!validateWeights() && (
        <Alert variant="warning" className="mt-2">
          Tổng các trọng số ({(getTotalWeight() * 100).toFixed(1)}%) phải bằng 100%
          <Button
            variant="link"
            className="p-0 ms-2"
            onClick={onNormalizeWeights}
          >
            Tự động điều chỉnh
          </Button>
        </Alert>
      )}

      <div
        style={{ maxHeight: "300px", overflowY: "auto" }}
        className="border p-3 rounded mt-3"
      >
        {allCriterias.map((criteria) => {
          const isSelected = formData.selectedCriteriaIds.includes(criteria.id);

          return (
            <Card
              key={criteria.id}
              className={`mb-2 ${isSelected ? "border-primary" : ""}`}
            >
              <Card.Body className="py-2">
                <Row className="align-items-center">
                  <Col xs={7}>
                    <Form.Check
                      type="checkbox"
                      id={`criteria-${criteria.id}`}
                      label={
                        <>
                          <strong>{criteria.name}</strong>
                          <small className="d-block text-muted">
                            {criteria.description}
                          </small>
                          <small>Điểm tối đa: {criteria.maxPoint}</small>
                        </>
                      }
                      checked={isSelected}
                      onChange={() => onCriteriaSelection(criteria.id)}
                    />
                  </Col>
                  <Col xs={5}>
                    {isSelected && (
                      <Form.Group>
                        <Form.Label className="mb-0">Trọng số (%)</Form.Label>
                        <Form.Control
                          type="number"
                          min="0"
                          max="100"
                          step="1"
                          value={Math.round(
                            (formData.criteriaWeights[criteria.id] || 0) * 100
                          )}
                          onChange={(e) =>
                            onWeightChange(criteria.id, e.target.value)
                          }
                          className="form-control-sm"
                        />
                      </Form.Group>
                    )}
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          );
        })}

        {criteriasPage > 0 && (
          <LoadMoreButton loadMore={onLoadMoreCriterias} />
        )}
      </div>
    </>
  );
};

export default EvaluationCriteriaCollectionFormFields;