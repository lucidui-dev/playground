import { signal, computed, mount } from "@lucidui-dev/core";
import { Page, Grid, Segmented } from "@lucidui-dev/core/ui";
import { StatTile, DotColumns, Waffle, ChartCard } from "@lucidui-dev/core/viz";

const RANGES = {
  week: { orders: [12, 18, 15, 22, 19, 26, 21], revenue: 48200, change: 12, mix: [52, 31, 17] },
  month: { orders: [64, 72, 58, 81, 77, 90, 85], revenue: 196400, change: 7, mix: [47, 36, 17] }
};
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function Dashboard() {
  const range = signal("week");
  const r = computed(() => RANGES[range.value]);
  const orders = computed(() => r.value.orders.reduce((a, b) => a + b, 0));

  return Page({
    title: "Overview",
    description: "How the shop is doing.",
    width: "lg",
    actions: Segmented({ value: range, size: "sm", aria: { label: "Range" }, options: [{ value: "week", label: "This week" }, { value: "month", label: "This month" }] })
  },
    Grid({ min: 200, gap: 4 },
      StatTile({ label: "Revenue", value: () => r.value.revenue, unit: "USD", delta: () => r.value.change, deltaLabel: "vs last period", trend: () => r.value.orders }),
      StatTile({ label: "Orders", value: orders, delta: 6, trend: () => r.value.orders }),
      StatTile({ label: "Refund rate", value: 1.7, unit: "%", delta: -4, upIsGood: false })),
    Grid({ min: 320, gap: 4 },
      ChartCard({ title: "Orders by day", table: () => ({ columns: ["Day", "Orders"], rows: r.value.orders.map((v, i) => [DAYS[i], v]) }) },
        DotColumns({ data: () => r.value.orders.map((value, i) => ({ label: DAYS[i], value })), height: 180, unit: "orders" })),
      ChartCard({ title: "Where orders came from" },
        Waffle({ segments: () => [{ label: "Organic", value: r.value.mix[0] }, { label: "Paid", value: r.value.mix[1] }, { label: "Direct", value: r.value.mix[2] }] }))));
}

mount(Dashboard, "#app");
