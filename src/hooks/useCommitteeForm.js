import { useState, useCallback } from 'react';

const initialFormData = {
  defenseDate: null,
  location: "",
  members: [
    { position: 1, lecturerId: "", role: "Chủ tịch" },
    { position: 2, lecturerId: "", role: "Thư ký" },
    { position: 3, lecturerId: "", role: "Phản biện" },
    { position: 4, lecturerId: "", role: "Thành viên" },
    { position: 5, lecturerId: "", role: "Thành viên" },
  ],
  thesesIds: [],
  status: null,
  isActive: null,
};

export const useCommitteeForm = () => {
    const [formData, setFormData] = useState(initialFormData);

    const resetForm = useCallback(() => {
        setFormData(initialFormData);
    }, []);

    const handleInputChange = useCallback((event) => {
        const { name, value } = event.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }, []);

    const handleDateChange = useCallback((date) => {
      // Nếu date là string từ input datetime-local
      if (typeof date === 'string') {
        setFormData(prev => ({ ...prev, defenseDate: date }));
      } else if (date instanceof Date) {
        // Nếu date là Date object, convert sang string format
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const dateString = `${year}-${month}-${day}T${hours}:${minutes}`;
        setFormData(prev => ({ ...prev, defenseDate: dateString }));
      } else {
        setFormData(prev => ({ ...prev, defenseDate: date }));
      }
    }, []);

    const handleMemberChange = useCallback((position, lecturerId) => {
        setFormData(prev => ({
            ...prev,
            members: prev.members.map(member => 
                member.position === position ? { ...member, lecturerId } : member
            )
        }));
    }, []);

    const handleThesesSelection = useCallback((thesisId) => {
      setFormData(prev => {
        // Đảm bảo thesesIds luôn là array
        const currentIds = Array.isArray(prev.thesesIds) ? prev.thesesIds : [];
        
        if (currentIds.includes(thesisId)) {
          return {
            ...prev,
            thesesIds: currentIds.filter(id => id !== thesisId)
          };
        } else {
          return {
            ...prev,
            thesesIds: [...currentIds, thesisId]
          };
        }
      });
    }, []);

    return {
        formData,
        setFormData,
        resetForm,
        handleInputChange,
        handleDateChange,
        handleMemberChange,
        handleThesesSelection
    };
};