import React from 'react';
import { Table, Button, Card, Alert, Badge } from 'react-bootstrap';
import { getStatusBadge, getStudentInfo, formatStudentsInfo } from '../../utils/assignmentHelpers';

const ReviewerThesesTab = ({ assignments, loading, onViewDetail }) => {
  return (
    <Card>
      <Card.Header>
        <h5>Khóa luận được phân công phản biện</h5>
      </Card.Header>
      <Card.Body>
        {assignments.reviewerTheses.length === 0 && !loading && (
          <Alert variant="warning">
            Bạn chưa được phân công phản biện khóa luận nào.
          </Alert>
        )}
        
        {assignments.reviewerTheses.length > 0 && (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Tên khóa luận</th>
                <th>Sinh viên</th>
                <th>GVHD</th>
                <th>Hội đồng</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {assignments.reviewerTheses.map((thesis) => (
                <tr key={thesis.id}>
                  <td>
                    <strong>{thesis.title}</strong>
                    <p className="text-muted small mb-0">{thesis.description}</p>
                  </td>
                  <td>
                    {thesis.students ? 
                      formatStudentsInfo(thesis.students) : 
                      getStudentInfo(thesis.studentIds)
                    }
                  </td>
                  <td>
                    {thesis.lecturerName || (thesis.lecturerIds && thesis.lecturerIds.length > 0 ? 
                      `ID: ${thesis.lecturerIds.join(', ')}` : 
                      'Chưa có GVHD'
                    )}
                  </td>
                  <td>
                    {thesis.committeeId ? (
                      <Badge bg="info">Hội đồng #{thesis.committeeId}</Badge>
                    ) : (
                      <Badge bg="secondary">Chưa có hội đồng</Badge>
                    )}
                  </td>
                  <td>{getStatusBadge(thesis.status)}</td>
                  <td>
                    <Button 
                      variant="outline-primary" 
                      size="sm"
                      onClick={() => onViewDetail(thesis, 'reviewer')}
                    >
                      <i className="fas fa-eye me-1"></i>
                      Chi tiết
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card.Body>
    </Card>
  );
};

export default ReviewerThesesTab;