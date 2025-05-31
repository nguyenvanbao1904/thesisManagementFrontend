import { Badge } from 'react-bootstrap';

/**
 * Tạo badge hiển thị trạng thái khóa luận
 * @param {string} status - Trạng thái
 * @returns {JSX.Element} Badge component
 */
export const getStatusBadge = (status) => {
  // Chỉ giữ lại các trạng thái hợp lệ
  const statusConfig = {
    // Trạng thái thesis
    'DRAFT': { bg: 'secondary', text: 'Nháp' },
    'IN_PROGRESS': { bg: 'primary', text: 'Đang thực hiện' },
    'COMPLETED': { bg: 'success', text: 'Hoàn thành' },
    
    // Trạng thái committee
    'ACTIVE': { bg: 'success', text: 'Hoạt động' },
    'LOCKED': { bg: 'secondary', text: 'Đã khóa' }
  };
  
  const config = statusConfig[status] || { bg: 'dark', text: status || 'Không xác định' };
  return <Badge bg={config.bg}>{config.text}</Badge>;
};

/**
 * Tạo badge hiển thị vai trò trong hội đồng
 * @param {string} role - Vai trò
 * @returns {JSX.Element} Badge component
 */
export const getRoleBadge = (role) => {
  const roleConfig = {
    'ROLE_CHAIRMAN': { bg: 'primary', text: 'Chủ tịch' },
    'ROLE_SECRETARY': { bg: 'info', text: 'Thư ký' },
    'ROLE_REVIEWER': { bg: 'warning', text: 'Phản biện' },
    'ROLE_MEMBER': { bg: 'secondary', text: 'Thành viên' }
  };
  
  const config = roleConfig[role] || { bg: 'secondary', text: role || 'Không xác định' };
  return <Badge bg={config.bg}>{config.text}</Badge>;
};

// Hiển thị thông tin sinh viên dạng string từ array students
export const formatStudentsInfo = (students) => {
  if (!students || students.length === 0) return "Chưa có sinh viên";
  
  return students.map(student => 
    `${student.fullName || `${student.firstName} ${student.lastName}`} (${student.studentId || 'ID: ' + student.id})`
  ).join(', ');
};

// Hiển thị thông tin giảng viên dạng string từ array lecturers
export const formatLecturersInfo = (lecturers) => {
  if (!lecturers || lecturers.length === 0) return "Chưa có GVHD";
  
  return lecturers.map(lecturer => {
    const academicPrefix = lecturer.academicDegree ? `${lecturer.academicDegree}. ` : '';
    const name = lecturer.fullName || `${lecturer.firstName} ${lecturer.lastName}`;
    return `${academicPrefix}${name}`;
  }).join(', ');
};

// Hiển thị tên sinh viên từ studentIds cho trường hợp không có đối tượng students
export const getStudentInfo = (studentIds) => {
  if (!studentIds || studentIds.length === 0) return "Chưa có sinh viên";
  return `ID: ${studentIds.join(', ')}`;
};

// Hiển thị tên giảng viên từ lecturerIds cho trường hợp không có đối tượng lecturers
export const getLecturerInfo = (lecturerIds) => {
  if (!lecturerIds || lecturerIds.length === 0) return "Chưa có GVHD";
  return `ID: ${lecturerIds.join(', ')}`;
};

// Lấy danh sách thesis cho committee (đơn giản hóa)
export const getThesesForCommittee = (assignments, committeeId) => {
  // Lọc thesis từ supervisorTheses và reviewerTheses có cùng committeeId
  const theses = [];
  
  // Thêm thesis từ supervisorTheses
  assignments.supervisorTheses.forEach(thesis => {
    if (thesis.committeeId === committeeId) {
      // Tránh duplicate bằng cách kiểm tra xem thesis có trong danh sách chưa
      if (!theses.some(t => t.id === thesis.id)) {
        theses.push({...thesis, source: 'supervisor'});
      }
    }
  });
  
  // Thêm thesis từ reviewerTheses
  assignments.reviewerTheses.forEach(thesis => {
    if (thesis.committeeId === committeeId) {
      // Kiểm tra đã tồn tại trong danh sách chưa
      const existingThesis = theses.find(t => t.id === thesis.id);
      if (existingThesis) {
        existingThesis.source = 'both'; // Đánh dấu thesis có cả 2 vai trò
      } else {
        theses.push({...thesis, source: 'reviewer'});
      }
    }
  });
  
  return theses;
};