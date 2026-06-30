import "../App.css";

function DashboardCard({ icon, title, value }) {
  return (
    <div className="dashboard-card">
      <div className="card-icon">
        {icon}
      </div>

      <h3>{title}</h3>

      <p>{value}</p>
    </div>
  );
}

export default DashboardCard;