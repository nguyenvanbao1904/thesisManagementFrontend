import { Button } from "react-bootstrap";

const LoadMoreButton = ({loadMore}) => {
  return (
    <div className="text-center mb-2">
      <Button variant="info" onClick={loadMore}>
        Xem thêm
      </Button>
    </div>
  );
};

export default LoadMoreButton;
