import formatDate from "./FormatDate";

export const formatCommitteeLabel = (committee) => {
  const parts = [`HĐ ID: ${committee.id}`];
  
  if (committee.location) {
    parts.push(committee.location);
  }
  
  if (committee.defenseDate) {
    parts.push(formatDate(committee.defenseDate));
  }
  
  return parts.join(' - ');
};

export const formatLecturerLabel = (lecturer) => {
  const name = `${lecturer.firstName} ${lecturer.lastName}`;
  return lecturer.academicDegree ? `${name} - ${lecturer.academicDegree}` : name;
};