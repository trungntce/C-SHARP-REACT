import { Link } from "react-router-dom";

const LinkBox = ({ title, equipName }: any) => {
  return (
    <div
      style={{
        display: "flex",
        color: "#f5d900",
        fontWeight: "bold",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Link to={`/pre/${equipName}`}>
        <button
          type="button"
          className="btn btn-soft-primary btn-rounded"
          style={{ fontSize: "1.5rem" }}
        >
          {title}
          {/* <Icon name="bar-chart" size={40} />　 */}
        </button>
      </Link>
    </div>
  );
};

export default LinkBox;
