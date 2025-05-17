import { useEffect, useState } from "react";
import { authApis, endpoints } from "../../configs/Apis";
import MySpinner from "../layouts/MySpinner";
import { Alert, Table } from "react-bootstrap";

const ThesesList = ()=>{
    const [theses, setTheses] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
    setLoading(true)
    const fetchTheses = async () => {
      try {
        const res = await authApis().get(endpoints["theses"]);
        setTheses(res.data);
      } catch (err) {
        console.error("Error fetching theses:", err);
      }
    };

    fetchTheses();
    setLoading(false)
  }, []);

  return (
    loading ? ( <MySpinner />) : (
    <> 
        {theses.length > 0 ? <>
        <h1>Danh sách khóa luận</h1>
        <Table striped bordered hover>
            <thead>
            <tr>
                <th>Tiêu đề</th>
                <th>Mô tả</th>
                <th>Trạng thái</th>
                <th>Giảng viên Phản biện</th>
                <th>Bộ tiêu chí chấm điểm</th>
                <th>Hội đồng chấm điểm</th>
                <th>Ngày bảo vệ</th>
            </tr>
            </thead>
            <tbody>
            {theses.map((thesis) => (
                <tr key={thesis.id}>
                <td>{thesis.title}</td>
                <td>{thesis.description}</td>
                <td>{thesis.status}</td>
                <td>{thesis.reviewer}</td>
                <td>{thesis.evaluationCriteriaCollection}</td>
                <td>{thesis.committee}</td>
                <td>{thesis.defenseDate}</td>
                </tr>
            ))}
            </tbody>
        </Table></> : <Alert>Không có khóa luận nào!</Alert>}
    </>
    )
  )
}

export default ThesesList;