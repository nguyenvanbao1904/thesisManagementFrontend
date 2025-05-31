import React from 'react';
import { Table, Button, Card, Alert, Badge, Spinner } from 'react-bootstrap';
import { getStatusBadge, getStudentInfo, formatStudentsInfo } from '../../utils/assignmentHelpers';

const SupervisorThesesTab = ({ assignments, loading, onViewDetail }) => {
  return (
    <Card>
      <Card.Header>
        <h5>Khóa luận được phân công hướng dẫn</h5>
      </Card.Header>
      <Card.Body>
        {assignments.supervisorTheses.length === 0 && !loading && (
          <Alert variant="warning">
            Bạn chưa được phân công hướng dẫn khóa luận nào.
          </Alert>
        )}
        
        {assignments.supervisorTheses.length > 0 && (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Tên khóa luận</th>
                <th>Sinh viên</th>
                <th>Hội đồng</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {assignments.supervisorTheses.map((thesis) => (
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
                      onClick={() => onViewDetail(thesis, 'supervisor')}
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

export default SupervisorThesesTab;