import { useCallback, useEffect, useState } from "react";
import { useCommitteeData } from "../../hooks/useCommitteeData";
import { authApis, endpoints } from "../../configs/Apis";
import MySpinner from "../layouts/MySpinner";
import { Alert, Button, Col, Row, Table } from "react-bootstrap";
import ActionButtons from "../common/ActionButtons";
import LoadMoreButton from "../common/LoadMoreButton";
import formatDate from "../../utils/FormatDate";
import ConfirmDeleteModal from "../common/ConfirmDeleteModal";
import { useCommitteeForm } from "../../hooks/useCommitteeForm";
import CommitteeFormFields from "../committee/CommitteeFormFields";
import FormModal from "../common/FormModal";

const CommitteeList = () => {
  const {
    data,
    pagination,
    loading,
    error,
    loadCommittees,
    loadLecturers,
    loadLocations,
    loadTheses,
    loadThesesForCommitteeUpdate,
    loadCommitteeById,
    setPagination,
    setLoading,
  } = useCommitteeData();

  const {
    formData,
    setFormData,
    resetForm,
    handleInputChange,
    handleDateChange,
    handleMemberChange,
    handleThesesSelection,
  } = useCommitteeForm();

  const [modals, setModals] = useState({
    showDelete: false,
    showAdd: false,
    showEdit: false,
  });

  const [selectedCommittee, setSelectedCommittee] = useState(null);

  // load du lieu ban dau

  useEffect(() => {
    loadCommittees(pagination.committeesPage);
  }, [pagination.committeesPage, loadCommittees]);

  useEffect(() => {
    loadLecturers(pagination.lecturersPage);
  }, [pagination.lecturersPage, loadLecturers]);

  useEffect(() => {
    loadLocations(pagination.locationsPage);
  }, [pagination.locationsPage, loadLocations]);

  useEffect(() => {
    loadTheses(pagination.thesesPage);
  }, [pagination.thesesPage, loadTheses]);

  const updateModal = useCallback((modalType, isOpen) => {
    setModals((prev) => ({ ...prev, [modalType]: isOpen }));
  }, []);

  const loadMore = useCallback(() => {
    if (!loading && pagination.committeesPage > 0) {
      setPagination((prev) => ({
        ...prev,
        committeesPage: prev.committeesPage + 1,
      }));
    }
  }, [loading, pagination.committeesPage, setPagination]);

  const handleEdit = useCallback(
    async (e, committee) => {
      e.stopPropagation();
      setSelectedCommittee(committee);

      const committeeInfor = await loadCommitteeById(committee.id);

      if (committeeInfor) {
        const mappedMembers = [
          { position: 1, lecturerId: "", role: "Chủ tịch" },
          { position: 2, lecturerId: "", role: "Thư ký" },
          { position: 3, lecturerId: "", role: "Phản biện" },
          { position: 4, lecturerId: "", role: "Thành viên" },
          { position: 5, lecturerId: "", role: "Thành viên" },
        ];

        committeeInfor.committeeMembers?.forEach((member) => {
          let position;
          switch (member.role) {
            case "ROLE_CHAIRMAN":
              position = 1;
              break;
            case "ROLE_SECRETARY":
              position = 2;
              break;
            case "ROLE_REVIEWER":
              position = 3;
              break;
            case "ROLE_MEMBER":
              position = mappedMembers.find(
                (m) => m.position >= 4 && !m.lecturerId
              )
                ? mappedMembers.findIndex(
                    (m) => m.position >= 4 && !m.lecturerId
                  ) + 1
                : 4;
              break;
            default:
              position = 4;
          }

          if (position && mappedMembers[position - 1]) {
            mappedMembers[position - 1].lecturerId = member.lecturerId;
          }
        });

        await loadThesesForCommitteeUpdate(committee.id);
        setFormData({
          defenseDate: committeeInfor.defenseDate,
          location: committeeInfor.location,
          members: mappedMembers,
          // Sử dụng trực tiếp thesesIds từ API response
          thesesIds: Array.isArray(committeeInfor.thesesIds)
            ? committeeInfor.thesesIds
            : [],
          status: committeeInfor.status ? committeeInfor.status : null,
          isActive: committeeInfor.isActive ? committeeInfor.isActive : null,
        });

        updateModal("showEdit", true);
      }
    },
    [loadCommitteeById, loadThesesForCommitteeUpdate, updateModal, setFormData]
  );

  const handleDelete = useCallback(
    (e, committee) => {
      e.stopPropagation();
      setSelectedCommittee(committee);
      updateModal("showDelete", true);
    },
    [updateModal]
  );

  const confirmDelete = useCallback(async () => {
    if (!selectedCommittee) return;

    setLoading(true); // Thêm loading state

    try {
      await authApis().delete(
        `${endpoints["committees"]}/${selectedCommittee.id}`
      );

      // Reset về trang 1 và load lại data
      setPagination((prev) => ({ ...prev, committeesPage: 1 }));
      await loadCommittees(1);
      updateModal("showDelete", false);
      alert("Xóa hội đồng thành công!");
    } catch (err) {
      console.error("Error deleting committee:", err);
      alert("Không thể xóa hội đồng này!");
    } finally {
      setLoading(false); // Đảm bảo loading được tắt
    }
  }, [selectedCommittee, setPagination, loadCommittees, updateModal, setLoading]);

  // Helper function để tạo FormData cho API
  const createFormData = useCallback(() => {
    const formDataToSend = new FormData();

    // Convert date to correct format for backend
    if (formData.defenseDate) {
      // Nếu defenseDate là Date object, convert sang string
      let dateString;
      if (formData.defenseDate instanceof Date) {
        const year = formData.defenseDate.getFullYear();
        const month = String(formData.defenseDate.getMonth() + 1).padStart(2, '0');
        const day = String(formData.defenseDate.getDate()).padStart(2, '0');
        const hours = String(formData.defenseDate.getHours()).padStart(2, '0');
        const minutes = String(formData.defenseDate.getMinutes()).padStart(2, '0');
        dateString = `${year}-${month}-${day}T${hours}:${minutes}`;
      } else {
        // Nếu đã là string, sử dụng trực tiếp
        dateString = formData.defenseDate;
      }
      formDataToSend.append("defenseDate", dateString);
    }

    formDataToSend.append("location", formData.location);

    // Prepare member data arrays
    const memberLecturerIds = [];
    const memberRoles = [];

    formData.members.forEach((member) => {
      if (member.lecturerId) {
        memberLecturerIds.push(member.lecturerId);

        // Map role back to backend format
        let backendRole;
        switch (member.role) {
          case "Chủ tịch":
            backendRole = "CHAIRMAN";
            break;
          case "Thư ký":
            backendRole = "SECRETARY";
            break;
          case "Phản biện":
            backendRole = "REVIEWER";
            break;
          case "Thành viên":
            backendRole = "MEMBER";
            break;
          default:
            backendRole = "MEMBER";
        }
        memberRoles.push(backendRole);
      }
    });

    // Append member arrays to FormData
    memberLecturerIds.forEach((id) => {
      formDataToSend.append("memberLecturerId", id.toString());
    });
    memberRoles.forEach((role) => {
      formDataToSend.append("memberRole", role);
    });

    // Append theses IDs
    (formData.thesesIds || []).forEach((id) => {
      formDataToSend.append("thesesIds", id.toString());
    });

    if (formData.status) {
      formDataToSend.append("status", formData.status);
    }

    if (formData.isActive !== null) {
      formDataToSend.append("isActive", formData.isActive.toString());
    }

    return formDataToSend;
  }, [formData]);

  const submitEdit = useCallback(
    async (e) => {
      if (e) e.preventDefault();
      if (!selectedCommittee) return;

      setLoading(true);

      try {
        const formDataToSend = createFormData();
        formDataToSend.append("id", selectedCommittee.id.toString());

        await authApis().put(
          `${endpoints["committees"]}/${selectedCommittee.id}`,
          formDataToSend
        );

        // Reset về trang 1 và load lại data
        setPagination((prev) => ({ ...prev, committeesPage: 1 }));
        await loadCommittees(1);
        updateModal("showEdit", false);
        alert("Cập nhật hội đồng thành công!");
      } catch (err) {
        console.error("Error updating committee:", err);
        alert("Không thể cập nhật hội đồng này!");
      } finally {
        setLoading(false);
      }
    },
    [
      selectedCommittee,
      createFormData,
      setLoading,
      setPagination,
      loadCommittees,
      updateModal,
    ]
  );

  const submitAdd = useCallback(
    async (e) => {
      if (e) e.preventDefault();
      setLoading(true);

      try {
        await authApis().post(`${endpoints["committees"]}`, createFormData());

        // Reset về trang 1 và load lại data
        setPagination((prev) => ({ ...prev, committeesPage: 1 }));
        await loadCommittees(1);
        updateModal("showAdd", false);
        resetForm();
        alert("Thêm hội đồng thành công!");
      } catch (err) {
        console.error("Error adding committee:", err);
        alert("Không thể thêm hội đồng này!");
      } finally {
        setLoading(false);
      }
    },
    [
      createFormData,
      setLoading,
      setPagination,
      loadCommittees,
      updateModal,
      resetForm,
    ]
  );

  const handleShowAddModal = useCallback(() => {
    resetForm();
    // Khi thêm mới, chỉ load theses chưa có hội đồng
    loadTheses(1);
    updateModal("showAdd", true);
  }, [resetForm, loadTheses, updateModal]);

  if (loading && data.committees.length === 0) {
    return <MySpinner />;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <>
      <h1>Danh sách hội đồng</h1>
      <Row className="mb-3 justify-content-end">
        <Col xs="auto">
          <Button variant="success" onClick={handleShowAddModal}>
            + Thêm hội đồng
          </Button>
        </Col>
      </Row>
      {data.committees.length > 0 ? (
        <>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Ngày bảo vệ</th>
                <th>Địa điểm</th>
                <th>Trạng thái</th>
                <th>Được tạo bởi </th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {data.committees.map((committee) => (
                <tr key={committee.id}>
                  <td>{formatDate(committee.defenseDate)}</td>
                  <td>{committee.location}</td>
                  <td>{committee.status}</td>
                  <td>{committee.createdByName}</td>
                  <td>
                    <ActionButtons
                      onEdit={(e) => handleEdit(e, committee)}
                      onDelete={(e) => handleDelete(e, committee)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          {pagination.committeesPage > 0 && (
            <LoadMoreButton loadMore={loadMore} />
          )}
        </>
      ) : (
        <Alert>Không có hội đồng nào!</Alert>
      )}

      {/* Modal xác nhận xóa */}
      <ConfirmDeleteModal
        show={modals.showDelete}
        onHide={() => updateModal("showDelete", false)}
        onConfirm={confirmDelete}
        itemName={selectedCommittee?.id}
        itemType="hội đồng"
        disabled={loading} // Thêm prop này
      />

      {/* Modal chỉnh sửa */}
      <FormModal
        show={modals.showEdit}
        onHide={() => updateModal("showEdit", false)}
        onSubmit={submitEdit}
        title="Chỉnh sửa hội đồng"
        size="lg"
        staticBackdrop={true}
        disableSubmit={loading} // Thêm prop này
      >
        <CommitteeFormFields
          formData={formData}
          onInputChange={handleInputChange}
          onDateChange={handleDateChange}
          onMemberChange={handleMemberChange}
          onThesesSelection={handleThesesSelection}
          lecturers={data.lecturers}
          theses={data.theses}
          locations={data.locations}
        />
      </FormModal>

      {/* Modal thêm mới */}
      <FormModal
        show={modals.showAdd}
        onHide={() => updateModal("showAdd", false)}
        onSubmit={submitAdd}
        title="Thêm hội đồng mới"
        submitLabel="Thêm mới"
        size="lg"
        staticBackdrop={true}
        disableSubmit={loading} // Thêm prop này
      >
        <CommitteeFormFields
          formData={formData}
          onInputChange={handleInputChange}
          onDateChange={handleDateChange}
          onMemberChange={handleMemberChange}
          onThesesSelection={handleThesesSelection}
          lecturers={data.lecturers}
          theses={data.theses}
          locations={data.locations}
        />
      </FormModal>
    </>
  );
};

export default CommitteeList;
