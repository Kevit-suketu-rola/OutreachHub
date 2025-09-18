import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Campaign, fetchAllCampaigns } from '@/redux/slices/campaignSlice';
import type { AppDispatch, RootState } from '@/redux/store';

export const description = 'An interactive area chart';

const chartConfig = {
  visitors: {
    label: 'Visitors',
  },
  running: {
    label: 'Running',
    color: 'var(--primary)',
  },
} satisfies ChartConfig;

export const AdminCampaignsChart: React.FC<{ campaigns: Campaign[] }> = ({ campaigns }) => {
  // const { campaigns } = useSelector((state: RootState) => state.campaign);
  const dispatch = useDispatch<AppDispatch>();

  React.useEffect(() => {
    dispatch(fetchAllCampaigns());
  }, [dispatch]);

  type CampaignChartData = {
    month: number;
    campaigns: number;
  };

  const chartData: CampaignChartData[] = [];
  campaigns.map((campaign: Campaign) => {
    const month = new Date(campaign.creationDate as string).getMonth();

    const idx = chartData.findIndex((item: CampaignChartData) => item.month === month);
    if (idx !== -1 && chartData[idx]) {
      chartData[idx].campaigns += 1;
    } else {
      chartData.push({ month, campaigns: 1 });
    }
    return 0;
  });

  chartData.sort((a: CampaignChartData, b: CampaignChartData) => a.month - b.month);

  return (
    <Card className="@container/card sm:w-[50%] sm:py-6">
      <CardHeader>
        <CardTitle>Total Campaigns</CardTitle>
        <CardDescription>
          {/* <span className="hidden @[540px]/card:block"> remove
            Total campaigns
          </span> */}
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="rgba(70,70,250,0.7)" stopOpacity={1.0} />
                <stop offset="95%" stopColor="rgba(70,70,250,0.7)" stopOpacity={0.1} />
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
                  'Jan',
                  'Feb',
                  'Mar',
                  'Apr',
                  'May',
                  'Jun',
                  'Jul',
                  'Aug',
                  'Sep',
                  'Oct',
                  'Nov',
                  'Dec',
                ];
                return months[month] || 'unknown';
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(_, i) => {
                    const month = i[0]?.payload.month;
                    const date = new Date(2025, month, 1);

                    return date.toLocaleDateString('en-US', {
                      month: 'long',
                      year: 'numeric',
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
