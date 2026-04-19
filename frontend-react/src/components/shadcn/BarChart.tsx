
import { TrendingUp } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { User } from '@/redux/slices/userSlice';

export const description = 'A bar chart';

const chartConfig = {
  desktop: {
    label: 'Desktop',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig;

type UsersChartData = {
  month: number;
  users: number;
};

export const UserBarChart: React.FC<{ users: User[] }> = ({ users }) => {
  // const { users } = useSelector((state: RootState) => state.user);
  // const dispatch = useDispatch<AppDispatch>();

  // useEffect(() => {
  //   dispatch(fetchAllUsers());
  // }, [dispatch]);

  const chartData: UsersChartData[] = [];
  users.map((user) => {
    const month = new Date(user.joinDate || '').getMonth();

    const idx = chartData.findIndex((item: UsersChartData) => item.month === month);
    if (chartData[idx]) chartData[idx].users += 1;
    else chartData.push({ month, users: 1 });
    return 0;
  });

  chartData.sort((a: UsersChartData, b: UsersChartData) => a.month - b.month);

  return (
    <Card className="sm:w-[50%]">
      <CardHeader>
        <CardTitle>Users</CardTitle>
        <CardDescription>Number of Users per month</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
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

            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Bar dataKey="users" fill="rgba(70,70,250,0.7)" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Users <TrendingUp className="h-4 w-4" />
        </div>
      </CardFooter>
    </Card>
  );
}
