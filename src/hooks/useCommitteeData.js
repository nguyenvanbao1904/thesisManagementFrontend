import { useCallback, useState } from "react";
import { authApis, endpoints } from "../configs/Apis";

export const useCommitteeData = () => {
    const [data, setData] = useState({
        committees: [],
        lecturers: [],
        locations: [],
        theses: [],
    });
    const [pagination, setPagination] = useState({
        committeesPage: 1,
        lecturersPage: 1,
        locationsPage: 1,
        thesesPage: 1,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Generic function to load data
    const loadData = useCallback(async (endpoint, role, pageNumber, dataKey, pageKey) => {
        setLoading(true);
        setError(null);
        try {
            let url = role 
                ? `${endpoints.users}?role=${role}&page=${pageNumber}`
                : `${endpoints[endpoint]}?page=${pageNumber}`;

            // Sửa lỗi syntax URL parameter
            if (endpoint === "theses") url += "&committeeId="; // chi lay ra nhung khoa luan chua co hoi dong
                
            const res = await authApis().get(url);

            if (res.data.length === 0) {
                setPagination(prev => ({ ...prev, [pageKey]: 0 }));
            } else {
                setData(prev => ({
                    ...prev,
                    [dataKey]: pageNumber === 1 ? res.data : [...prev[dataKey], ...res.data]
                }));
            }
        } catch (err) {
            setError(`Error loading ${dataKey}: ${err.message}`);
        } finally {
            setLoading(false);
        }
    }, []);

    // Thêm function riêng để load theses cho update committee
    const loadThesesForCommitteeUpdate = useCallback(async (committeeId) => {
        setLoading(true);
        try {
            // Chỉ cần load các khóa luận chưa có hội đồng để user có thể chọn thêm
            // Thông tin khóa luận hiện tại của hội đồng đã có sẵn từ API committees/{id}
            const unassignedUrl = `${endpoints.theses}?committeeId=`;
            const unassignedRes = await authApis().get(unassignedUrl);

            setData(prev => ({
                ...prev,
                theses: unassignedRes.data
            }));

            return unassignedRes.data;
        } catch (err) {
            setError(`Error loading theses for committee update: ${err.message}`);
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    const loadCommittees = useCallback((page) => 
        loadData("committees", null, page, "committees", "committeesPage"), [loadData]);

    const loadLecturers = useCallback((page) =>
        loadData("users", "ROLE_LECTURER", page, "lecturers", "lecturersPage"), [loadData]);

    const loadLocations = useCallback((page) =>
        loadData("committeesLocations", null, page, "locations", "locationsPage"), [loadData]);

    const loadTheses = useCallback((page) =>
        loadData("theses", null, page, "theses", "thesesPage"), [loadData]);

    const loadCommitteeById = useCallback(async (committeeId) => {
        setLoading(true);
        try {
            const res = await authApis().get(`${endpoints.committees}/${committeeId}`);
            
            // Đảm bảo các thuộc tính array luôn có giá trị
            const committeeData = {
                ...res.data,
                members: res.data.members || [],
                thesesIds: res.data.thesesIds || [],
            };
            
            console.log('Committee data loaded:', committeeData); // Debug log
            return committeeData;
        } catch (err) {
            console.error('Error loading committee:', err);
            setError(`Error loading committee: ${err.message}`);
            return null;
        } finally {
            setLoading(false);
        }
    }, [setLoading]);

    return {
        data,
        pagination,
        loading,
        error,
        loadCommittees,
        loadLecturers,
        loadLocations,
        loadTheses,
        loadThesesForCommitteeUpdate, // Thêm function mới
        loadCommitteeById,
        setPagination,
        setLoading,
    };
}

