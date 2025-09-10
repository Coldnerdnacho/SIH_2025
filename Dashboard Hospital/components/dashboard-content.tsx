"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

export default function DashboardContent() {
  // Editable stats state
  const [stats, setStats] = useState({
    doctors: 12,
    patients: 248,
    appointments: 32,
    medicines: 156,
  });

  // Multi-select doctors state
  const [selectedDoctors, setSelectedDoctors] = useState<string[]>([]);

  const doctorsList = [
    { id: "dr-jain", name: "Dr. S Jain" },
    { id: "dr-nair", name: "Dr. S Nair" },
    { id: "dr-ola", name: "Dr. Y Ola" },
    { id: "dr-shetty", name: "Dr. A Shetty" },
  ];

  const toggleDoctor = (id: string) => {
    setSelectedDoctors((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  };

  // Ensure non-negative values
  const handleChange = (field: keyof typeof stats, value: number) => {
    setStats({ ...stats, [field]: Math.max(0, value) });
  };

  return (
    <div
      style={{
        padding: "30px",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f0f2f5",
        minHeight: "100vh",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "bold", color: "#333", marginBottom: "20px" }}>
          Dashboard Overview
        </h1>

        {/* Stats Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "20px",
            marginBottom: "30px",
          }}
        >
          {Object.keys(stats).map((key) => (
            <Card key={key}>
              <CardHeader className="pb-2">
                <CardTitle style={{ fontSize: "14px", color: "#555" }}>{key.toUpperCase()}:</CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  type="number"
                  min={0}
                  value={stats[key as keyof typeof stats]}
                  onChange={(e) => handleChange(key as keyof typeof stats, Number(e.target.value))}
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                  }}
                />
              </CardContent>
            </Card>
          ))}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle style={{ fontSize: "14px", color: "#555" }}>DATE:</CardTitle>
            </CardHeader>
            <CardContent>
              <div style={{ fontSize: "14px", fontWeight: "500" }}>{new Date().toLocaleDateString()}</div>
            </CardContent>
          </Card>
        </div>

        {/* Doctors Section */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
          <Card>
            <CardHeader>
              <CardTitle style={{ fontSize: "18px", fontWeight: "600" }}>Our Doctors</CardTitle>
            </CardHeader>
            <CardContent>
              {doctorsList.map((doc) => (
                <div key={doc.id} style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                  <Checkbox
                    checked={selectedDoctors.includes(doc.id)}
                    onCheckedChange={() => toggleDoctor(doc.id)}
                    style={{ marginRight: "10px" }}
                  />
                  <span style={{ color: "#333" }}>{doc.name}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle style={{ fontSize: "18px", fontWeight: "600" }}>Weekly Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              <p style={{ color: "#555" }}>[Appointments chart/data goes here]</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
