import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  // CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/redux/store";
import { getAllCampaignsForUser } from "@/redux/slices/campaignSlice";

export const description = "An interactive area chart";

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  running: {
    label: "Running",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

export function UserCampaignsChart() {
  const { userCampaigns } = useSelector((state: RootState) => state.campaign);
  const dispatch = useDispatch<AppDispatch>();

  React.useEffect(() => {
    dispatch(getAllCampaignsForUser());
  }, [dispatch]);

  const chartData: any = [];
  userCampaigns.map((campaign) => {
    const month = new Date(campaign.creationDate).getMonth();

    const idx = chartData.findIndex((item: any) => item.month === month);
    if (idx !== -1) {
      chartData[idx].campaigns += 1;
    } else {
      chartData.push({ month, campaigns: 1 });
    }
    return 0;
  });

  chartData.sort((a: any, b: any) => a.month - b.month);

  return (
    <Card className="@container/card w-[100%] sm:py-6">
      <CardHeader>
        <CardTitle>My Campaigns</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            all over campaigns creation
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="rgba(70,70,250,0.7)"
                  stopOpacity={1.0}
                />
                <stop
                  offset="95%"
                  stopColor="rgba(70,70,250,0.7)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(month) => {
                const months = [
                  "Jan",
                  "Feb",
                  "Mar",
                  "Apr",
                  "May",
                  "Jun",
                  "Jul",
                  "Aug",
                  "Sep",
                  "Oct",
                  "Nov",
                  "Dec",
                ];
                return months[month];
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(_, i) => {
                    const month = i[0].payload.month;
                    const date = new Date(2025, month, 1);

                    return date.toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />

            <Area
              dataKey="campaigns"
              type="natural"
              fill="url(#fillDesktop)"
              stroke="rgba(70,70,250,0.7)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
