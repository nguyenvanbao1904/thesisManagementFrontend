import { useEffect, useState } from "react";
import { authApis, endpoints } from "../../configs/Apis";
import MySpinner from "../layouts/MySpinner";
import {
  Alert,
  Table,
  Card,
  Badge,
  Accordion,
  Button,
  Form,
  Row,
  Col,
} from "react-bootstrap";

// Import các components chung
import ActionButtons from "../common/ActionButtons";
import ConfirmDeleteModal from "../common/ConfirmDeleteModal";
import FormModal from "../common/FormModal";

const EvaluationCriteriaCollectionList = () => {
  const [evaluationCriteriaCollections, setEvaluationCriteriaCollections] =
    useState([]);
  const [allCriterias, setAllCriterias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    selectedCriteriaIds: [],
    criteriaWeights: {},
  });

  useEffect(() => {
    loadEvaluationCriteriaCollections();
    fetchAllCriterias();
  }, []);

  const loadEvaluationCriteriaCollections = async () => {
    setLoading(true);
    try {
      const res = await authApis().get(
        endpoints["evaluation_criteria_collections"]
      );
      setEvaluationCriteriaCollections(res.data);
    } catch (err) {
      console.error("Error fetching evaluation criteria collections:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllCriterias = async () => {
    try {
      const res = await authApis().get(endpoints["evaluation_criterias"]);
      setAllCriterias(res.data);
    } catch (err) {
      console.error("Error fetching evaluation criterias:", err);
    }
  };

  const handleEdit = (collection, e) => {
    e.stopPropagation();
    setSelectedCollection(collection);

    const criteriaWeights = {};
    collection.evaluationCriterias.forEach((criteria) => {
      criteriaWeights[criteria.id] = criteria.weight;
    });

    setEditForm({
      name: collection.name,
      description: collection.description,
      selectedCriteriaIds: collection.evaluationCriterias.map(
        (criteria) => criteria.id
      ),
      criteriaWeights,
    });
    setShowEditModal(true);
  };

  const handleDelete = (collection, e) => {
    e.stopPropagation();
    setSelectedCollection(collection);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await authApis().delete(
        `${endpoints["evaluation_criteria_collections"]}/${selectedCollection.id}`
      );
      setEvaluationCriteriaCollections(
        evaluationCriteriaCollections.filter(
          (c) => c.id !== selectedCollection.id
        )
      );
      setShowDeleteModal(false);
    } catch (err) {
      console.error("Error deleting collection:", err);
      alert("Không thể xóa bộ tiêu chí này!");
    }
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCriteriaSelection = (criteriaId) => {
    setEditForm((prev) => {
      if (prev.selectedCriteriaIds.includes(criteriaId)) {
        const { criteriaWeights } = prev;
        const newWeights = { ...criteriaWeights };
        delete newWeights[criteriaId]; // Xóa trọng số của tiêu chí này

        return {
          ...prev,
          selectedCriteriaIds: prev.selectedCriteriaIds.filter(
            (id) => id !== criteriaId
          ),
          criteriaWeights: newWeights,
        };
      } else {
        // Nếu chưa tồn tại, thêm tiêu chí vào danh sách đã chọn
        const newSelectedIds = [...prev.selectedCriteriaIds, criteriaId];
        // Trọng số mặc định = 1 / số lượng tiêu chí (phân bổ đều)
        const defaultWeight = 1 / newSelectedIds.length;

        // Tính toán lại tất cả trọng số để phân bổ đều
        const newWeights = {};
        newSelectedIds.forEach((id) => {
          newWeights[id] = defaultWeight;
        });

        return {
          ...prev,
          selectedCriteriaIds: newSelectedIds,
          criteriaWeights: newWeights,
        };
      }
    });
  };

  //   Xử lý khi người dùng thay đổi trọng số của tiêu chí

  const handleWeightChange = (criteriaId, value) => {
    // Chuyển đổi giá trị từ phần trăm (0-100) sang tỷ lệ (0-1)
    const weightValue = parseFloat(value) / 100;

    setEditForm((prev) => {
      // Cập nhật trọng số mới cho tiêu chí
      const newWeights = {
        ...prev.criteriaWeights,
        [criteriaId]: weightValue,
      };

      return {
        ...prev,
        criteriaWeights: newWeights,
      };
    });
  };

  //    Kiểm tra tổng trọng số của các tiêu chí có bằng 1 (100%) không

  const validateWeights = () => {
    // Kiểm tra tổng trọng số có bằng 1 (100%) không
    const { criteriaWeights, selectedCriteriaIds } = editForm;
    if (selectedCriteriaIds.length === 0) return true; // Nếu không có tiêu chí nào, coi như hợp lệ

    // Tính tổng trọng số của tất cả tiêu chí đã chọn
    const sum = selectedCriteriaIds.reduce(
      (acc, id) => acc + (criteriaWeights[id] || 0),
      0
    );
    return Math.abs(sum - 1) < 0.01; // Cho phép sai số nhỏ (0.01) do làm tròn số
  };

  /**
   * Tự động chuẩn hóa trọng số để tổng bằng 1 (100%)
   */
  const normalizeWeights = () => {
    const { criteriaWeights, selectedCriteriaIds } = editForm;
    if (selectedCriteriaIds.length === 0) return; // Nếu không có tiêu chí nào, không làm gì

    // Tính tổng trọng số hiện tại
    const sum = selectedCriteriaIds.reduce(
      (acc, id) => acc + (criteriaWeights[id] || 0),
      0
    );
    if (sum === 0) return; // Tránh chia cho 0

    // Tính toán lại trọng số để tổng bằng 1
    const newWeights = {};
    selectedCriteriaIds.forEach((id) => {
      // Công thức: trọng số mới = trọng số cũ / tổng trọng số
      newWeights[id] = (criteriaWeights[id] || 0) / sum;
    });

    // Cập nhật state với trọng số đã chuẩn hóa
    setEditForm((prev) => ({
      ...prev,
      criteriaWeights: newWeights,
    }));
  };

  /**
   * Tính tổng trọng số hiện tại của các tiêu chí đã chọn
   * @returns {number} - Tổng trọng số
   */
  const getTotalWeight = () => {
    const { criteriaWeights, selectedCriteriaIds } = editForm;
    return selectedCriteriaIds.reduce(
      (acc, id) => acc + (criteriaWeights[id] || 0),
      0
    );
  };

  //    Xử lý khi người dùng lưu thay đổi bộ tiêu chí
  const submitEdit = async (e) => {
    if (e) e.preventDefault(); // Ngăn chặn form submit mặc định

    // Validate total weight is close to 1 (100%)
    const totalWeight = getTotalWeight();
    if (
      Math.abs(totalWeight - 1) > 0.01 &&
      editForm.selectedCriteriaIds.length > 0
    ) {
      alert("Tổng các trọng số phải bằng 100%");
      return;
    }

    // Chuẩn bị dữ liệu để gửi lên API theo cấu trúc DTO của backend
    const updateData = {
      id: selectedCollection.id,
      name: editForm.name.trim(),
      description: editForm.description,
      evaluationCriterias: allCriterias
        .filter((criteria) =>
          editForm.selectedCriteriaIds.includes(criteria.id)
        )
        .map((criteria) => ({
          id: criteria.id,
          weight: editForm.criteriaWeights[criteria.id] || 0,
        })),
      selectedCriteriaIds: editForm.selectedCriteriaIds,
    };
    
    try {
      // Gọi API cập nhật bộ tiêu chí
      console.log(updateData);
      await authApis().put(
        `${endpoints["evaluation_criteria_collections"]}/${selectedCollection.id}`,
        updateData
      );
      // Tải lại danh sách sau khi cập nhật
      loadEvaluationCriteriaCollections();
      setShowEditModal(false); // Đóng modal chỉnh sửa
    } catch (err) {
      console.error("Error updating collection:", err);
      alert("Không thể cập nhật bộ tiêu chí này!");
    }
  };

  const submitAdd = async (e) => {
    if (e) e.preventDefault(); // Ngăn chặn form submit mặc định

    // Validate total weight is close to 1 (100%)
    const totalWeight = getTotalWeight();
    if (
      Math.abs(totalWeight - 1) > 0.01 &&
      editForm.selectedCriteriaIds.length > 0
    ) {
      alert("Tổng các trọng số phải bằng 100%");
      return;
    }

    // Chuẩn bị dữ liệu để gửi lên API theo cấu trúc DTO của backend
    const updateData = {
      name: editForm.name.trim(),
      description: editForm.description,
      evaluationCriterias: allCriterias
        .filter((criteria) =>
          editForm.selectedCriteriaIds.includes(criteria.id)
        )
        .map((criteria) => ({
          id: criteria.id,
          weight: editForm.criteriaWeights[criteria.id] || 0,
        })),
      selectedCriteriaIds: editForm.selectedCriteriaIds,
    };

    try {
      // Gọi API thêm bộ tiêu chí
      console.log(updateData);
      await authApis().post(
        endpoints["evaluation_criteria_collections"],
        updateData
      );
      // Tải lại danh sách sau khi thêm
      loadEvaluationCriteriaCollections();
      setShowAddModal(false); // Đóng modal thêm
    } catch (err) {
      console.error("Error adding collection:", err);
      alert("Không thể thêm bộ tiêu chí mới!");
    }
  };

  const handleShowAddModal = () => {
    setEditForm({
      name: "",
      description: "",
      selectedCriteriaIds: [],
      criteriaWeights: {},
    });
    setShowAddModal(true);
  };

  // Component con để hiển thị danh sách tiêu chí và trọng số
  const CriteriaSelectionForm = () => {
    return (
      <>
        <h5>Chọn tiêu chí và trọng số</h5>
        {/* Hiển thị cảnh báo nếu tổng trọng số không hợp lệ */}
        {!validateWeights() && (
          <Alert variant="warning" className="mt-2">
            Tổng các trọng số ({(getTotalWeight() * 100).toFixed(1)}%) phải
            bằng 100%
            {/* Nút tự động điều chỉnh trọng số */}
            <Button
              variant="link"
              className="p-0 ms-2"
              onClick={normalizeWeights}
            >
              Tự động điều chỉnh
            </Button>
          </Alert>
        )}
        {/* Danh sách tiêu chí để chọn */}
        <div
          style={{ maxHeight: "300px", overflowY: "auto" }}
          className="border p-3 rounded mt-3"
        >
          {allCriterias.map((criteria) => {
            // Kiểm tra xem tiêu chí đã được chọn chưa
            const isSelected = editForm.selectedCriteriaIds.includes(
              criteria.id
            );
            return (
              // Thẻ hiển thị mỗi tiêu chí, thêm viền màu xanh nếu đã chọn
              <Card
                key={criteria.id}
                className={`mb-2 ${isSelected ? "border-primary" : ""}`}
              >
                <Card.Body className="py-2">
                  <Row className="align-items-center">
                    <Col xs={7}>
                      {/* Checkbox để chọn/bỏ chọn tiêu chí */}
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
                        onChange={() =>
                          handleCriteriaSelection(criteria.id)
                        }
                      />
                    </Col>
                    <Col xs={5}>
                      {/* Hiển thị trường nhập trọng số nếu tiêu chí được chọn */}
                      {isSelected && (
                        <Form.Group>
                          <Form.Label className="mb-0">
                            Trọng số (%)
                          </Form.Label>
                          <Form.Control
                            type="number"
                            min="0"
                            max="100"
                            step="1"
                            value={Math.round(
                              (editForm.criteriaWeights[criteria.id] || 0) *
                                100
                            )}
                            onChange={(e) =>
                              handleWeightChange(
                                criteria.id,
                                e.target.value
                              )
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
        </div>
      </>
    );
  };

  // Component con để hiển thị form chung cho cả thêm và sửa bộ tiêu chí
  const CollectionFormFields = () => {
    return (
      <>
        <Form.Group className="mb-3">
          <Form.Label>Tên bộ tiêu chí</Form.Label>
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

        <hr className="my-4" />

        <CriteriaSelectionForm />
      </>
    );
  };

  return loading ? (
    // Hiển thị spinner khi đang tải dữ liệu
    <MySpinner />
  ) : (
    <>
      <h1 className="mb-4">Danh sách bộ tiêu chí chấm điểm</h1>
      
      <Row className="mb-3 justify-content-end">
        <Col xs="auto">
          <Button variant="success" onClick={handleShowAddModal}>
            + Thêm bộ tiêu chí
          </Button>
        </Col>
      </Row>
      
      {evaluationCriteriaCollections.length > 0 ? (
        // Hiển thị danh sách bộ tiêu chí nếu có dữ liệu
        <>
          {/* Danh sách dạng accordion, mỗi item là một bộ tiêu chí */}
          <Accordion className="mb-4">
            {evaluationCriteriaCollections.map((collection) => (
              <Accordion.Item
                key={collection.id}
                eventKey={collection.id.toString()}
              >
                {/* Header của mỗi bộ tiêu chí, hiển thị tên và các nút chức năng */}
                <Accordion.Header>
                  <div className="d-flex justify-content-between align-items-center w-100 pe-4">
                    <span className="fw-bold">{collection.name}</span>
                    <div className="d-flex align-items-center">
                      {/* Badge hiển thị số lượng tiêu chí trong bộ */}
                      <Badge bg="info" className="me-3">
                        {collection.evaluationCriterias.length} tiêu chí
                      </Badge>
                      {/* Nút Sửa và Xóa */}
                      <ActionButtons
                        onEdit={(e) => handleEdit(collection, e)}
                        onDelete={(e) => handleDelete(collection, e)}
                      />
                    </div>
                  </div>
                </Accordion.Header>
                {/* Body của mỗi bộ tiêu chí, hiển thị khi accordion được mở */}
                <Accordion.Body>
                  {/* Mô tả bộ tiêu chí */}
                  <p className="text-muted mb-3">{collection.description}</p>
                  {/* Bảng danh sách các tiêu chí trong bộ */}
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
                          {/* Hiển thị từng tiêu chí trong bộ */}
                          {collection.evaluationCriterias.map((criteria) => (
                            <tr key={criteria.id}>
                              <td>{criteria.name}</td>
                              <td>{criteria.description}</td>
                              <td className="text-center">
                                {criteria.maxPoint}
                              </td>
                              <td className="text-center">
                                {/* Chuyển trọng số từ tỷ lệ sang phần trăm */}
                                {criteria.weight * 100}%
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </Card.Body>
                  </Card>
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        </>
      ) : (
        // Hiển thị thông báo nếu không có dữ liệu
        <Alert variant="info">Không có bộ tiêu chí nào!</Alert>
      )}

      {/* Modal xác nhận xóa */}
      <ConfirmDeleteModal 
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        itemName={selectedCollection?.name}
        itemType="bộ tiêu chí"
      />

      {/* Modal chỉnh sửa */}
      <FormModal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        onSubmit={submitEdit}
        title="Chỉnh sửa bộ tiêu chí"
        size="lg"
        staticBackdrop={true}
        disableSubmit={!validateWeights() && editForm.selectedCriteriaIds.length > 0}
      >
        <CollectionFormFields />
      </FormModal>

      {/* Modal thêm mới */}
      <FormModal
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        onSubmit={submitAdd}
        title="Thêm bộ tiêu chí"
        submitLabel="Thêm mới"
        size="lg"
        staticBackdrop={true}
        disableSubmit={!validateWeights() && editForm.selectedCriteriaIds.length > 0}
      >
        <CollectionFormFields />
      </FormModal>
    </>
  );
};

export default EvaluationCriteriaCollectionList;
