import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import API_BASE from "./Consts";
// const API_BASE_URL = "http://localhost:5000"; // Change to your API URL

function SystemControllerOverview() {
  const [systemController, setSystemController] = useState(null);
  const [subclouds, setSubclouds] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/system-controller`, { headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` }})
      .then((res) => res.json())
      .then((data) => setSystemController(data))
      .catch((error) => console.error("Error fetching system controller:", error));

    fetch(`${API_BASE}/subclouds`, { headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` }})
      .then((res) => res.json())
      .then((data) => setSubclouds(data))
      .catch((error) => console.error("Error fetching subclouds:", error));
  }, []);

  return (
    <Card className="p-4 shadow-lg rounded-2xl">
      <Tabs defaultValue="overview">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">System Controller Overview</TabsTrigger>
          <TabsTrigger value="subclouds">Subclouds</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          {systemController ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Field</TableHead>
                  <TableHead>Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(systemController).map(([key, value]) => (
                  <TableRow key={key}>
                    <TableCell>{key}</TableCell>
                    <TableCell>{value}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p>Loading system controller details...</p>
          )}
        </TabsContent>

        <TabsContent value="subclouds">
          {subclouds.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subclouds
                  .filter((sc) => sc.parent_id === systemController?.id)
                  .map((sc) => (
                    <TableRow key={sc.id}>
                      <TableCell>{sc.id}</TableCell>
                      <TableCell>{sc.name}</TableCell>
                      <TableCell>{sc.status}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          ) : (
            <p>No subclouds found.</p>
          )}
        </TabsContent>
      </Tabs>
    </Card>
  );
}

// export default SystemControllerOverview