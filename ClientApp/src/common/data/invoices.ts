interface InvoiceProps {
  id: number;
  invoiceId: string;
  date: string;
  billingName: string;
  amount: string;
  status: string;
  badgecolor: string;
}

const invoiceList: Array<InvoiceProps> = [
  {
    id: 1,
    invoiceId: "#DS0215",
    date: "12 Oct, 2020",
    billingName: "Connie Franco",
    amount: "$26.30",
    status: "Paid",
    badgecolor: "success",
  },
  {
    id: 2,
    invoiceId: "#DS0214",
    date: "11 Oct, 2020",
    billingName: "Paul Reynolds",
    amount: "$24.20",
    status: "Paid",
    badgecolor: "success",
  },
  {
    id: 3,
    invoiceId: "#DS0213",
    date: "10 Oct, 2020",
    billingName: "Ronald Patterson",
    amount: "$20.20",
    status: "Pending",
    badgecolor: "warning",
  },
  {
    id: 4,
    invoiceId: "#DS0212",
    date: "09 Oct, 2020",
    billingName: "Adella Perez",
    amount: "$16.80",
    status: "Paid",
    badgecolor: "success",
  },
  {
    id: 5,
    invoiceId: "#DS0211",
    date: "08 Oct, 2020",
    billingName: "Theresa Mayers",
    amount: "$22.00",
    status: "Paid",
    badgecolor: "success",
  },
  {
    id: 6,
    invoiceId: "#DS0210",
    date: "07 Oct, 2020",
    billingName: "Michael Wallace",
    amount: "$15.60",
    status: "Paid",
    badgecolor: "success",
  },
  {
    id: 7,
    invoiceId: "#DS0209",
    date: "06 Oct, 2020",
    billingName: "Oliver Gonzales",
    amount: "$26.50",
    status: "Pending",
    badgecolor: "warning",
  },
  {
    id: 8,
    invoiceId: "#DS0208",
    date: "05 Oct, 2020",
    billingName: "David Burke",
    amount: "$24.20",
    status: "Paid",
    badgecolor: "success",
  },
  {
    id: 0,
    invoiceId: "#DS0207",
    date: "04 Oct, 2020",
    billingName: "Willie Verner",
    amount: "$21.30",
    status: "Pending",
    badgecolor: "warning",
  },
  {
    id: 10,
    invoiceId: "#DS0206",
    date: "03 Oct, 2020",
    billingName: "Felix Perry",
    amount: "$22.60",
    status: "Paid",
    badgecolor: "success",
  },
];

export { invoiceList };
