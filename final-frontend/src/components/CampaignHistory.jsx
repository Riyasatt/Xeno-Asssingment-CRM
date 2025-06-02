import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Eye, ArrowLeft } from "lucide-react";
import useCrmStore from "../store/crmStore";

//creates a string of rules using array
const convertRulesToReadableString = (rules) => {
  const operatorMap = {
    greater_than: "is greater than",
    less_than: "is less than",
    equals: "is equal to",
    not_equals: "is not equal to",
    contains: "contains",
    not_contains: "does not contain",
  };

  return rules
    .map((rule) => {
      const readableOperator = operatorMap[rule.operator] || rule.operator;
      return `${rule.field} ${readableOperator} ${rule.value}`;
    })
    .join(" AND ");
}

// Status badge utilities
const getStatusBadge = (status) => {
  const variants = {
    completed: "default",
    draft: "secondary",
    sending: "outline",
  };
  return (
    <Badge variant={variants[status] || "default"}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

const getDeliveryStatusBadge = (status) => {
  const variants = {
    delivered: "default",
    failed: "destructive",
    pending: "secondary",
  };
  return (
    <Badge variant={variants[status] || "secondary"}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

const getSuccessRate = (sent, failed) => {
  const total = sent + failed;
  if (total === 0) return "N/A";
  return `${((sent / total) * 100).toFixed(1)}%`;
};


export default function CampaignHistory() {
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [showDeliveryLogs, setShowDeliveryLogs] = useState(false);
  const { allCampaigns} = useCrmStore();
  const navigate = useNavigate();

  // Simulated delivery log data
  const mockDeliveryLogs = [
    {
      userId: "CUST001",
      message: "Welcome to our store! Enjoy 10% off your next purchase.",
      sentStatus: "delivered",
      sentAt: "2024-01-15 10:30:00",
    },
    {
      userId: "CUST002",
      message: "Welcome to our store! Enjoy 10% off your next purchase.",
      sentStatus: "delivered",
      sentAt: "2024-01-15 10:31:00",
    },
    {
      userId: "CUST003",
      message: "Welcome to our store! Enjoy 10% off your next purchase.",
      sentStatus: "failed",
      sentAt: "2024-01-15 10:32:00",
    },
    {
      userId: "CUST004",
      message: "Welcome to our store! Enjoy 10% off your next purchase.",
      sentStatus: "delivered",
      sentAt: "2024-01-15 10:33:00",
    },
  ];

  const handleViewLogs = (campaign) => {
    console.log(campaign);
    setSelectedCampaign(campaign);
    setShowDeliveryLogs(true);
  };

  const handleBack = () => {
    setShowDeliveryLogs(false);
    setSelectedCampaign(null);
  };

  if (showDeliveryLogs && selectedCampaign) {
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Campaigns
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Delivery Logs</h1>
            <p className="text-muted-foreground">
              Campaign: {selectedCampaign.name}
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Campaign Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Audience Size", value: selectedCampaign.audienceSize },
                { label: "Sent Count", value: selectedCampaign.sent },
                { label: "Failed Count", value: selectedCampaign.audienceSize - selectedCampaign.sent },
                {
                  label: "Success Rate",
                  value: selectedCampaign.audienceSize
                    ? (
                        (selectedCampaign.sent/selectedCampaign.audienceSize)*100
                    ).toFixed(2)
                    : "N/A",
                },
              ].map((item, i) => (
                <div key={i}>
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                  <p className="text-xl font-semibold">{item.value}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Delivery Details</CardTitle>
            <CardDescription>
              Detailed status of each message sent to users.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User ID</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Sent At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedCampaign.customers.map((log, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="font-medium">{log.customerId}</TableCell>
                    <TableCell className="max-w-sm truncate" >
                      {selectedCampaign.name}
                    </TableCell>
                    <TableCell>{getDeliveryStatusBadge(log.deliveryStatus)}</TableCell>
                    <TableCell>{log.sentAt}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Campaign Summary View
  const totalSent = allCampaigns.reduce((sum, c) => sum + c.sent, 0);
  const totalAudience = allCampaigns.reduce((sum, c) => sum + c.audienceSize, 0);
  const avgSuccess = totalAudience
    ? (
        (totalSent/totalAudience)*100
    ).toFixed(2)
    : "N/A";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Campaign History</h1>
        <p className="text-muted-foreground">
          Analyze past campaigns and view delivery logs
        </p>
      </div>

      {/* Metrics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm">
              Total Campaigns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{allCampaigns.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm">
              Total Sent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{totalSent}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm">
              Total Audience
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{totalAudience}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm">
              Avg. Success Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{`${avgSuccess}`}%</p>
          </CardContent>
        </Card>
      </div>

      {/* Campaign Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Campaigns</CardTitle>
          <CardDescription>
            Overview of your campaigns and performance.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Segment Rules</TableHead>
                <TableHead>Audience</TableHead>
                <TableHead>Sent</TableHead>
                <TableHead>Failed</TableHead>
                <TableHead>Success</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allCampaigns.map((campaign, id) => (
                <TableRow key={id}>
                  <TableCell className="font-medium">{campaign.name}</TableCell>
                  <TableCell className="truncate max-w-xs" >
                    {convertRulesToReadableString(campaign.rules)}
                  </TableCell>
                  <TableCell>{campaign.audienceSize}</TableCell>
                  <TableCell>{campaign.sent}</TableCell>
                  <TableCell>{campaign.audienceSize - campaign.sent}</TableCell>
                  <TableCell>{campaign.successRate}</TableCell>
                  <TableCell>{getStatusBadge(campaign.status)}</TableCell>
                  <TableCell>{campaign.createdAt}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewLogs(campaign)}
                      disabled={campaign.status === "draft"}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Logs
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
