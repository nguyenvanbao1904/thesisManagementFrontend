import React, { useEffect, useState, useCallback } from "react";
import { Alert, Table, Button, Row, Col } from "react-bootstrap";
import MySpinner from "../layouts/MySpinner";
import ActionButtons from "../common/ActionButtons";
import LoadMoreButton from "../common/LoadMoreButton";
import ConfirmDeleteModal from "../common/ConfirmDeleteModal";
import FormModal from "../common/FormModal";
import ThesisFormFields from "../thesis/ThesisFormFields";
import { useThesisData } from "../../hooks/useThesisData";
import { useThesisForm } from "../../hooks/useThesisForm";
import { authApis, endpoints } from "../../configs/Apis";

const ThesesList = () => {
  const {
    data,
    pagination,
    loading,
    error,
    loadTheses,
    loadLecturers,
    loadStudents,
    loadCommittees,
    loadEvaluationCriteriaCollections,
    loadThesisById,
    setPagination,
    setLoading,
  } = useThesisData();

  const {
    formData,
    resetForm,
    handleInputChange,
    handleLecturerSelection,
    handleStudentSelection,
    handleCommitteeSelection,
    handleEvaluationCriteriaCollectionSelection,
    handleReviewerSelection,
    handleFileChange,
    setFormData,
  } = useThesisForm();

  const [modals, setModals] = useState({
    showDelete: false,
    showEdit: false,
    showAdd: false,
  });

  const [selectedThesis, setSelectedThesis] = useState(null);

  // Load dữ liệu ban đầu
  useEffect(() => {
    loadTheses(pagination.thesesPage);
  }, [pagination.thesesPage, loadTheses]);

  useEffect(() => {
    loadLecturers(pagination.lecturersPage);
  }, [pagination.lecturersPage, loadLecturers]);

  useEffect(() => {
    loadStudents(pagination.studentsPage);
  }, [pagination.studentsPage, loadStudents]);

  useEffect(() => {
    loadCommittees(pagination.committeesPage);
  }, [pagination.committeesPage, loadCommittees]);

  useEffect(() => {
    loadEvaluationCriteriaCollections(
      pagination.evaluationCriteriaCollectionsPage
    );
  }, [
    pagination.evaluationCriteriaCollectionsPage,
    loadEvaluationCriteriaCollections,
  ]);

  const updateModal = useCallback((modalType, isOpen) => {
    setModals((prev) => ({ ...prev, [modalType]: isOpen }));
  }, []);

  const loadMore = useCallback(() => {
    if (!loading && pagination.thesesPage > 0) {
      setPagination((prev) => ({ ...prev, thesesPage: prev.thesesPage + 1 }));
    }
  }, [loading, pagination.thesesPage, setPagination]);

  const handleEdit = useCallback(
    async (e, thesis) => {
      e.stopPropagation();
      setSelectedThesis(thesis);

      const thesisInfo = await loadThesisById(thesis.id);

      if (thesisInfo) {
        setFormData({
          title: thesisInfo.title,
          description: thesisInfo.description,
          lecturerIds: thesisInfo.lecturerIds || [],
          studentIds: thesisInfo.studentIds || [],
          committeeId: thesisInfo.committeeId || "",
          evaluationCriteriaCollectionId:
            thesisInfo.evaluationCriteriaCollectionId || "",
          reviewerId: thesisInfo.reviewerId || "",
          file: null,
          fileUrl: thesisInfo.fileUrl || "",
        });

        updateModal("showEdit", true);
      }
    },
    [loadThesisById, setFormData, updateModal]
  );

  const handleDelete = useCallback(
    (e, thesis) => {
      e.stopPropagation();
      setSelectedThesis(thesis);
      updateModal("showDelete", true);
    },
    [updateModal]
  );

  const confirmDelete = useCallback(async () => {
    if (!selectedThesis) return;

    setLoading(true); // Thêm loading state

    try {
      await authApis().delete(`${endpoints["theses"]}/${selectedThesis.id}`);

      // Reset về trang 1 và load lại data
      setPagination((prev) => ({ ...prev, thesesPage: 1 }));
      await loadTheses(1);
      updateModal("showDelete", false);
      alert("Xóa khóa luận thành công!");
    } catch (err) {
      console.error("Error deleting thesis:", err);
      alert("Không thể xóa khóa luận này!");
    } finally {
      setLoading(false); // Đảm bảo loading được tắt
    }
  }, [selectedThesis, setPagination, loadTheses, updateModal, setLoading]);

  // Helper function để tạo FormData
  const createFormData = useCallback(() => {
    const formDataToSend = new FormData();

    formDataToSend.append("title", formData.title);
    formDataToSend.append("description", formData.description);

    (formData.lecturerIds || []).forEach((id) => {
      formDataToSend.append("lecturerIds", id.toString());
    });
    (formData.studentIds || []).forEach((id) => {
      formDataToSend.append("studentIds", id.toString());
    });

    if (formData.committeeId) {
      formDataToSend.append("committeeId", formData.committeeId.toString());
    }
    if (formData.evaluationCriteriaCollectionId) {
      formDataToSend.append(
        "evaluationCriteriaCollectionId",
        formData.evaluationCriteriaCollectionId.toString()
      );
    }
    if (formData.reviewerId) {
      formDataToSend.append("reviewerId", formData.reviewerId.toString());
    }

    if (formData.file instanceof File) {
      formDataToSend.append("file", formData.file);
    }

    return formDataToSend;
  }, [formData]);

  const submitEdit = useCallback(
    async (e) => {
      if (e) e.preventDefault();
      if (!selectedThesis) return;

      setLoading(true);

      try {
        await authApis().put(
          `${endpoints["theses"]}/${selectedThesis.id}`,
          createFormData()
        );

        // Reset về trang 1 và load lại data
        setPagination((prev) => ({ ...prev, thesesPage: 1 }));
        await loadTheses(1);
        updateModal("showEdit", false);
        alert("Cập nhật khóa luận thành công!");
      } catch (err) {
        console.error("Error updating thesis:", err);
        alert("Không thể cập nhật khóa luận này!");
      } finally {
        setLoading(false);
      }
    },
    [
      selectedThesis,
      createFormData,
      setLoading,
      setPagination,
      loadTheses,
      updateModal,
    ]
  );

  const submitAdd = useCallback(
    async (e) => {
      if (e) e.preventDefault();
      setLoading(true);

      try {
        await authApis().post(`${endpoints["theses"]}`, createFormData());

        // Reset về trang 1 và load lại data
        setPagination((prev) => ({ ...prev, thesesPage: 1 }));
        await loadTheses(1);
        updateModal("showAdd", false);
        alert("Thêm khóa luận thành công!");
      } catch (err) {
        console.error("Error adding thesis:", err);
        alert("Không thể thêm khóa luận này!");
      } finally {
        setLoading(false);
      }
    },
    [createFormData, setLoading, setPagination, loadTheses, updateModal]
  );

  const handleShowAddModal = useCallback(() => {
    resetForm();
    updateModal("showAdd", true);
  }, [resetForm, updateModal]);

  if (loading && data.theses.length === 0) {
    return <MySpinner />;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <>
      <h1>Danh sách khóa luận</h1>

      <Row className="mb-3 justify-content-end">
        <Col xs="auto">
          <Button variant="success" onClick={handleShowAddModal}>
            + Thêm khóa luận
          </Button>
        </Col>
      </Row>

      {data.theses.length > 0 ? (
        <>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Tiêu đề</th>
                <th>Mô tả</th>
                <th>Trạng thái</th>
                <th>Tài liệu</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {data.theses.map((thesis) => (
                <tr key={thesis.id}>
                  <td>{thesis.id}</td>
                  <td>{thesis.title}</td>
                  <td>{thesis.description}</td>
                  <td>{thesis.status}</td>
                  <td>
                    {thesis.fileUrl ? (
                      <Button
                        variant="primary"
                        size="sm"
                        href={thesis.fileUrl}
                        target="_blank"
                      >
                        Xem tài liệu
                      </Button>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td>
                    <ActionButtons
                      onEdit={(e) => handleEdit(e, thesis)}
                      onDelete={(e) => handleDelete(e, thesis)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          {pagination.thesesPage > 0 && <LoadMoreButton loadMore={loadMore} />}
        </>
      ) : (
        <Alert>Không có khóa luận nào!</Alert>
      )}

      {/* Modal xác nhận xóa */}
      <ConfirmDeleteModal
        show={modals.showDelete}
        onHide={() => updateModal("showDelete", false)}
        onConfirm={confirmDelete}
        itemName={selectedThesis?.title}
        itemType="khóa luận"
        disabled={loading} // Thêm prop này
      />

      {/* Modal chỉnh sửa */}
      <FormModal
        show={modals.showEdit}
        onHide={() => updateModal("showEdit", false)}
        onSubmit={submitEdit}
        title="Chỉnh sửa thông tin khóa luận"
        size="lg"
        disableSubmit={loading} // Thêm prop này
      >
        <ThesisFormFields
          formData={formData}
          onInputChange={handleInputChange}
          onLecturerSelection={handleLecturerSelection}
          onStudentSelection={handleStudentSelection}
          onCommitteeChange={handleCommitteeSelection} 
          onEvaluationCriteriaCollectionChange={handleEvaluationCriteriaCollectionSelection} 
          onReviewerChange={handleReviewerSelection}
          onFileChange={handleFileChange}
          lecturers={data.lecturers}
          students={data.students}
          committees={data.committees}
          evaluationCriteriaCollections={data.evaluationCriteriaCollections}
        />
      </FormModal>

      {/* Modal thêm mới */}
      <FormModal
        show={modals.showAdd}
        onHide={() => updateModal("showAdd", false)}
        onSubmit={submitAdd}
        title="Thêm thông tin khóa luận"
        submitLabel="Thêm mới"
        size="lg"
        disableSubmit={loading} // Thêm prop này
      >
        <ThesisFormFields
          formData={formData}
          onInputChange={handleInputChange}
          onLecturerSelection={handleLecturerSelection}
          onStudentSelection={handleStudentSelection}
          onCommitteeChange={handleCommitteeSelection} 
          onEvaluationCriteriaCollectionChange={handleEvaluationCriteriaCollectionSelection} 
          onReviewerChange={handleReviewerSelection}
          onFileChange={handleFileChange}
          lecturers={data.lecturers}
          students={data.students}
          committees={data.committees}
          evaluationCriteriaCollections={data.evaluationCriteriaCollections}
        />
      </FormModal>
    </>
  );
};

export default ThesesList;
