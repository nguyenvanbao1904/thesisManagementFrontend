import { useEffect, useState } from "react";
import { authApis, endpoints } from "../../configs/Apis";
import MySpinner from "../layouts/MySpinner";
import { Alert, Table, Button, Modal, Form, Row, Col } from "react-bootstrap";

const EvaluationCriteriaList = () => {
  const [evaluationCriterias, setEvaluationCriterias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCriteria, setSelectedCriteria] = useState(null);
  const [showAddModel, setShowAddModel] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    maxPoint: 10,
  });

  useEffect(() => {
    loadEvaluationCriterias();
  }, []);

  const loadEvaluationCriterias = async () => {
    setLoading(true);
    try {
      const res = await authApis().get(endpoints["evaluation_criterias"]);
      setEvaluationCriterias(res.data);
    } catch (err) {
      console.error("Error fetching evaluation criterias:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (criteria) => {
    setSelectedCriteria(criteria);
    setEditForm({
      name: criteria.name,
      description: criteria.description,
      maxPoint: criteria.maxPoint,
    });
    setShowEditModal(true);
  };

  const handleDelete = (criteria) => {
    setSelectedCriteria(criteria);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await authApis().delete(
        `${endpoints["evaluation_criterias"]}/${selectedCriteria.id}`
      );
      // Cập nhật danh sách sau khi xóa
      setEvaluationCriterias(
        evaluationCriterias.filter((c) => c.id !== selectedCriteria.id)
      );
      setShowDeleteModal(false);
    } catch (err) {
      console.error("Error deleting criteria:", err);
      alert("Không thể xóa tiêu chí này!");
    }
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: name === "maxPoint" ? parseInt(value, 10) : value,
    }));
  };

  const submitEdit = async (e) => {
    e.preventDefault();

    // Chuẩn bị dữ liệu để gửi lên API
    const updateData = {
      id: selectedCriteria.id,
      name: editForm.name,
      description: editForm.description,
      maxPoint: editForm.maxPoint,
    };

    try {
      await authApis().put(
        `${endpoints["evaluation_criterias"]}/${selectedCriteria.id}`,
        updateData
      );
      // Tải lại danh sách sau khi cập nhật
      loadEvaluationCriterias();
      setShowEditModal(false);
    } catch (err) {
      console.error("Error updating criteria:", err);
      alert("Không thể cập nhật tiêu chí này!");
    }
  };

  const submitAdd = async (e) => {
    e.preventDefault();

    // Chuẩn bị dữ liệu để gửi lên API
    const updateData = {
      name: editForm.name,
      description: editForm.description,
      maxPoint: editForm.maxPoint,
    };

    try {
      await authApis().post(`${endpoints["evaluation_criterias"]}`, updateData);
      // Tải lại danh sách sau khi cập nhật
      loadEvaluationCriterias();
      setShowAddModel(false);
    } catch (err) {
      console.error("Error add criteria:", err);
      alert("Không thể thêm tiêu chí này!");
    }
  };

  return loading ? (
    <MySpinner />
  ) : (
    <>
      {evaluationCriterias.length > 0 ? (
        <>
          <h1>Danh sách tiêu chí chấm điểm khóa luận</h1>

          <Row className="mb-3 justify-content-end">
            <Col xs="auto">
              <Button variant="success" onClick={() => { setEditForm({maxPoint: editForm.maxPoint}); setShowAddModel(true)}}>
                + Thêm tiêu chí
              </Button>
            </Col>
          </Row>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Tên tiêu chí</th>
                <th>Mô tả</th>
                <th>Điểm tối đa</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {evaluationCriterias.map((evaluationCriteria) => (
                <tr key={evaluationCriteria.id}>
                  <td>{evaluationCriteria.name}</td>
                  <td>{evaluationCriteria.description}</td>
                  <td>{evaluationCriteria.maxPoint}</td>
                  <td>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="me-2"
                      onClick={() => handleEdit(evaluationCriteria)}
                    >
                      Sửa
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDelete(evaluationCriteria)}
                    >
                      Xóa
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      ) : (
        <Alert>Không có tiêu chí nào!</Alert>
      )}

      {/* Modal xác nhận xóa */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận xóa</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Bạn có chắc chắn muốn xóa tiêu chí "{selectedCriteria?.name}" không?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Hủy
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Xóa
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal chỉnh sửa */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Chỉnh sửa tiêu chí</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={submitEdit}>
            <Form.Group className="mb-3">
              <Form.Label>Tên tiêu chí</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={editForm.name}
                onChange={handleEditFormChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Mô tả</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={editForm.description}
                onChange={handleEditFormChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Điểm tối đa</Form.Label>
              <Form.Control
                type="number"
                name="maxPoint"
                min="1"
                max="100"
                value={editForm.maxPoint}
                onChange={handleEditFormChange}
                required
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Hủy
          </Button>
          <Button variant="primary" onClick={submitEdit}>
            Lưu thay đổi
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal them */}
      <Modal show={showAddModel} onHide={() => setShowAddModel(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Thêm tiêu chí</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={submitEdit}>
            <Form.Group className="mb-3">
              <Form.Label>Tên tiêu chí</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={editForm.name}
                onChange={handleEditFormChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Mô tả</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={editForm.description}
                onChange={handleEditFormChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Điểm tối đa</Form.Label>
              <Form.Control
                type="number"
                name="maxPoint"
                min="1"
                max="100"
                value={editForm.maxPoint}
                onChange={handleEditFormChange}
                required
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModel(false)}>
            Hủy
          </Button>
          <Button variant="primary" onClick={submitAdd}>
            Lưu thay đổi
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default EvaluationCriteriaList;
