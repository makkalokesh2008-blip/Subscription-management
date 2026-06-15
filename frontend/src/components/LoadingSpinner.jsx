const LoadingSpinner = ({ label = "Loading" }) => {
  return (
    <div className="loading-state">
      <div className="spinner-ring" />
      <span>{label}</span>
    </div>
  );
};

export default LoadingSpinner;
