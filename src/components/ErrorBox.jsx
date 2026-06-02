const ErrorBox = ({ message }) => (
    <div
        style={{
            background: "#FEF2F2",
            border: "1px solid #FECACA",
            borderRadius: "10px",
            padding: "10px 14px",
            color: "#DC2626",
            fontSize: "13px",
            fontWeight: 600,
        }}
    >
        ⚠️ {message}
    </div>
);

export default ErrorBox;
