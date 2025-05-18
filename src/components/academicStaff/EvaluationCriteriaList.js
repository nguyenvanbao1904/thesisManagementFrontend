import { useEffect, useState, useCallback } from "react";
import { authApis, endpoints } from "../../configs/Apis";
import MySpinner from "../layouts/MySpinner";
import { Alert, Table, Button, Row, Col } from "react-bootstrap";

// Import các components chung
import ActionButtons from "../common/ActionButtons";
import ConfirmDeleteModal from "../common/ConfirmDeleteModal";
import CriteriaFormFields from "../common/CriteriaFormFields";
import FormModal from "../common/FormModal";
import LoadMoreButton from "../common/LoadMoreButton";

const EvaluationCriteriaList = () => {
  const [evaluationCriterias, setEvaluationCriterias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCriteria, setSelectedCriteria] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    maxPoint: 10,
  });
  const [page, setPage] = useState(1);

  const loadEvaluationCriterias = useCallback(async () => {
    setLoading(true);
    try {
      let url = `${endpoints["evaluation_criterias"]}?page=${page}`;
      const res = await authApis().get(url);

      if (res.data.length === 0) {
        setPage(0);
      } else {
        if (page === 1) {
          setEvaluationCriterias(res.data);
        } else {
          setEvaluationCriterias(prevCriterias => [...prevCriterias, ...res.data]);
        }
      }
    } catch (err) {
      console.error("Error fetching evaluation criterias:", err);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    loadEvaluationCriterias();
  }, [loadEvaluationCriterias]);

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

  const handleShowAddModal = () => {
    setEditForm({
      name: "",
      description: "",
      maxPoint: 10,
    });
    setShowAddModal(true);
  };

  const submitEdit = async (e) => {
    if (e) e.preventDefault();

    // Chuẩn bị dữ liệu để gửi lên API
    const updateData = {
      id: selectedCriteria.id,
      name: editForm.name.trim(),
      description: editForm.description,
      maxPoint: editForm.maxPoint,
    };

    try {
      await authApis().put(
        `${endpoints["evaluation_criterias"]}/${selectedCriteria.id}`,
        updateData
      );
      // Tải lại danh sách sau khi cập nhật
      setPage(1);
      loadEvaluationCriterias();
      setShowEditModal(false);
    } catch (err) {
      console.error("Error updating criteria:", err);
      alert("Không thể cập nhật tiêu chí này!");
    }
  };

  const submitAdd = async (e) => {
    if (e) e.preventDefault();

    // Chuẩn bị dữ liệu để gửi lên API
    const updateData = {
      name: editForm.name.trim(),
      description: editForm.description,
      maxPoint: editForm.maxPoint,
    };

    try {
      await authApis().post(`${endpoints["evaluation_criterias"]}`, updateData);
      // Tải lại danh sách sau khi cập nhật
      setPage(1);
      loadEvaluationCriterias();
      setShowAddModal(false);
    } catch (err) {
      console.error("Error add criteria:", err);
      alert("Không thể thêm tiêu chí này!");
    }
  };

   const loadMore = ()=>{
        if (!loading && page > 0){
            setPage(page+1)
        }
    }

  return loading ? (
    <MySpinner />
  ) : (
    <>
      <h1>Danh sách tiêu chí chấm điểm khóa luận</h1>

      <Row className="mb-3 justify-content-end">
        <Col xs="auto">
          <Button variant="success" onClick={handleShowAddModal}>
            + Thêm tiêu chí
          </Button>
        </Col>
      </Row>

      {evaluationCriterias.length > 0 ? (
        <>
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
                    <ActionButtons
                      onEdit={() => handleEdit(evaluationCriteria)}
                      onDelete={() => handleDelete(evaluationCriteria)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          {page > 0 && (
           <LoadMoreButton loadMore={loadMore}/>
          )}
        </>
      ) : (
        <Alert>Không có tiêu chí nào!</Alert>
      )}

      {/* Modal xác nhận xóa */}
      <ConfirmDeleteModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        itemName={selectedCriteria?.name}
        itemType="tiêu chí"
      />

      {/* Modal chỉnh sửa */}
      <FormModal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        onSubmit={submitEdit}
        title="Chỉnh sửa tiêu chí"
      >
        <CriteriaFormFields
          formData={editForm}
          onChange={handleEditFormChange}
        />
      </FormModal>

      {/* Modal thêm */}
      <FormModal
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        onSubmit={submitAdd}
        title="Thêm tiêu chí"
        submitLabel="Thêm mới"
      >
        <CriteriaFormFields
          formData={editForm}
          onChange={handleEditFormChange}
        />
      </FormModal>
    </>
  );
};

export default EvaluationCriteriaList;
