import React, { useEffect, useState, useCallback } from "react";
import {
  Alert,
  Table,
  Card,
  Accordion,
  Button,
  Row,
  Col,
} from "react-bootstrap";
import MySpinner from "../layouts/MySpinner";
import ActionButtons from "../common/ActionButtons";
import ConfirmDeleteModal from "../common/ConfirmDeleteModal";
import FormModal from "../common/FormModal";
import LoadMoreButton from "../common/LoadMoreButton";
import EvaluationCriteriaCollectionFormFields from "../evaluationCriteriaCollection/EvaluationCriteriaCollectionFormFields";
import { useEvaluationCriteriaCollectionData } from "../../hooks/useEvaluationCriteriaCollectionData";
import { useEvaluationCriteriaCollectionForm } from "../../hooks/useEvaluationCriteriaCollectionForm";
import { authApis, endpoints } from "../../configs/Apis";

const EvaluationCriteriaCollectionList = () => {
  const {
    data,
    pagination,
    collectionDetails,
    loadingDetails,
    loading,
    error,
    loadCollections,
    loadCriterias,
    loadCollectionDetails,
    loadCollectionForEdit,
    setPagination,
    setLoading,
    setError,
    setCollectionDetails,
    setData,
  } = useEvaluationCriteriaCollectionData();

  const {
    formData,
    resetForm,
    handleInputChange,
    handleCriteriaSelection,
    handleWeightChange,
    validateWeights,
    normalizeWeights,
    getTotalWeight,
    setFormData,
  } = useEvaluationCriteriaCollectionForm();

  const [modals, setModals] = useState({
    showDelete: false,
    showEdit: false,
    showAdd: false,
  });

  const [selectedCollection, setSelectedCollection] = useState(null);
  const [openAccordionKey, setOpenAccordionKey] = useState(null);

  useEffect(() => {
    loadCollections(pagination.collectionsPage);
  }, [pagination.collectionsPage, loadCollections]);

  useEffect(() => {
    loadCriterias(pagination.criteriasPage);
  }, [pagination.criteriasPage, loadCriterias]);

  const updateModal = useCallback((modalType, isOpen) => {
    setModals((prev) => ({ ...prev, [modalType]: isOpen }));
  }, []);

  const loadMore = useCallback(() => {
    if (!loading && pagination.collectionsPage > 0) {
      setPagination((prev) => ({
        ...prev,
        collectionsPage: prev.collectionsPage + 1,
      }));
    }
  }, [loading, pagination.collectionsPage, setPagination]);

  const loadMoreCriterias = useCallback(() => {
    if (!loading && pagination.criteriasPage > 0) {
      setPagination((prev) => ({
        ...prev,
        criteriasPage: prev.criteriasPage + 1,
      }));
    }
  }, [loading, pagination.criteriasPage, setPagination]);

  // Handle accordion select
  const handleAccordionSelect = useCallback(
    (eventKey) => {
      setOpenAccordionKey(eventKey);
      if (eventKey && !collectionDetails[eventKey]) {
        loadCollectionDetails(eventKey);
      }
    },
    [collectionDetails, loadCollectionDetails]
  );

  const handleEdit = useCallback(
    async (e, collection) => {
      e.stopPropagation();
      setSelectedCollection(collection);

      const collectionInfo = await loadCollectionForEdit(collection.id);

      if (collectionInfo) {
        const criteriaWeights = {};
        const evaluationCriterias = collectionInfo.evaluationCriterias || [];

        evaluationCriterias.forEach((criteria) => {
          criteriaWeights[criteria.id] = criteria.weight;
        });

        setFormData({
          name: collectionInfo.name,
          description: collectionInfo.description,
          selectedCriteriaIds: evaluationCriterias.map((criteria) => criteria.id),
          criteriaWeights,
        });

        updateModal("showEdit", true);
      }
    },
    [loadCollectionForEdit, setFormData, updateModal]
  );

  const handleDelete = useCallback(
    (e, collection) => {
      e.stopPropagation();
      setSelectedCollection(collection);
      updateModal("showDelete", true);
    },
    [updateModal]
  );

  const confirmDelete = useCallback(async () => {
    if (!selectedCollection) return;

    setLoading(true); // Thêm loading state

    try {
      await authApis().delete(
        `${endpoints["evaluation_criteria_collections"]}/${selectedCollection.id}`
      );

      // Reset to page 1 and reload data
      setPagination((prev) => ({ ...prev, collectionsPage: 1 }));
      setData((prev) => ({ ...prev, collections: [] }));
      setCollectionDetails({});
      await loadCollections(1);
      updateModal("showDelete", false);
      alert("Xóa bộ tiêu chí thành công!");
    } catch (err) {
      console.error("Error deleting collection:", err);
      alert("Không thể xóa bộ tiêu chí này!");
    } finally {
      setLoading(false); // Đảm bảo loading được tắt
    }
  }, [selectedCollection, setPagination, setData, setCollectionDetails, loadCollections, updateModal, setLoading]);

  const createSubmitData = useCallback(() => {
    return {
      name: formData.name.trim(),
      description: formData.description,
      evaluationCriterias: data.allCriterias
        .map((criteria) => ({
          id: criteria.id,
          name: criteria.name,
          description: criteria.description,
          maxPoint: criteria.maxPoint,
          weight: formData.selectedCriteriaIds.includes(criteria.id) 
            ? (formData.criteriaWeights[criteria.id] || 0) 
            : null,
          selectedForCollection: formData.selectedCriteriaIds.includes(criteria.id)
        }))
        .filter(criteria => criteria.selectedForCollection), // Only send selected criteria
      selectedCriteriaIds: formData.selectedCriteriaIds,
    };
  }, [formData, data.allCriterias]);

  const submitEdit = useCallback(
    async (e) => {
      if (e) e.preventDefault();
      if (!selectedCollection) return;

      const totalWeight = getTotalWeight();
      if (Math.abs(totalWeight - 1) > 0.01 && formData.selectedCriteriaIds.length > 0) {
        setError("Tổng các trọng số phải bằng 100%");
        return;
      }

      setLoading(true);

      try {
        const submitData = {
          ...createSubmitData(),
          id: selectedCollection.id,
        };

        await authApis().put(
          `${endpoints["evaluation_criteria_collections"]}/${selectedCollection.id}`,
          submitData
        );

        // Reset to page 1 and reload data
        setPagination((prev) => ({ ...prev, collectionsPage: 1 }));
        setData((prev) => ({ ...prev, collections: [] }));
        setCollectionDetails({});
        await loadCollections(1);
        updateModal("showEdit", false);
        alert("Cập nhật bộ tiêu chí thành công!");
      } catch (err) {
        console.error("Error updating collection:", err);
        alert("Không thể cập nhật bộ tiêu chí này!");
      } finally {
        setLoading(false);
      }
    },
    [
      selectedCollection,
      getTotalWeight,
      formData.selectedCriteriaIds.length,
      setError,
      setLoading,
      createSubmitData,
      setPagination,
      setData,
      setCollectionDetails,
      loadCollections,
      updateModal,
    ]
  );

  const submitAdd = useCallback(
    async (e) => {
      if (e) e.preventDefault();

      const totalWeight = getTotalWeight();
      if (Math.abs(totalWeight - 1) > 0.01 && formData.selectedCriteriaIds.length > 0) {
        setError("Tổng các trọng số phải bằng 100%");
        return;
      }

      setLoading(true);

      try {
        await authApis().post(
          endpoints["evaluation_criteria_collections"],
          createSubmitData()
        );

        // Reset to page 1 and reload data
        setPagination((prev) => ({ ...prev, collectionsPage: 1 }));
        setData((prev) => ({ ...prev, collections: [] }));
        setCollectionDetails({});
        await loadCollections(1);
        updateModal("showAdd", false);
        alert("Thêm bộ tiêu chí thành công!");
      } catch (err) {
        console.error("Error adding collection:", err);
        alert("Không thể thêm bộ tiêu chí này!");
      } finally {
        setLoading(false);
      }
    },
    [
      getTotalWeight,
      formData.selectedCriteriaIds.length,
      setError,
      setLoading,
      createSubmitData,
      setPagination,
      setData,
      setCollectionDetails,
      loadCollections,
      updateModal,
    ]
  );

  const handleShowAddModal = useCallback(() => {
    resetForm();
    updateModal("showAdd", true);
  }, [resetForm, updateModal]);

  if (loading && data.collections.length === 0) {
    return <MySpinner />;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <>
      <h1 className="mb-4">Danh sách bộ tiêu chí chấm điểm</h1>

      <Row className="mb-3 justify-content-end">
        <Col xs="auto">
          <Button variant="success" onClick={handleShowAddModal}>
            + Thêm bộ tiêu chí
          </Button>
        </Col>
      </Row>

      {data.collections.length > 0 ? (
        <>
          <Accordion
            className="mb-4"
            activeKey={openAccordionKey}
            onSelect={handleAccordionSelect}
          >
            {data.collections.map((collection) => {
              const collectionId = collection.id.toString();
              const detailedCollection = collectionDetails[collectionId];
              const isLoadingDetail = loadingDetails[collectionId];

              const evaluationCriterias =
                detailedCollection?.evaluationCriterias ||
                collection.evaluationCriterias ||
                [];

              return (
                <Accordion.Item key={collection.id} eventKey={collectionId}>
                  <Accordion.Header>
                    <div className="d-flex justify-content-between align-items-center w-100 pe-4">
                      <span className="fw-bold">{collection.name}</span>
                      <div className="d-flex align-items-center">
                        <ActionButtons
                          onEdit={(e) => handleEdit(e, collection)}
                          onDelete={(e) => handleDelete(e, collection)}
                          insideAccordion={true}
                        />
                      </div>
                    </div>
                  </Accordion.Header>

                  <Accordion.Body>
                    <p className="text-muted mb-3">{collection.description}</p>

                    {isLoadingDetail ? (
                      <div className="text-center py-3">
                        <MySpinner />
                        <p className="text-muted mt-2">Đang tải chi tiết...</p>
                      </div>
                    ) : evaluationCriterias.length > 0 ? (
                      <Card>
                        <Card.Body>
                          <Table striped bordered hover>
                            <thead>
                              <tr>
                                <th>Tên tiêu chí</th>
                                <th>Mô tả</th>
                                <th>Điểm tối đa</th>
                                <th>Trọng số</th>
                              </tr>
                            </thead>
                            <tbody>
                              {evaluationCriterias.map((criteria) => (
                                <tr key={criteria.id}>
                                  <td>{criteria.name}</td>
                                  <td>{criteria.description}</td>
                                  <td className="text-center">
                                    {criteria.maxPoint}
                                  </td>
                                  <td className="text-center">
                                    {/* Chuyển trọng số từ tỷ lệ sang phần trăm */}
                                    {(criteria.weight * 100).toFixed(1)}%
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                        </Card.Body>
                      </Card>
                    ) : (
                      <Alert variant="info">Bộ tiêu chí này chưa có tiêu chí nào</Alert>
                    )}
                  </Accordion.Body>
                </Accordion.Item>
              );
            })}
          </Accordion>

          {pagination.collectionsPage > 0 && <LoadMoreButton loadMore={loadMore} />}
        </>
      ) : (
        <Alert variant="info">Không có bộ tiêu chí nào!</Alert>
      )}

      {/* Modals */}
      <ConfirmDeleteModal
        show={modals.showDelete}
        onHide={() => updateModal("showDelete", false)}
        onConfirm={confirmDelete}
        itemName={selectedCollection?.name}
        itemType="bộ tiêu chí"
        disabled={loading} // Thêm prop này
      />

      <FormModal
        show={modals.showEdit}
        onHide={() => updateModal("showEdit", false)}
        onSubmit={submitEdit}
        title="Chỉnh sửa bộ tiêu chí"
        size="lg"
        disableSubmit={loading} // Thêm prop này
      >
        <EvaluationCriteriaCollectionFormFields
          formData={formData}
          onInputChange={handleInputChange}
          onCriteriaSelection={handleCriteriaSelection}
          onWeightChange={handleWeightChange}
          onNormalizeWeights={normalizeWeights}
          allCriterias={data.allCriterias}
          criteriasPage={pagination.criteriasPage}
          onLoadMoreCriterias={loadMoreCriterias}
          validateWeights={validateWeights}
          getTotalWeight={getTotalWeight}
        />
      </FormModal>

      <FormModal
        show={modals.showAdd}
        onHide={() => updateModal("showAdd", false)}
        onSubmit={submitAdd}
        title="Thêm bộ tiêu chí mới"
        submitLabel="Thêm mới"
        size="lg"
        disableSubmit={loading} // Thêm prop này
      >
        <EvaluationCriteriaCollectionFormFields
          formData={formData}
          onInputChange={handleInputChange}
          onCriteriaSelection={handleCriteriaSelection}
          onWeightChange={handleWeightChange}
          onNormalizeWeights={normalizeWeights}
          allCriterias={data.allCriterias}
          criteriasPage={pagination.criteriasPage}
          onLoadMoreCriterias={loadMoreCriterias}
          validateWeights={validateWeights}
          getTotalWeight={getTotalWeight}
        />
      </FormModal>
    </>
  );
};

export default EvaluationCriteriaCollectionList;
