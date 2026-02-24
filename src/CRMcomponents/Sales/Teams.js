import { useEffect, useState } from "react";
import { FaSearch, FaChevronDown, FaEnvelope, FaEllipsisV } from "react-icons/fa";
import config from '../../Apiconfig';
import { useNavigate } from "react-router-dom";

const styles = {
    // NOTE: The width is 380px. For a 4-column layout, we'll use Flexbox to make the card size dynamic.
    card: {
        width: "calc(25% - 24px)",
        minWidth: "300px",
        height: "150px",
        borderLeft: "4px solid #f1c40f",
        borderRadius: "6px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        backgroundColor: "#fff",
        margin: "12px",
        position: "relative",
        padding: "1rem",
        boxSizing: "border-box",
        cursor: "pointer"
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: "10px",
    },
    title: {
        color: "#343a40",
        margin: "0",
        fontSize: "18px",
        fontWeight: "bold",
    },
    ellipsis: {
        color: "#6c757d",
        fontSize: "14px",
        cursor: "pointer",
    },
    emailContainer: {
        display: "flex",
        alignItems: "center",
        marginBottom: "8px",
    },
    emailIcon: {
        marginRight: "8px",
        color: "#6c757d",
    },
    emailText: {
        color: "#555",
        fontSize: "15px",
        wordBreak: "break-all",
        margin: "0",
        padding: "0"
    },
    statusBadge: {
        position: "absolute",
        bottom: "6px",
        right: "6px",
        width: "24px",
        height: "24px",
        backgroundColor: "#28a745",
        color: "white",
        borderRadius: "4px",
        fontSize: "12px",
        fontWeight: "bold",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    cardContainer: {
        display: "flex",
        flexWrap: "wrap",
        padding: "16px 4px",
        backgroundColor: "white",
        marginTop: "10px"
    },
    bottomRow: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: "40px",
    },
    leadsText: {
        color: "#17a2b8",
        fontSize: "15px",
        margin: "0",
        padding: "0",
        fontWeight: "500",
    },
    statusBadge: {
        position: "static",
        width: "24px",
        height: "24px",
        backgroundColor: "#28a745",
        color: "white",
        borderRadius: "4px",
        fontSize: "12px",
        fontWeight: "bold",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
};

// Use the updated card style with responsive flex properties
const responsiveCardStyle = { ...styles.card };

const getColorByLetter = (letter) => {
    const colors = [
        "#28a745", // green
        "#17a2b8", // blue
        "#ffc107", // yellow
        "#fd7e14", // orange
        "#6f42c1", // purple
        "#e83e8c", // pink
        "#007bff", // sky blue
    ];

    // A → 65, B → 66, etc.
    const index = letter.charCodeAt(0) % colors.length;
    return colors[index];
};


// --- Kanban Card Component ---
const TeamCard = ({ name, email, NewCount, WonCount, QualifiedCount, ProposalCount, status, onClick }) => (
    <div style={responsiveCardStyle} onClick={onClick}>
        <div style={styles.header}>
            <h6 style={styles.title}>{name}</h6>
        </div>

        {email && (
            <div style={styles.emailContainer}>
                <FaEnvelope style={styles.emailIcon} />
                <p style={styles.emailText}>{email}</p>
            </div>
        )}

        <div style={styles.bottomRow}>
            <p style={styles.leadsText}>{NewCount} New</p>
            <p style={styles.leadsText}>{QualifiedCount} Qualified</p>
            <p style={styles.leadsText}>{ProposalCount} Proposal</p>
            <p style={styles.leadsText}>{WonCount} Won</p>

            {/* FIRST LETTER Badge */}
            <div
                style={{
                    ...styles.statusBadge,
                    backgroundColor: getColorByLetter(name?.charAt(0).toUpperCase()),
                    position: "static",
                }}
            >
                {name?.charAt(0).toUpperCase()}
            </div>
        </div>
    </div>
);

// --- Main Teams Component ---
const Teams = () => {
    const [teams, setTeams] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const response = await fetch(`${config.apiBaseUrl}/GetTeamName`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        company_code: sessionStorage.getItem("selectedCompanyCode"),
                    }),
                });
                if (response.ok) {
                    const data = await response.json();
                    setTeams(data);
                } else {
                    console.error("Failed to fetch team data");
                }
            } catch (error) {
                console.error("Error:", error);
            }
        };

        fetchTeams();
    }, []);

    const filteredTeams = teams.filter((t) =>
        t.Sales_Team?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCardClick = async (team) => {
        try {
            const response = await fetch(`${config.apiBaseUrl}/GetSalesTeam`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    SalesTeam_Code: team.Sales_ID,
                    company_code: sessionStorage.getItem("selectedCompanyCode"),
                }),
            });

            if (!response.ok) throw new Error("Failed to fetch sales team data");

            const data = await response.json();
            sessionStorage.setItem("selectedTeam", JSON.stringify(data));
            navigate("/Crmworkspace");

        } catch (error) {
            console.error("Error fetching sales team:", error);
        }
    };

    return (
        <div className="container-fluid Topnav-screen">
            <div className="d-flex justify-content-between align-items-center p-3 border-bottom shadow-sm bg-white">
                <h3 className="fw-bold text-dark mb-0">Teams</h3>
                <div className="flex-grow-1 d-flex justify-content-center">
                    <div className="input-group" style={{ maxWidth: "600px", width: "100%" }}>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <span className="input-group-text bg-white" title="Search" style={{ cursor: "pointer" }}>
                            <FaSearch className="text-muted" />
                        </span>
                    </div>
                </div>
                <div style={{ width: "60px" }}></div>
            </div>

            <div style={styles.cardContainer}>
                {filteredTeams.length > 0 ? (
                    filteredTeams.map((team, index) => (
                        <TeamCard
                            key={team.Sales_ID}
                            name={team.Sales_Team}
                            email={team.Email_alias}
                            NewCount={team.NewCount}
                            WonCount={team.WonCount}
                            QualifiedCount={team.QualifiedCount}
                            ProposalCount={team.ProposalCount}
                            status={index % 2 === 0 ? "V" : "Y"}
                            onClick={() => handleCardClick(team)}
                        />
                    ))
                ) : (
                    <p className="text-muted ms-3 mt-2">No teams found</p>
                )}
            </div>
        </div>
    );
};

export default Teams;
