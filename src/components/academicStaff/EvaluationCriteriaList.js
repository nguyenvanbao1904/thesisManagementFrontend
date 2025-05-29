import React, { useEffect, useState, useCallback } from "react";
import { Alert, Table, Button, Row, Col } from "react-bootstrap";
import MySpinner from "../layouts/MySpinner";
import ActionButtons from "../common/ActionButtons";
import LoadMoreButton from "../common/LoadMoreButton";
import ConfirmDeleteModal from "../common/ConfirmDeleteModal";
import FormModal from "../common/FormModal";
import CriteriaFormFields from "../common/CriteriaFormFields";
import { useEvaluationCriteriaData } from "../../hooks/useEvaluationCriteriaData";
import { useEvaluationCriteriaForm } from "../../hooks/useEvaluationCriteriaForm";
import { authApis, endpoints } from "../../configs/Apis";

const EvaluationCriteriaList = () => {
  const {
    data,
    pagination,
    loading,
    error,
    loadEvaluationCriterias,
    setPagination,
    setLoading,
  } = useEvaluationCriteriaData();

  const {
    formData,
    resetForm,
    handleInputChange,
    setFormData,
  } = useEvaluationCriteriaForm();

  const [modals, setModals] = useState({
    showDelete: false,
    showEdit: false,
    showAdd: false,
  });

  const [selectedCriteria, setSelectedCriteria] = useState(null);

  // Load dữ liệu ban đầu
  useEffect(() => {
    loadEvaluationCriterias(pagination.evaluationCriteriasPage);
  }, [pagination.evaluationCriteriasPage, loadEvaluationCriterias]);

  const updateModal = useCallback((modalType, isOpen) => {
    setModals((prev) => ({ ...prev, [modalType]: isOpen }));
  }, []);

  const loadMore = useCallback(() => {
    if (!loading && pagination.evaluationCriteriasPage > 0) {
      setPagination((prev) => ({ 
        ...prev, 
        evaluationCriteriasPage: prev.evaluationCriteriasPage + 1 
      }));
    }
  }, [loading, pagination.evaluationCriteriasPage, setPagination]);

  const handleEdit = useCallback(
    (e, criteria) => {
      e.stopPropagation();
      setSelectedCriteria(criteria);
      setFormData({
        name: criteria.name,
        description: criteria.description,
        maxPoint: criteria.maxPoint,
      });
      updateModal("showEdit", true);
    },
    [setFormData, updateModal]
  );

  const handleDelete = useCallback(
    (e, criteria) => {
      e.stopPropagation();
      setSelectedCriteria(criteria);
      updateModal("showDelete", true);
    },
    [updateModal]
  );

  const confirmDelete = useCallback(async () => {
    if (!selectedCriteria) return;

    try {
      await authApis().delete(
        `${endpoints["evaluation_criterias"]}/${selectedCriteria.id}`
      );

      // Reset về trang 1 và load lại data
      setPagination((prev) => ({ ...prev, evaluationCriteriasPage: 1 }));
      await loadEvaluationCriterias(1);
      updateModal("showDelete", false);
      alert("Xóa tiêu chí thành công!");
    } catch (err) {
      console.error("Error deleting criteria:", err);
      alert("Không thể xóa tiêu chí này!");
    }
  }, [selectedCriteria, setPagination, loadEvaluationCriterias, updateModal]);

  const submitEdit = useCallback(
    async (e) => {
      if (e) e.preventDefault();
      if (!selectedCriteria) return;

      setLoading(true);

      try {
        const updateData = {
          id: selectedCriteria.id,
          name: formData.name.trim(),
          description: formData.description,
          maxPoint: formData.maxPoint,
        };

        await authApis().put(
          `${endpoints["evaluation_criterias"]}/${selectedCriteria.id}`,
          updateData
        );

        // Reset về trang 1 và load lại data
        setPagination((prev) => ({ ...prev, evaluationCriteriasPage: 1 }));
        await loadEvaluationCriterias(1);
        updateModal("showEdit", false);
        alert("Cập nhật tiêu chí thành công!");
      } catch (err) {
        console.error("Error updating criteria:", err);
        alert("Không thể cập nhật tiêu chí này!");
      } finally {
        setLoading(false);
      }
    },
    [
      selectedCriteria,
      formData,
      setLoading,
      setPagination,
      loadEvaluationCriterias,
      updateModal,
    ]
  );

  const submitAdd = useCallback(
    async (e) => {
      if (e) e.preventDefault();
      setLoading(true);

      try {
        const updateData = {
          name: formData.name.trim(),
          description: formData.description,
          maxPoint: formData.maxPoint,
        };

        await authApis().post(`${endpoints["evaluation_criterias"]}`, updateData);

        // Reset về trang 1 và load lại data
        setPagination((prev) => ({ ...prev, evaluationCriteriasPage: 1 }));
        await loadEvaluationCriterias(1);
        updateModal("showAdd", false);
        alert("Thêm tiêu chí thành công!");
      } catch (err) {
        console.error("Error adding criteria:", err);
        alert("Không thể thêm tiêu chí này!");
      } finally {
        setLoading(false);
      }
    },
    [formData, setLoading, setPagination, loadEvaluationCriterias, updateModal]
  );

  const handleShowAddModal = useCallback(() => {
    resetForm();
    updateModal("showAdd", true);
  }, [resetForm, updateModal]);

  if (loading && data.evaluationCriterias.length === 0) {
    return <MySpinner />;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <>
      <h1>Danh sách tiêu chí chấm điểm khóa luận</h1>

      <Row className="mb-3 justify-content-end">
        <Col xs="auto">
          <Button variant="success" onClick={handleShowAddModal}>
            + Thêm tiêu chí
          </Button>
        </Col>
      </Row>

      {data.evaluationCriterias.length > 0 ? (
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
              {data.evaluationCriterias.map((evaluationCriteria) => (
                <tr key={evaluationCriteria.id}>
                  <td>{evaluationCriteria.name}</td>
                  <td>{evaluationCriteria.description}</td>
                  <td>{evaluationCriteria.maxPoint}</td>
                  <td>
                    <ActionButtons
                      onEdit={(e) => handleEdit(e, evaluationCriteria)}
                      onDelete={(e) => handleDelete(e, evaluationCriteria)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          {pagination.evaluationCriteriasPage > 0 && (
            <LoadMoreButton loadMore={loadMore} />
          )}
        </>
      ) : (
        <Alert>Không có tiêu chí nào!</Alert>
      )}

      {/* Modal xác nhận xóa */}
      <ConfirmDeleteModal
        show={modals.showDelete}
        onHide={() => updateModal("showDelete", false)}
        onConfirm={confirmDelete}
        itemName={selectedCriteria?.name}
        itemType="tiêu chí"
      />

      {/* Modal chỉnh sửa */}
      <FormModal
        show={modals.showEdit}
        onHide={() => updateModal("showEdit", false)}
        onSubmit={submitEdit}
        title="Chỉnh sửa tiêu chí"
      >
        <CriteriaFormFields
          formData={formData}
          onChange={handleInputChange}
        />
      </FormModal>

      {/* Modal thêm mới */}
      <FormModal
        show={modals.showAdd}
        onHide={() => updateModal("showAdd", false)}
        onSubmit={submitAdd}
        title="Thêm tiêu chí"
        submitLabel="Thêm mới"
      >
        <CriteriaFormFields
          formData={formData}
          onChange={handleInputChange}
        />
      </FormModal>
    </>
  );
};

export default EvaluationCriteriaList;