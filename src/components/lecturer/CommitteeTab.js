import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Alert, Row, Col, Badge, Spinner } from 'react-bootstrap';
import { getStatusBadge, getRoleBadge, getStudentInfo, getLecturerInfo, formatStudentsInfo, formatLecturersInfo } from '../../utils/assignmentHelpers';

/**
 * Tab hiển thị thông tin các hội đồng mà giảng viên là thành viên
 */
const CommitteeTab = ({
  assignments,         // Dữ liệu công việc
  committees,          // Danh sách hội đồng
  loading,             // Trạng thái loading
  onViewDetail,        // Hàm xem chi tiết khóa luận
  onEvaluateThesis,    // Hàm chấm điểm khóa luận
  loadThesisDetails    // Hàm tải chi tiết khóa luận
}) => {
  // State lưu thông tin khóa luận theo hội đồng
  const [committeeThesesMap, setCommitteeThesesMap] = useState({});
  // State lưu trạng thái loading từng hội đồng
  const [loadingCommittees, setLoadingCommittees] = useState({});

  // Xử lý dữ liệu khi committees hoặc assignments thay đổi
  useEffect(() => {
    if (!committees || committees.length === 0) return;
    
    const processCommitteesData = async () => {
      const thesesMap = {};
      
      // Xử lý từng committee
      for (const committee of committees) {
        // Đánh dấu committee này đang loading
        setLoadingCommittees(prev => ({...prev, [committee.id]: true}));
        
        // Tạo map để lưu unique theses
        const uniqueTheses = new Map();
        
        // 1. Thêm từ supervisorTheses và reviewerTheses trước
        const supervisorTheses = assignments?.supervisorTheses?.filter(
          thesis => thesis.committeeId === committee.id
        ) || [];
        
        const reviewerTheses = assignments?.reviewerTheses?.filter(
          thesis => thesis.committeeId === committee.id
        ) || [];
        
        // Thêm vào map, tránh duplicate
        supervisorTheses.forEach(thesis => {
          uniqueTheses.set(thesis.id, {...thesis, roles: ['supervisor']});
        });
        
        reviewerTheses.forEach(thesis => {
          if (uniqueTheses.has(thesis.id)) {
            uniqueTheses.get(thesis.id).roles.push('reviewer');
          } else {
            uniqueTheses.set(thesis.id, {...thesis, roles: ['reviewer']});
          }
        });
        
        // 2. Thêm từ thesesIds trong committee
        if (committee.thesesIds && committee.thesesIds.length > 0) {
          for (const thesisId of committee.thesesIds) {
            // Bỏ qua nếu đã có trong map
            if (uniqueTheses.has(thesisId)) continue;
            
            // Kiểm tra có trong cache không
            if (loadThesisDetails) {
              // Thêm placeholder trước
              uniqueTheses.set(thesisId, {
                id: thesisId,
                title: `Khóa luận #${thesisId}`,
                description: 'Đang tải thông tin...',
                committeeId: committee.id,
                needsLoadDetails: true,
                roles: ['committee_member']
              });
              
              // Tải thông tin chi tiết (không đợi)
              loadThesisDetails(thesisId)
                .then(thesisData => {
                  if (thesisData) {
                    // Cập nhật map khi có dữ liệu
                    setCommitteeThesesMap(prev => {
                      // Tìm lại committee đó trong map
                      if (!prev[committee.id]) return prev;
                      
                      const updatedTheses = [...prev[committee.id]];
                      const index = updatedTheses.findIndex(t => t.id === thesisId);
                      
                      if (index !== -1) {
                        updatedTheses[index] = {
                          ...thesisData,
                          committeeId: committee.id,
                          roles: ['committee_member']
                        };
                      }
                      
                      return {
                        ...prev,
                        [committee.id]: updatedTheses
                      };
                    });
                  }
                })
                .catch(err => console.error(`Error loading thesis ${thesisId}:`, err));
            }
          }
        }
        
        // Lưu danh sách thesis cho committee này
        thesesMap[committee.id] = Array.from(uniqueTheses.values());
        
        // Đánh dấu đã load xong
        setLoadingCommittees(prev => ({...prev, [committee.id]: false}));
      }
      
      setCommitteeThesesMap(thesesMap);
    };
    
    processCommitteesData();
  }, [committees, assignments, loadThesisDetails]);
  
  /**
   * Hiển thị thông tin thành viên của một hội đồng
   */
  const renderCommitteeMembers = () => {
    if (!assignments.committeeMembers?.length) return null;
    
    return (
      <Alert variant="success" className="mb-3">
        <strong>Thông tin hội đồng:</strong><br/>
        {assignments.committeeMembers.map((member, index) => (
          <div key={index}>
            • Hội đồng #{member.committeeId} - {getRoleBadge(member.role)} 
            - {member.lecturerName} ({member.academicDegree})
          </div>
        ))}
      </Alert>
    );
  };
  
  /**
   * Hiển thị một hàng trong bảng khóa luận
   */
  const renderThesisRow = (thesis, committee, index) => {
    // Kiểm tra xem thesis có thông tin chi tiết không
    const hasStudents = thesis.students && thesis.students.length > 0;
    const hasLecturers = thesis.lecturers && thesis.lecturers.length > 0;
    const isLoading = thesis.needsLoadDetails;
    
    return (
      <tr key={`${committee.id}-${thesis.id}-${index}`}>
        <td>
          <strong className={isLoading ? "text-muted" : ""}>
            {thesis.title}
          </strong>
          <br />
          <small className="text-muted">{thesis.description}</small>
          {isLoading && (
            <Badge bg="warning" text="dark" className="ms-1">
              Đang tải thông tin...
            </Badge>
          )}
        </td>
        <td>
          {hasStudents ? (
            <span>{formatStudentsInfo(thesis.students)}</span>
          ) : (
            <span className="text-muted">{getStudentInfo(thesis.studentIds)}</span>
          )}
        </td>
        <td>
          <small>
            GVHD: {hasLecturers ? formatLecturersInfo(thesis.lecturers) : getLecturerInfo(thesis.lecturerIds)}
            <br/>
            Phản biện: {thesis.reviewerName || 'N/A'}
          </small>
        </td>
        <td>
          <small className="text-muted">
            {thesis.evaluationCriteriaCollectionName || 'Chưa có bộ tiêu chí'}
          </small>
        </td>
        <td>
          {thesis.averageScore ? 
            <strong className="text-success">
              {thesis.averageScore.toFixed(2)}
            </strong> : 
            <span className="text-muted">Chưa có</span>
          }
        </td>
        <td>
          <div className="d-grid gap-1">
            <Button 
              variant="primary"
              size="sm"
              onClick={() => onEvaluateThesis(committee, thesis)}
              disabled={committee.status !== 'ACTIVE' || isLoading}
              className="mb-1"
            >
              {isLoading ? 
                <><Spinner as="span" size="sm" animation="border" className="me-1" />Đang tải...</> :
                <><i className="fas fa-star me-1"></i>Chấm điểm</>
              }
            </Button>
            
            <Button 
              variant="outline-info"
              size="sm"
              onClick={() => onViewDetail(thesis, 'committee')}
              disabled={isLoading}
            >
              <i className="fas fa-eye me-1"></i>
              Chi tiết
            </Button>
          </div>
        </td>
      </tr>
    );
  };

  /**
   * Hiển thị thông tin về một committee
   */
  const renderCommitteeCard = (committee) => {
    const theses = committeeThesesMap[committee.id] || [];
    const isLoading = loadingCommittees[committee.id];
    
    return (
      <Card key={committee.id} className="mb-3">
        <Card.Header>
          <Row className="align-items-center">
            <Col>
              <strong>Hội đồng #{committee.id}</strong> - {getRoleBadge(committee.memberRole)}
            </Col>
            <Col xs="auto">
              {getStatusBadge(committee.status)}
            </Col>
          </Row>
          <div className="mt-2">
            <small className="text-muted">
              <strong>Ngày bảo vệ:</strong> {formatDate(committee.defenseDate)} | 
              <strong> Địa điểm:</strong> {committee.location || 'N/A'}
            </small>
          </div>
        </Card.Header>
        <Card.Body>
          {isLoading && renderLoadingSpinner()}
          
          {!isLoading && theses.length > 0 && renderThesisTable(theses, committee)}
          
          {!isLoading && theses.length === 0 && (
            <Alert variant="info">
              Hội đồng này chưa có khóa luận nào.
            </Alert>
          )}
        </Card.Body>
      </Card>
    );
  };

  /**
   * Hiển thị loading spinner
   */
  const renderLoadingSpinner = () => (
    <div className="text-center py-4">
      <Spinner animation="border" variant="primary" />
      <p className="mt-2">Đang tải danh sách khóa luận...</p>
    </div>
  );

  /**
   * Hiển thị bảng danh sách khóa luận
   */
  const renderThesisTable = (theses, committee) => (
    <div>
      <Alert variant="info" className="mb-3">
        <strong>Có {theses.length} khóa luận trong hội đồng này</strong>
      </Alert>
      
      <Table striped bordered hover size="sm">
        <thead>
          <tr>
            <th>Khóa luận</th>
            <th>Sinh viên</th>
            <th>GVHD/Phản biện</th>
            <th>Bộ tiêu chí</th>
            <th>Điểm trung bình</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {theses.map((thesis, index) => renderThesisRow(thesis, committee, index))}
        </tbody>
      </Table>
    </div>
  );

  /**
   * Định dạng ngày tháng
   */
  const formatDate = (dateString) => {
    return dateString ? new Date(dateString).toLocaleString('vi-VN') : 'N/A';
  };

  // Render component chính
  return (
    <Card>
      <Card.Header>
        <h5>Hội đồng được phân công</h5>
      </Card.Header>
      <Card.Body>
        {committees.length === 0 && !loading && (
          <Alert variant="warning">
            Bạn chưa được phân công vào hội đồng nào.
          </Alert>
        )}

        {renderCommitteeMembers()}

        {committees.map(committee => renderCommitteeCard(committee))}
      </Card.Body>
    </Card>
  );
};

export default React.memo(CommitteeTab);